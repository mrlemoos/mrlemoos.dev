<script lang="ts">
  import { onMount, untrack } from 'svelte';
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
  let safeAreas = $state(true);
  const curatedFonts = ['Roboto', 'Lora', 'Playfair Display', 'DM Sans', 'Space Grotesk'];
  let catalogue = $state<string[]>([...curatedFonts]);
  let search = $state('');
  let fontsBusy = $state(false);
  let catalogueBusy = $state(false);
  let fontReady = $state(false);
  let previewAudio: AudioContext | undefined;
  let cutBuffer: AudioBuffer | undefined;
  let lastCut = -1;
  let fontPermission = $state(false);
  let fontLicence = $state('');
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
                  notice = 'Local draft recovered.';
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
      catalogueBusy = true;
      try {
          catalogue = [...new Set([...curatedFonts, ...await fetchFontCatalogue()])];
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
          const font = await loadGoogleFont(family, weight);
          if (request !== fontRequest)
              return;
          const snapshot = $state.snapshot(project);
          const candidate = validateProject({
              ...snapshot,
              fontFamily: family,
              fonts: [...snapshot.fonts.filter((f) => !(f.family === font.family && f.weight === font.weight)), font],
          });
          await loadProjectFonts(candidate);
          if (request !== fontRequest)
              return;
          project = candidate;
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
          if (request === fontRequest)
              fontsBusy = false;
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
          if (!fontPermission || !fontLicence.trim())
              throw new Error('Confirm embedding permission and enter the font licence first.');
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
              fonts: [...snapshot.fonts.filter((font) => !(font.family === family && font.weight === snapshot.fontWeight)), { family, weight: snapshot.fontWeight, data, licence: fontLicence }],
          });
          await loadProjectFonts(candidate);
          if (request !== fontRequest)
              return;
          project = candidate;
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
          notice = `Video ready: ${video.type.includes('mp4') ? 'MP4' : 'WebM fallback'}.`;
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
  <div class="topline"><span class="eyebrow">YOUR WORDS. EVERY CUT.</span><label class="theme">Appearance <select bind:value={theme} onchange={() => { try { localStorage.setItem('text-match-theme', theme); } catch { error = 'Theme preference could not be saved.'; } }}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label></div>
  <div class="workspace">
    <section class="preview" aria-label="Video preview">
      <div class="preview-meta"><span>PRINT / {project.preset.toUpperCase()}</span><span>1080p · NO WATERMARK</span></div>
      <div class="stage" class:landscape={project.format === 'landscape'} class:square={project.format === 'square'}>
        <canvas bind:this={canvas} aria-label={`Text Match artwork: ${project.phrase}`}></canvas>
        {#if safeAreas && ['tiktok', 'reels', 'shorts'].includes(project.format)}<div class="safe-area" class:tiktok={project.format === 'tiktok'} class:reels={project.format === 'reels'} aria-hidden="true"><span>{project.format} safe area</span></div>{/if}
      </div>
      <div class="transport"><button onclick={play} disabled={fontsBusy || !fontReady || progress !== null}>{playing ? 'Pause' : 'Play preview'}</button><span class="counter">{String(Math.floor(time * project.cutSpeed) + 1).padStart(3, '0')} <span>/ {String(Math.ceil(project.duration * project.cutSpeed)).padStart(3, '0')}</span></span><span>{time.toFixed(1)}s</span></div>
      <p class="small">Static until you press play. Rapid cuts; pause anytime.</p>
      {#if !fits}<p class="warning" role="status">Phrase does not fit this frame. Reduce zoom, move the focal point, or shorten your phrase. Text stays intact.</p>{/if}
    </section>
    <section class="controls" aria-label="Editor controls">
      <fieldset disabled={progress !== null}>
      <label class="phrase">Focal word or phrase<textarea bind:value={project.phrase} rows="2" maxlength="2000"></textarea></label>
      <div class="presets" role="group" aria-label="Print preset">{#each ['newspaper', 'book', 'magazine', 'clean'] as value}<button class:active={project.preset === value} aria-pressed={project.preset === value} onclick={() => preset(value as Project['preset'])}>{value}</button>{/each}</div>
      <label>Output format<select bind:value={project.format}><option value="tiktok">TikTok · 9:16</option><option value="reels">Reels · 9:16</option><option value="shorts">Shorts · 9:16</option><option value="square">Square · 1:1</option><option value="landscape">Landscape · 16:9</option></select></label>
      <label class="check"><input type="checkbox" bind:checked={safeAreas} />Show safe-area guides (preview only)</label>
      <details open><summary>Timing & framing</summary><div class="detail-body">{#each ranges as range}<label for={`text-match-${range.key}`}>{range.label}<output for={`text-match-${range.key}`}>{project[range.key]}{range.unit}</output><input id={`text-match-${range.key}`} type="range" min={range.min} max={range.max} step={range.step} bind:value={project[range.key]} /></label>{/each}<label>Shuffle seed<input type="number" min="0" max="2147483647" step="1" bind:value={project.seed} /></label><button onclick={() => project.seed = Math.floor(Math.random() * 2147483647)}>Shuffle cuts</button><label class="check"><input type="checkbox" bind:checked={project.sound} onchange={stop} />Paper-cut sound</label></div></details>
      <details><summary>Typography & colour</summary><div class="detail-body"><label>Font family<select bind:value={project.fontFamily} onchange={refreshFonts}><option value="Georgia">Georgia</option><option value="serif">System serif</option><option value="sans-serif">System sans</option><option value="Arial">Arial</option>{#each [...new Set(project.fonts.map((font) => font.family))] as family}<option value={family}>{family}</option>{/each}</select></label><label>Font weight<select bind:value={project.fontWeight} onchange={refreshFonts}>{#each [100,200,300,400,500,600,700,800,900] as weight}<option value={weight}>{weight}</option>{/each}</select></label><button onclick={findFonts} disabled={fontsBusy || catalogueBusy}>Browse Google Fonts</button><p class="small">Browsing contacts the Google Fonts repository on GitHub for metadata. Selecting a font downloads only that family and weight.</p>{#if catalogue.length}<label>Search fonts<input type="search" bind:value={search} placeholder="Search font families" /></label><div class="font-results">{#each catalogue.filter((family) => family.toLowerCase().includes(search.toLowerCase())).slice(0, 30) as family}<button disabled={fontsBusy} onclick={() => selectFont(family)}>{family}</button>{/each}</div>{/if}{#if fontsBusy || catalogueBusy}<p role="status">Loading fonts…</p>{/if}<div class="colours">{#each colourFields as [key, label]}<label>{label}<input type="color" bind:value={project[key]} /></label>{/each}</div><label>Highlight<select bind:value={project.highlight}><option value="marker">Marker</option><option value="underline">Underline</option><option value="box">Box</option><option value="none">None</option></select></label><label class="check"><input type="checkbox" bind:checked={fontPermission} />I have permission to embed these fonts in project files.</label><label>Local font licence<input bind:value={fontLicence} placeholder="Licence name or permission details" /></label><label class="file">Upload local font<input type="file" accept=".woff,.woff2,.ttf,.otf" onchange={uploadFont} /></label><p class="small">Portable projects include selected font files. Check their licences before sharing. System fonts vary between devices.</p></div></details>
      <details><summary>Surrounding print</summary><div class="detail-body"><label>Headline<input bind:value={project.headline} maxlength="2000" /></label><label>Body text<textarea bind:value={project.body} rows="5" maxlength="20000"></textarea></label></div></details>
      <details><summary>Project & backup</summary><div class="detail-body"><p class="small">Your working draft saves in this browser. Download a project for a portable backup.</p><button onclick={saveProject}>Download project</button><label class="file">Import project<input type="file" accept=".json,application/json" onchange={importProject} /></label>{#if recoveredDraft}<button onclick={() => download(new Blob([recoveredDraft], { type: 'application/json' }), 'text-match-recovery.json')}>Download unreadable draft</button>{/if}<button onclick={reset}>Reset project…</button></div></details>
      </fieldset>
      <div class="export"><button class="primary" onclick={exportClip} disabled={progress !== null || fontsBusy || !fontReady || !fits || !project.phrase.trim()}>Export 1080p video</button>{#if progress !== null}<progress max="1" value={progress} aria-label="Export progress"></progress><p role="status">Exporting {Math.round(progress * 100)}%</p><button onclick={() => controller?.abort()}>Cancel export</button>{/if}{#if video}<p>{video.type.includes('mp4') ? 'MP4' : 'WebM fallback'} · {(video.size / 1024 / 1024).toFixed(1)} MB</p><a class="download" href={videoUrl} download={`text-match.${video.type.includes('mp4') ? 'mp4' : 'webm'}`}>Download video</a><button onclick={copyVideo}>Copy video to clipboard</button><button onclick={shareVideo}>Share video</button>{/if}</div>
    </section>
  </div>
  {#if error}<div class="feedback warning" role="alert">{error}<button onclick={() => error = ''} aria-label="Dismiss error">×</button></div>{/if}
  {#if notice}<p class="feedback" role="status">{notice}</p>{/if}
</div>

<style>
.editor {
  --bg: #f5f5f2;
  --panel: #fff;
  --ink: #22231f;
  --muted: #6e7069;
  --line: #dedfd8;
  --accent: #e5ed65;
  color: var(--ink);
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 24px;
  font: 14px/1.5 var(--font-sans, "Geist Sans", sans-serif);
  max-width: 100%;
  color-scheme: light;
}
.editor[data-theme="dark"] {
  --bg: #1a1b19;
  --panel: #242521;
  --ink: #efefe9;
  --muted: #aaada3;
  --line: #3b3d35;
  color-scheme: dark;
}
@media (prefers-color-scheme: dark) {
  .editor[data-theme="system"] {
    --bg: #1a1b19;
    --panel: #242521;
    --ink: #efefe9;
    --muted: #aaada3;
    --line: #3b3d35;
    color-scheme: dark;
  }
}
.topline,
.preview-meta,
.transport {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.topline {
  margin-bottom: 24px;
}
.eyebrow,
.preview-meta,
.counter {
  font: 11px/1.4 monospace;
  letter-spacing: 0.06em;
}
.theme {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.theme select {
  width: auto;
}
.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 1fr);
  gap: 32px;
}
.preview {
  min-width: 0;
  align-self: start;
  position: sticky;
  top: 24px;
}
.preview-meta {
  color: var(--muted);
  margin-bottom: 14px;
}
.stage {
  position: relative;
  aspect-ratio: 9/16;
  width: min(100%, 382px);
  margin: auto;
  overflow: hidden;
  background: #eee4cd;
  box-shadow: 0 12px 32px #0002;
}
.stage.landscape {
  aspect-ratio: 16/9;
  width: 100%;
}
.stage.square {
  aspect-ratio: 1;
  width: 100%;
}
.stage canvas {
  width: 100%;
  height: 100%;
  display: block;
}
.safe-area {
  position: absolute;
  inset: 9% 17% 23% 6%;
  border: 1px dashed #6d695ba8;
  pointer-events: none;
}
.safe-area.reels {
  inset: 12% 14% 24% 6%;
}
.safe-area.tiktok {
  inset: 10% 20% 22% 6%;
}
.safe-area span {
  position: absolute;
  bottom: 5px;
  left: 6px;
  font: 9px monospace;
  color: #534f43;
  background: #fff9;
  padding: 2px 4px;
}
.transport {
  padding-top: 16px;
}
.counter {
  font-size: 19px;
}
.counter span {
  color: var(--muted);
  font-size: 12px;
}
.small {
  font-size: 12px;
  color: var(--muted);
}
.controls {
  min-width: 0;
}
fieldset {
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
}
label {
  display: block;
  font-size: 12px;
  font-weight: 550;
  margin-bottom: 15px;
}
input:not([type="checkbox"]),
textarea,
select {
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--line);
  border-radius: 7px;
  padding: 9px 11px;
  background: var(--panel);
  color: var(--ink);
  font: 14px/1.4 inherit;
  margin-top: 6px;
}
textarea {
  resize: vertical;
}
.phrase textarea {
  font-family: Georgia, serif;
  font-size: 27px;
  line-height: 1.2;
  padding: 14px;
}
.presets {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin: 0 0 20px;
}
button,
.download,
.file {
  border: 1px solid var(--line);
  background: var(--panel);
  color: var(--ink);
  border-radius: 7px;
  padding: 9px 12px;
  cursor: pointer;
  font: 12px/1.4 var(--font-sans, "Geist Sans", sans-serif);
  text-decoration: none;
}
button.active {
  background: var(--ink);
  color: var(--bg);
}
button:disabled {
  opacity: 0.5;
  cursor: wait;
}
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
a:focus-visible,
summary:focus-visible {
  outline: 2px solid #828c14;
  outline-offset: 3px;
}
.check {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-weight: 400;
}
.check input {
  margin-top: 3px;
}
details {
  border-top: 1px solid var(--line);
}
summary {
  padding: 17px 0;
  cursor: pointer;
  font-weight: 600;
}
.detail-body {
  padding-bottom: 16px;
}
output {
  float: right;
  color: var(--muted);
}
input[type="range"] {
  padding: 0;
  accent-color: #828c14;
  border: 0;
}
.colours {
  display: flex;
  gap: 12px;
}
.colours label {
  flex: 1;
}
.colours input {
  height: 39px;
  padding: 3px;
}
.font-results {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  max-height: 200px;
  overflow: auto;
  margin-bottom: 14px;
}
.file {
  display: block;
  margin-top: 8px;
}
.file input {
  font-size: 11px;
  padding: 0;
  border: 0;
}
.export {
  border-top: 1px solid var(--line);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.primary {
  background: var(--accent);
  color: #222;
  border: 0;
  font-weight: 650;
  padding: 14px;
}
.download {
  text-align: center;
}
.export p {
  margin: 0;
  font-size: 12px;
}
progress {
  width: 100%;
  accent-color: #828c14;
}
.warning {
  background: #fff0cc;
  color: #674600;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
}
.feedback {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.feedback button {
  padding: 0 8px;
}
.feedback:not(.warning) {
  font-size: 12px;
  color: var(--muted);
}
@media (max-width: 760px) {
  .editor {
    padding: 16px;
    border-radius: 14px;
  }
  .workspace {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
  .preview {
    position: static;
  }
  .stage {
    width: min(100%, 309px);
  }
  .topline {
    align-items: flex-start;
  }
  .eyebrow {
    max-width: 100px;
  }
  .theme {
    font-size: 0;
  }
  .theme select {
    font-size: 12px;
  }
  .preview-meta {
    font-size: 9px;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto;
  }
}
</style>
