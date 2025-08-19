import type { CoreMedia, CoreMediaState, MediaStartOptions } from "./types";

export function createMedia(videoElement: HTMLVideoElement | null = null): CoreMedia {
  const state: CoreMediaState = {
    videoElement,
    stream: null,
    isPlaying: false,
    videoDeviceId: null,
    audioDeviceId: null,
  };

  const start = async (options: MediaStartOptions): Promise<void> => {
    if (state.isPlaying) return;

    // Build constraints dynamically based on options
    const constraints: MediaStreamConstraints = {};
    if (options.video) {
        constraints.video = typeof options.video === 'boolean' ? true : options.video;
    }
    if (options.audio) {
        constraints.audio = typeof options.audio === 'boolean' ? true : options.audio;
    }

    if (Object.keys(constraints).length === 0) {
        throw new Error("Start options must include at least audio or video.");
    }
    
    state.stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Only attach to video element if it exists and there's a video track
    if (state.videoElement && state.stream.getVideoTracks().length > 0) {
        state.videoElement.srcObject = state.stream;
        await state.videoElement.play();
    }

    state.isPlaying = true;
  };

  const stop = (): void => {
    if (!state.isPlaying) return;
    state.stream?.getTracks().forEach(track => track.stop());
    if (state.videoElement) state.videoElement.srcObject = null;
    state.stream = null;
    state.isPlaying = false;
  };

   const getStream = (): MediaStream | null => {
    return state.stream;
  };

  const getInternalState = (): CoreMediaState => {
    return state;
  };

  return {
    start,
    stop,
    getStream,
    get isPlaying() { return state.isPlaying; },
    _internal: { getInternalState },
  };
}