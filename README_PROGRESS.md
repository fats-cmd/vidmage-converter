Progress & UI notes

- Conversion progress is driven by the in-browser FFmpeg runtime's progress callback.
- The hook `useFfmpeg` normalizes progress values to a 0..1 ratio and clamps values.
- If the FFmpeg runtime doesn't expose a progress handler (some builds omit it), the UI will show an indeterminate animated stage text and spinner.

How to enable full progress (if missing):

- Use an FFmpeg build that exposes `setProgress` on the runtime instance. The project currently loads the runtime from `https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd`.
- To test a different build, update the `baseURL` in `src/hooks/useFfmpeg.ts` to point to a build that provides progress events.

UI behavior:

- When progress events are available the ConversionCard button shows `Processing X%` where X is 1..100.
- When progress is unavailable the ConversionCard button shows animated stage messages, e.g. `Fetching data...`, `Decoding...`, `Encoding...`.

Notes for developers:

- The hook clears progress handler after each run to avoid leaking handlers.
- If you need more detailed progress (per-step), you can augment the hook to emit named stages from within conversion functions.
