<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';
  import { Accordion, Combobox, RadioGroup, Select } from 'bits-ui';
  import { createProject, validateProject, type Project } from '../../lib/text-match/project';
  import { renderFrame, exportVideo, loadProjectFonts } from '../../lib/text-match/render';
  import { fetchFontCatalogue, loadGoogleFont } from '../../lib/text-match/fonts';
  let project = $state<Project>(createProject());
  let canvas: HTMLCanvasElement;
  let ready = $state(false);
  let playing = $state(false);
  let time = $state(0);
  let fits = $state(true);
  let error = $state('');
  let notice = $state('');
  let progress = $state<number | null>(null);
  let video = $state<Blob | null>(null);
  let videoUrl = $state('');
  let theme = $state('system');
  let safeAreas = $state(false);
  const curatedFonts = ['Roboto', 'Lora', 'Playfair Display', 'DM Sans', 'Space Grotesk'];
  let catalogue = $state<string[]>([...curatedFonts]);
  let search = $state('');
  let fontOpen = $state(false);
  let fontDisplay = $state('');
  $effect(() => { fontDisplay = project.fontFamily; });
  const systemFonts = ['Georgia', 'serif', 'sans-serif', 'Arial'];
  const fontOptions = $derived([...new Set([project.fontFamily, ...systemFonts, ...project.fonts.map((font) => font.family), ...catalogue])]);
  let fontsBusy = $state(false);
  let catalogueBusy = $state(false);
  let catalogueLoaded = false;
  let fontReady = $state(false);
  let previewAudio: AudioContext | undefined;
  let cutBuffer: AudioBuffer | undefined;
  let lastCut = -1;
  let fontPermission = $state(false);
  let recoveredDraft = $state('');
  let controller: AbortController | undefined;
  let animation = 0;
  let start = 0;
  let fontRequest = 0;
  const key = 'text-match-draft-v1';
  const ranges = [
      { key: 'duration', label: 'Duration', min: 1, max: 30, step: 1, unit: 's' },
      { key: 'cutSpeed', label: 'Cuts per second', min: 1, max: 30, step: 1, unit: '' },
      { key: 'zoom', label: 'Zoom', min: 1, max: 3, step: .05, unit: '×' },
      { key: 'blur', label: 'Surrounding blur', min: 0, max: 10, step: .1, unit: '' },
      { key: 'x', label: 'Horizontal position', min: .1, max: .9, step: .01, unit: '' },
      { key: 'y', label: 'Vertical position', min: .1, max: .9, step: .01, unit: '' },
      { key: 'texture', label: 'Paper grain', min: 0, max: 1, step: .01, unit: '' },
  ] as const;
  const colourFields = [['textColour', 'Ink'], ['paperColour', 'Paper'], ['highlightColour', 'Highlight']] as const;
  onMount(() => {
      try {
          const saved = localStorage.getItem(key);
          if (saved) {
              try {
                  project = validateProject(JSON.parse(saved));
                  notice = 'Draft restored.';
              }
              catch {
                  recoveredDraft = saved;
                  error = 'Saved draft could not be opened. Download it before resetting.';
              }
          }
          theme = localStorage.getItem('text-match-theme') || 'system';
      }
      catch {
          error = 'Browser storage unavailable. Download your project to keep your work.';
      }
      ready = true;
      void refreshFonts();
      return () => { ++fontRequest; stop(); controller?.abort(); if (videoUrl)
          URL.revokeObjectURL(videoUrl); };
  });
  $effect(() => {
      const snapshot = JSON.stringify(project);
      if (!ready)
          return;
      untrack(() => {
          if (!recoveredDraft) {
              try {
                  localStorage.setItem(key, snapshot);
              }
              catch {
                  error = 'Draft could not be saved: storage unavailable or full. Download your project.';
              }
          }
          video = null;
          if (videoUrl) {
              URL.revokeObjectURL(videoUrl);
              videoUrl = '';
          }
      });
  });
  $effect(() => { if (ready && canvas && fontReady && !fontsBusy) {
      try {
          fits = renderFrame(canvas, project, time).fits;
      }
      catch (cause) {
          fits = false;
          error = message(cause);
      }
  } });
  async function refreshFonts() {
      const request = ++fontRequest;
      fontsBusy = true;
      fontReady = false;
      try {
          await loadProjectFonts($state.snapshot(project));
          if (request !== fontRequest)
              return;
          fontReady = true;
          if (canvas)
              fits = renderFrame(canvas, project, time).fits;
      }
      catch (cause) {
          if (request === fontRequest)
              error = message(cause);
      }
      finally {
          if (request === fontRequest)
              fontsBusy = false;
      }
  }
  function message(cause: unknown) { return cause instanceof Error ? cause.message : String(cause); }
  function stop() { playing = false; cancelAnimationFrame(animation); if (previewAudio) {
      void previewAudio.close();
      previewAudio = undefined;
  } }
  async function play() {
      if (playing) {
          stop();
          return;
      }
      if (project.sound) {
          try {
              previewAudio = new AudioContext();
              await previewAudio.resume();
              if (previewAudio.state !== 'running')
                  throw new Error('Audio permission unavailable. Disable sound or enable browser audio.');
              cutBuffer = previewAudio.createBuffer(1, Math.ceil(previewAudio.sampleRate * .035), previewAudio.sampleRate);
              const samples = cutBuffer.getChannelData(0);
              for (let i = 0; i < samples.length; i++)
                  samples[i] = Math.sin(i * 2.37) * .13 * (1 - i / samples.length);
          }
          catch (cause) {
              stop();
              error = message(cause);
              return;
          }
      }
      lastCut = -1;
      playing = true;
      start = performance.now();
      const tick = (now: number) => {
          time = (now - start) / 1000;
          if (time >= project.duration) {
              time = 0;
              stop();
              return;
          }
          const cut = Math.floor(time * project.cutSpeed);
          if (previewAudio && cutBuffer && cut !== lastCut) {
              const source = previewAudio.createBufferSource();
              source.buffer = cutBuffer;
              source.connect(previewAudio.destination);
              source.start();
              lastCut = cut;
          }
          animation = requestAnimationFrame(tick);
      };
      animation = requestAnimationFrame(tick);
  }
  function preset(value: Project['preset']) {
      ++fontRequest;
      fontsBusy = false;
      fontReady = true;
      project.preset = value;
      project.fontFamily = value === 'clean' || value === 'magazine' ? 'Arial' : 'Georgia';
      const palettes = { newspaper: ['#20201d', '#f3eddc', '#f5df40'], book: ['#302820', '#eee4cd', '#dbbc7f'], magazine: ['#252533', '#f9eeee', '#e9a2bd'], clean: ['#181818', '#ffffff', '#b8ef83'] };
      [project.textColour, project.paperColour, project.highlightColour] = palettes[value];
      project.texture = value === 'clean' ? 0 : .15;
  }
  function download(blob: Blob, name: string) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function saveProject() {
      if (project.fonts.length && !fontPermission) {
          error = 'Confirm font embedding permission before downloading a portable project.';
          return;
      }
      try {
          download(new Blob([JSON.stringify(validateProject($state.snapshot(project)), null, 2)], { type: 'application/json' }), 'text-match.json');
      }
      catch (cause) {
          error = message(cause);
      }
  }
  async function importProject(event: Event) {
      const input = event.currentTarget as HTMLInputElement;
      const file = input.files?.[0];
      if (!file)
          return;
      const request = ++fontRequest;
      const previousReady = fontReady;
      fontsBusy = true;
      try {
          if (file.size > 30 * 1024 * 1024)
              throw new Error('Project exceeds 30 MB.');
          const candidate = validateProject(JSON.parse(await file.text()));
          if (request !== fontRequest)
              return;
          await loadProjectFonts(candidate);
          if (request !== fontRequest)
              return;
          stop();
          project = candidate;
          fontReady = true;
          time = 0;
          recoveredDraft = '';
          error = '';
          notice = 'Project imported.';
      }
      catch (cause) {
          if (request === fontRequest) {
              fontReady = previousReady;
              error = `Import rejected. Current draft preserved. ${message(cause)}`;
          }
      }
      finally {
          if (request === fontRequest)
              fontsBusy = false;
          input.value = '';
      }
  }
  function reset() {
      if (!confirm('Reset Text Match? Your current local draft will be replaced.'))
          return;
      ++fontRequest;
      stop();
      fontsBusy = false;
      fontReady = true;
      project = createProject();
      recoveredDraft = '';
      time = 0;
      error = '';
      notice = 'Project reset.';
  }
  async function findFonts() {
      if (catalogueLoaded || catalogueBusy) return;
      catalogueBusy = true;
      try {
          catalogue = [...new Set([...curatedFonts, ...await fetchFontCatalogue()])];
          catalogueLoaded = true;
      }
      catch (cause) {
          error = `Font catalogue unavailable. ${message(cause)}`;
      }
      finally {
          catalogueBusy = false;
      }
  }
  async function selectFont(family: string) {
      const request = ++fontRequest;
      const previousReady = fontReady;
      const weight = project.fontWeight;
      fontsBusy = true;
      try {
          if (!family) return;
          const existing = project.fonts.find((font) => font.family === family && font.weight === weight);
          if (!existing && !systemFonts.includes(family) && !catalogue.includes(family) && project.fonts.some((font) => font.family === family)) throw new Error('This font weight is unavailable. Choose another weight or upload its font file.');
          const font = existing ? $state.snapshot(existing) : systemFonts.includes(family) ? undefined : await loadGoogleFont(family, weight);
          if (request !== fontRequest)
              return;
          const snapshot = $state.snapshot(project);
          const candidate = validateProject({
              ...snapshot,
              fontFamily: family,
              fonts: font ? [...snapshot.fonts.filter((f) => !(f.family === font.family && f.weight === font.weight)), font] : snapshot.fonts,
          });
          await loadProjectFonts(candidate);
          if (request !== fontRequest)
              return;
          project = { ...$state.snapshot(project), fontFamily: candidate.fontFamily, fonts: candidate.fonts };
          fontReady = true;
          error = '';
      }
      catch (cause) {
          if (request === fontRequest) {
              fontReady = previousReady;
              error = `Font could not load. ${message(cause)}`;
          }
      }
      finally {
          if (request === fontRequest) {
              fontsBusy = false;
              await tick();
              if (request === fontRequest) fontDisplay = project.fontFamily;
          }
      }
  }
  async function uploadFont(event: Event) {
      const input = event.currentTarget as HTMLInputElement;
      const file = input.files?.[0];
      if (!file)
          return;
      const request = ++fontRequest;
      const previousReady = fontReady;
      fontsBusy = true;
      try {
          if (!fontPermission)
              throw new Error('Confirm you have permission to embed this font.');
          if (file.size > 5 * 1024 * 1024)
              throw new Error('Font must be smaller than 5 MB.');
          const extension = file.name.toLowerCase().split('.').pop();
          const mime = `font/${extension === 'otf' || extension === 'woff' || extension === 'woff2' ? extension : 'ttf'}`;
          const data = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () => reject(new Error('Font file could not be read.'));
              reader.readAsDataURL(new Blob([file], { type: mime }));
          });
          if (request !== fontRequest)
              return;
          const family = file.name.replace(/\.[^.]+$/, '').replace(/[^\w -]/g, '').trim() || 'Custom font';
          const snapshot = $state.snapshot(project);
          const candidate = validateProject({
              ...snapshot,
              fontFamily: family,
              fonts: [...snapshot.fonts.filter((font) => !(font.family === family && font.weight === snapshot.fontWeight)), { family, weight: snapshot.fontWeight, data, licence: 'User-confirmed embedding permission.' }],
          });
          await loadProjectFonts(candidate);
          if (request !== fontRequest)
              return;
          project = { ...$state.snapshot(project), fontFamily: candidate.fontFamily, fonts: candidate.fonts };
          fontReady = true;
          error = '';
      }
      catch (cause) {
          if (request === fontRequest) {
              fontReady = previousReady;
              error = message(cause);
          }
      }
      finally {
          if (request === fontRequest)
              fontsBusy = false;
          input.value = '';
      }
  }
  async function exportClip() {
      stop();
      error = '';
      progress = 0;
      controller = new AbortController();
      try {
          const snapshot = validateProject($state.snapshot(project));
          await loadProjectFonts(snapshot);
          const exported = await exportVideo(snapshot, (value) => progress = value, controller.signal);
          if (JSON.stringify(snapshot) !== JSON.stringify($state.snapshot(project)))
              throw new Error('Project changed during export. Export again to use your latest edits.');
          video = exported;
          if (!video.size)
              throw new Error('Export produced an empty file.');
          videoUrl = URL.createObjectURL(video);
          notice = '';
      }
      catch (cause) {
          error = message(cause);
      }
      finally {
          progress = null;
      }
  }
  async function copyVideo() {
      if (!video)
          return;
      try {
          if (!navigator.clipboard?.write || !globalThis.ClipboardItem || !ClipboardItem.supports?.(video.type))
              throw new Error('Video clipboard unavailable. Download or share the video instead.');
          await navigator.clipboard.write([new ClipboardItem({ [video.type]: video })]);
          notice = 'Video copied. Paste support depends on the destination.';
      }
      catch (cause) {
          error = `Could not copy video. ${message(cause)}`;
      }
  }
  async function shareVideo() {
      if (!video)
          return;
      const file = new File([video], `text-match.${video.type.includes('mp4') ? 'mp4' : 'webm'}`, { type: video.type });
      try {
          if (!navigator.canShare?.({ files: [file] }))
              throw new Error('File sharing unavailable. Download the video instead.');
          await navigator.share({ files: [file], title: 'Text Match' });
      }
      catch (cause) {
          error = message(cause);
      }
  }
</script>

<div class="editor" data-theme={theme}>
  <div class="workspace">
    <section class="preview" aria-label="Video preview">
      <div class="preview-meta"><div class="theme">
        <span id="text-match-theme-label">Theme</span>
        <Select.Root type="single" bind:value={theme} onValueChange={(value) => { try { localStorage.setItem('text-match-theme', value); } catch { error = 'Theme preference could not be saved.'; } }}>
          <Select.Trigger class="theme-trigger" aria-labelledby="text-match-theme-label">
            {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'} <span aria-hidden="true">⌄</span>
          </Select.Trigger>
          <Select.Content class="theme-menu" sideOffset={4} align="start">
            <Select.Viewport>
              {#each ['system', 'light', 'dark'] as value}
                <Select.Item {value} label={value[0].toUpperCase() + value.slice(1)}>
                  {value[0].toUpperCase() + value.slice(1)}
                  <span aria-hidden="true">{theme === value ? '✓' : ''}</span>
                </Select.Item>
              {/each}
            </Select.Viewport>
          </Select.Content>
        </Select.Root>
      </div><span>{project.format === 'landscape' ? '1920 × 1080' : project.format === 'square' ? '1080 × 1080' : '1080 × 1920'}</span></div>
      <div class="stage" class:landscape={project.format === 'landscape'} class:square={project.format === 'square'}>
        <canvas bind:this={canvas} aria-label={`Text Match artwork: ${project.phrase}`}></canvas>
        {#if safeAreas && ['tiktok', 'reels', 'shorts'].includes(project.format)}<div class="safe-area" class:tiktok={project.format === 'tiktok'} class:reels={project.format === 'reels'} aria-hidden="true"><span>{project.format} safe area</span></div>{/if}
      </div>
      <div class="transport"><button onclick={play} disabled={fontsBusy || !fontReady || progress !== null}>{playing ? 'Pause' : 'Play preview'}</button><span>{time.toFixed(1)} / {project.duration}s</span></div>
      {#if !fits}<p class="warning" role="status">Phrase does not fit this frame. Reduce zoom, move the focal point, or shorten your phrase. Text stays intact.</p>{/if}
    </section>
    <section class="controls" aria-label="Editor controls">
      <fieldset disabled={progress !== null}>
      <label class="phrase">Word or phrase<textarea bind:value={project.phrase} rows="2" maxlength="2000"></textarea></label>
      <RadioGroup.Root class="presets" orientation="horizontal" value={project.preset} onValueChange={(value) => preset(value as Project['preset'])} disabled={progress !== null} aria-label="Print preset">{#each ['newspaper', 'book', 'magazine', 'clean'] as value}<RadioGroup.Item {value}>{value}</RadioGroup.Item>{/each}</RadioGroup.Root>
      <label>Format<select bind:value={project.format}><option value="tiktok">TikTok · 9:16</option><option value="reels">Reels · 9:16</option><option value="shorts">Shorts · 9:16</option><option value="square">Square · 1:1</option><option value="landscape">Landscape · 16:9</option></select></label>
      <label class="check"><input type="checkbox" bind:checked={safeAreas} />Safe-area guides</label>
      <Accordion.Root type="multiple" disabled={progress !== null}><Accordion.Item value="timing"><Accordion.Header><Accordion.Trigger class="section-trigger">Timing & framing</Accordion.Trigger></Accordion.Header><Accordion.Content class="detail-body">{#each ranges as range}<label for={`text-match-${range.key}`}>{range.label}<output for={`text-match-${range.key}`}>{Number(project[range.key].toFixed(2))}{range.unit}</output><input id={`text-match-${range.key}`} type="range" min={range.min} max={range.max} step={range.step} bind:value={project[range.key]} /></label>{/each}<label>Shuffle seed<input type="number" min="0" max="2147483647" step="1" bind:value={project.seed} /></label><button onclick={() => project.seed = Math.floor(Math.random() * 2147483647)}>Shuffle cuts</button><label class="check"><input type="checkbox" bind:checked={project.sound} onchange={stop} />Sound</label></Accordion.Content></Accordion.Item>
      <Accordion.Item value="type"><Accordion.Header><Accordion.Trigger class="section-trigger">Font & colour</Accordion.Trigger></Accordion.Header><Accordion.Content class="detail-body"><label for="text-match-font">Font</label>
      <Combobox.Root type="single" bind:value={() => project.fontFamily, (family) => { fontDisplay = family || project.fontFamily; fontOpen = false; void selectFont(fontDisplay); }} inputValue={fontDisplay} bind:open={fontOpen} allowDeselect={true} disabled={progress !== null || fontsBusy} items={fontOptions.map((family) => ({ value: family, label: family }))} onOpenChange={(open) => { if (open) void findFonts(); else { search = ''; void tick().then(() => { if (!fontOpen && !fontsBusy) fontDisplay = project.fontFamily; }); } }}>
        <Combobox.Input id="text-match-font" placeholder="Search fonts" autocomplete="off" onfocus={(event) => { event.currentTarget.select(); search = ''; fontDisplay = ''; fontOpen = true; void findFonts(); }} oninput={(event) => search = event.currentTarget.value} />
        <Combobox.Content class="font-menu" sideOffset={4} preventScroll={false}>
          <Combobox.Viewport class="font-list">
            {#each fontOptions.filter((family) => family.toLowerCase().includes(search.toLowerCase())).slice(0, 60) as family (family)}
              <Combobox.Item value={family} label={family}>{family}</Combobox.Item>
            {:else}<p class="small">No fonts found.</p>{/each}
          </Combobox.Viewport>
          {#if catalogueBusy}<p class="small" role="status">Loading fonts…</p>{/if}
        </Combobox.Content>
      </Combobox.Root>
      <label>Weight<select bind:value={project.fontWeight} onchange={refreshFonts}>{#each [100,200,300,400,500,600,700,800,900] as weight}<option value={weight}>{weight}</option>{/each}</select></label>
      {#if fontsBusy}<p role="status">Loading fonts…</p>{/if}
      <div class="colours">{#each colourFields as [key, label]}<label>{label}<input type="color" bind:value={project[key]} /></label>{/each}</div><label>Highlight<select bind:value={project.highlight}><option value="marker">Marker</option><option value="underline">Underline</option><option value="box">Box</option><option value="none">None</option></select></label><label class="check"><input type="checkbox" bind:checked={fontPermission} />I have permission to embed these fonts in project files.</label><label class="file">Upload font<input type="file" accept=".woff,.woff2,.ttf,.otf" onchange={uploadFont} /></label></Accordion.Content></Accordion.Item>
      <Accordion.Item value="print"><Accordion.Header><Accordion.Trigger class="section-trigger">Print text</Accordion.Trigger></Accordion.Header><Accordion.Content class="detail-body"><label>Headline<input bind:value={project.headline} maxlength="2000" /></label><label>Body text<textarea bind:value={project.body} rows="5" maxlength="20000"></textarea></label></Accordion.Content></Accordion.Item>
      <Accordion.Item value="project"><Accordion.Header><Accordion.Trigger class="section-trigger">Project</Accordion.Trigger></Accordion.Header><Accordion.Content class="detail-body"><p class="small">Saved in this browser. Download a project to keep a backup.</p><button onclick={saveProject}>Download project</button><label class="file">Import project<input type="file" accept=".json,application/json" onchange={importProject} /></label>{#if recoveredDraft}<button onclick={() => download(new Blob([recoveredDraft], { type: 'application/json' }), 'text-match-recovery.json')}>Download unreadable draft</button>{/if}<button onclick={reset}>Reset project…</button></Accordion.Content></Accordion.Item>
      </Accordion.Root></fieldset>
      <div class="export"><button class="primary" onclick={exportClip} disabled={progress !== null || fontsBusy || !fontReady || !fits || !project.phrase.trim()}>Export video</button>{#if progress !== null}<progress max="1" value={progress} aria-label="Export progress"></progress><p role="status">Exporting {Math.round(progress * 100)}%</p><button onclick={() => controller?.abort()}>Cancel export</button>{/if}{#if video}<p>{video.type.includes('mp4') ? 'MP4' : 'WebM fallback'} · {(video.size / 1024 / 1024).toFixed(1)} MB</p><a class="download" href={videoUrl} download={`text-match.${video.type.includes('mp4') ? 'mp4' : 'webm'}`}>Download video</a><button onclick={copyVideo}>Copy video to clipboard</button><button onclick={shareVideo}>Share video</button>{/if}</div>
    </section>
  </div>
  {#if error}<div class="feedback warning" role="alert">{error}<button onclick={() => error = ''} aria-label="Dismiss error">×</button></div>{/if}
  {#if notice}<p class="feedback" role="status">{notice}</p>{/if}
</div>

<style>
.editor {
  --bg: #fafafa;
  --panel: #fff;
  --ink: #22231f;
  --muted: #666860;
  --field: #eeefeb;
  color: var(--ink);
  font: 14px/1.5 var(--font-sans, "Geist Sans", sans-serif);
  color-scheme: light;
}
.editor[data-theme="dark"] { --bg: #10110f; --panel: #191a17; --ink: #eeeee8; --muted: #aaaDA3; --field: #23241f; color-scheme: dark; }
@media (prefers-color-scheme: dark) {
  .editor[data-theme="system"] { --bg: #10110f; --panel: #191a17; --ink: #eeeee8; --muted: #aaada3; --field: #23241f; color-scheme: dark; }
}
:global(body:has(.editor[data-theme="dark"])) { --background: #10110f; --foreground: #eeeee8; --muted-foreground: #aaada3; --card: #191a17; color-scheme: dark; }
:global(body:has(.editor[data-theme="light"])) { --background: #fafafa; --foreground: #22231f; --muted-foreground: #666860; --card: #fff; color-scheme: light; }
.workspace { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 80px; align-items: start; }
.preview { min-width: 0; position: sticky; top: 24px; }
.preview-meta, .transport { display: flex; align-items: center; justify-content: space-between; gap: 16px; max-width: 420px; margin: 0 auto 20px; color: var(--muted); font-size: 12px; }
.theme { display: flex; align-items: center; gap: 10px; margin: 0; }
.editor :global(.theme-trigger) { display: flex; align-items: center; gap: 12px; min-height: 44px; border: 0; border-radius: 0; background: transparent; color: var(--ink); padding: 8px; cursor: pointer; font: inherit; }
.editor :global(.theme-menu) { z-index: 50; min-width: 140px; max-height: var(--bits-select-content-available-height); overflow-y: auto; background: var(--panel); color: var(--ink); box-shadow: 0 8px 30px #0002; padding: 6px; }
.editor :global([data-select-item]) { display: flex; justify-content: space-between; gap: 24px; min-height: 44px; align-items: center; padding: 10px; cursor: pointer; font-size: 14px; }
.editor :global([data-select-item][data-highlighted]) { background: var(--field); outline: 2px solid var(--ink); outline-offset: -2px; }
.editor :global([data-select-item][data-selected]) { font-weight: 600; }
.stage { position: relative; aspect-ratio: 9/16; width: min(100%, 360px); margin: auto; overflow: hidden; }
.stage.square { aspect-ratio: 1; width: 100%; }
.stage.landscape { aspect-ratio: 16/9; width: 100%; }
.stage canvas { display: block; width: 100%; height: 100%; }
.safe-area { position: absolute; inset: 9% 17% 23% 6%; border: 1px dashed #6d695ba8; pointer-events: none; }
.safe-area.reels { inset: 12% 14% 24% 6%; }
.safe-area.tiktok { inset: 10% 20% 22% 6%; }
.safe-area span { position: absolute; bottom: 5px; left: 6px; font: 9px monospace; color: #534f43; background: #fff; padding: 2px 4px; }
.transport { margin-top: 20px; }
.transport button { background: transparent; padding: 8px 0; text-decoration: underline; text-underline-offset: 4px; }
.controls, fieldset { min-width: 0; }
fieldset { border: 0; padding: 0; margin: 0; }
label { display: block; font-size: 12px; margin-bottom: 16px; }
input:not([type="checkbox"]), textarea, select, .editor :global([data-combobox-input]) { display: block; width: 100%; box-sizing: border-box; border: 0; border-radius: 0; padding: 10px 12px; background: var(--field); color: var(--ink); font: inherit; font-size: 14px; line-height: 1.4; margin-top: 6px; }
textarea { resize: vertical; }
.phrase { margin-bottom: 4px; }
.phrase textarea { background: transparent; font-size: 28px; font-weight: 400; line-height: 1.25; padding: 8px 0; }
.editor :global(.presets) { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-bottom: 22px; }
.editor :global([data-radio-group-item]) { border: 0; border-radius: 0; background: transparent; color: var(--muted); cursor: pointer; padding: 10px 0; font: inherit; font-size: 12px; text-transform: capitalize; }
.editor :global([data-radio-group-item][data-state="checked"]) { color: var(--ink); text-decoration: underline; text-underline-offset: 7px; text-decoration-thickness: 2px; }
button, .download { border: 0; border-radius: 0; background: var(--field); color: var(--ink); padding: 11px 14px; cursor: pointer; font: inherit; font-size: 12px; line-height: 1.5; text-decoration: none; }
button:disabled, .editor :global(button:disabled) { opacity: .45; cursor: not-allowed; }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible, .editor :global(button:focus-visible), .editor :global([data-combobox-input]:focus-visible) { outline: 2px solid currentColor; outline-offset: 4px; }
.check { display: flex; gap: 8px; align-items: flex-start; }
.check input { margin-top: 3px; accent-color: var(--ink); }
.editor :global([data-accordion-header]) { margin: 0; }
.editor :global(.section-trigger) { display: flex; justify-content: space-between; align-items: center; width: 100%; border: 0; border-radius: 0; background: transparent; color: var(--ink); cursor: pointer; padding: 18px 0; font: inherit; font-size: 14px; text-align: left; }
.editor :global(.section-trigger)::after { content: "+"; color: var(--muted); font-size: 18px; }
.editor :global(.section-trigger[data-state="open"])::after { content: "−"; }
.editor :global(.detail-body) { padding: 4px 0 20px; }
output { float: right; color: var(--muted); }
input[type="range"] { padding: 0; accent-color: var(--ink); }
.editor :global([data-combobox-input]) { margin: -10px 0 16px; }
.editor :global(.font-menu) { z-index: 50; width: var(--bits-combobox-anchor-width); max-width: calc(100vw - 32px); background: var(--panel); color: var(--ink); box-shadow: 0 8px 30px #0002; padding: 6px; }
.editor :global(.font-list) { max-height: min(280px, var(--bits-combobox-content-available-height)); overflow-y: auto; overscroll-behavior: contain; }
.editor :global([data-combobox-item]) { padding: 10px; cursor: pointer; font-size: 14px; }
.editor :global([data-combobox-item][data-highlighted]) { background: var(--field); }
.editor :global([data-combobox-item][data-selected]) { font-weight: 600; }
.colours { display: flex; gap: 16px; }
.colours label { flex: 1; min-width: 0; }
.colours input { height: 36px; padding: 0; background: transparent; cursor: pointer; }
.colours input::-webkit-color-swatch-wrapper { padding: 0; }
.colours input::-webkit-color-swatch { border: 0; }
.file { margin-top: 14px; }
.file input { font-size: 12px; padding: 0; background: transparent; }
.file input::file-selector-button { border: 0; background: var(--field); color: var(--ink); padding: 10px; margin-right: 10px; }
.small { font-size: 12px; color: var(--muted); }
.export { display: flex; flex-direction: column; gap: 8px; padding-top: 22px; }
.primary { background: var(--ink); color: var(--bg); padding: 14px; font-weight: 500; }
.download { text-align: center; }
.export p { margin: 0; font-size: 12px; }
progress { width: 100%; accent-color: var(--ink); }
.warning { background: #fff0cc; color: #674600; padding: 12px; font-size: 12px; }
.feedback { display: flex; justify-content: space-between; gap: 12px; margin-top: 20px; font-size: 12px; }
.feedback:not(.warning) { color: var(--muted); }
.feedback button { padding: 0 8px; background: transparent; }
@media (max-width: 1000px) { .workspace { grid-template-columns: minmax(0, 1fr) 340px; gap: 40px; } .stage { width: min(100%, 300px); } }
@media (max-width: 760px) { .workspace { grid-template-columns: minmax(0, 1fr); gap: 36px; } .preview { position: static; } .stage { width: min(100%, 230px); } .stage.square, .stage.landscape { width: 100%; } .preview-meta { margin-bottom: 12px; } }
</style>
