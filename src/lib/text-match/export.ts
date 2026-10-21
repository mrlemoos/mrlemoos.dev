import { dimensions, validateProject, type Project } from "./project";
import { loadProjectFonts } from "./fonts";
import { renderFrame } from "./render";
export async function exportVideo(
  input: Project,
  onProgress: (n: number) => void,
  signal?: AbortSignal,
): Promise<Blob> {
  const project = validateProject(input);
  if (typeof MediaRecorder === "undefined")
    throw new Error(
      "Video export unavailable in this browser. Try a recent Safari or Chrome.",
    );
  if (document.hidden)
    throw new Error("Keep this tab visible while exporting.");
  await loadProjectFonts(project);
  if (signal?.aborted) throw new Error("Export cancelled.");
  const canvas = document.createElement("canvas");
  [canvas.width, canvas.height] = dimensions(project);
  if (!renderFrame(canvas, project, 0).fits)
    throw new Error(
      "Phrase does not fit. Move it towards the centre or shorten it before exporting.",
    );
  if (!canvas.captureStream)
    throw new Error("Canvas video capture unavailable in this browser.");
  const mimeType = [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ].find((type) => MediaRecorder.isTypeSupported(type));
  if (!mimeType) throw new Error("No supported MP4 or WebM encoder available.");
  const stream = canvas.captureStream(30);
  let audio: AudioContext | undefined;
  let timer: ReturnType<typeof setInterval> | undefined;
  let recorder: MediaRecorder | undefined;
  let cleanListeners: (() => void) | undefined;
  try {
    if (project.sound) {
      audio = new AudioContext();
      let resumeTimeout: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          audio.resume(),
          new Promise<never>((_, reject) => {
            resumeTimeout = setTimeout(
              () =>
                reject(
                  new Error(
                    "Sound permission unavailable. Enable sound in this browser or export silently.",
                  ),
                ),
              2500,
            );
          }),
        ]);
      } finally {
        if (resumeTimeout) clearTimeout(resumeTimeout);
      }
      if (audio.state !== "running")
        throw new Error(
          "Audio unavailable. Enable sound in this browser or export silently.",
        );
      const destination = audio.createMediaStreamDestination();
      const buffer = audio.createBuffer(
        1,
        Math.ceil(audio.sampleRate * 0.035),
        audio.sampleRate,
      );
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++)
        samples[i] = Math.sin(i * 2.37) * 0.13 * (1 - i / samples.length);
      for (let t = 0; t < project.duration; t += 1 / project.cutSpeed) {
        const source = audio.createBufferSource();
        source.buffer = buffer;
        source.connect(destination);
        source.start(audio.currentTime + t);
      }
      destination.stream
        .getAudioTracks()
        .forEach((track) => stream.addTrack(track));
    }
    if (signal?.aborted) throw new Error("Export cancelled.");
    recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 10000000,
    });
    const activeRecorder = recorder;
    const chunks: Blob[] = [];
    const blob = await new Promise<Blob>((resolve, reject) => {
      const abort = () => {
        cleanListeners?.();
        reject(new Error("Export cancelled."));
      };
      const visibility = () => {
        if (document.hidden) {
          cleanListeners?.();
          reject(
            new Error(
              "Export interrupted. Keep this tab visible until the video finishes.",
            ),
          );
        }
      };
      cleanListeners = () => {
        signal?.removeEventListener("abort", abort);
        document.removeEventListener("visibilitychange", visibility);
      };
      document.addEventListener("visibilitychange", visibility);
      signal?.addEventListener("abort", abort, { once: true });
      activeRecorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      activeRecorder.onerror = () => {
        cleanListeners?.();
        reject(
          new Error("Encoder failed. Try another browser or shorter duration."),
        );
      };
      activeRecorder.onstop = () => {
        cleanListeners?.();
        resolve(
          new Blob(chunks, { type: activeRecorder.mimeType || mimeType }),
        );
      };
      activeRecorder.start(250);
      const start = performance.now();
      timer = setInterval(() => {
        const elapsed = (performance.now() - start) / 1000;
        try {
          renderFrame(canvas, project, Math.min(elapsed, project.duration));
          onProgress(Math.min(elapsed / project.duration, 1));
        } catch (error) {
          cleanListeners?.();
          reject(error);
        }
        if (elapsed >= project.duration && activeRecorder.state !== "inactive")
          activeRecorder.stop();
      }, 1000 / 30);
    });
    if (!blob.size)
      throw new Error("Encoder produced an empty video. Try another browser.");
    const signature = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
    const isMp4 = String.fromCharCode(...signature.slice(4, 8)) === "ftyp";
    const isWebm =
      signature[0] === 0x1a &&
      signature[1] === 0x45 &&
      signature[2] === 0xdf &&
      signature[3] === 0xa3;
    if (!isMp4 && !isWebm)
      throw new Error("Encoder returned an invalid video file.");
    return new Blob([blob], { type: isMp4 ? "video/mp4" : "video/webm" });
  } finally {
    cleanListeners?.();
    if (timer) clearInterval(timer);
    if (recorder && recorder.state !== "inactive") recorder.stop();
    stream.getTracks().forEach((track) => track.stop());
    canvas.width = canvas.height = 0;
    if (audio) await audio.close();
  }
}
