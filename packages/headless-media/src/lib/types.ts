export interface CoreMediaState {
  // videoElement is now optional, as we might have an audio-only stream
  videoElement: HTMLVideoElement | null;
  stream: MediaStream | null;
  isPlaying: boolean;
  // We'll track requested device IDs separately
  videoDeviceId: string | null;
  audioDeviceId: string | null;
}

// More flexible options for starting the stream
export interface MediaStartOptions {
  video?: boolean | { deviceId?: string; facingMode?: 'user' | 'environment' };
  audio?: boolean | { deviceId?: string };
}

// Renamed from CoreWebcam
export interface CoreMedia {
  start: (options: MediaStartOptions) => Promise<void>;
  stop: () => void;
  readonly isPlaying: boolean;
  getStream: () => MediaStream | null; // A helper to get the raw stream
  _internal: {
    getInternalState: () => CoreMediaState;
  };
}

// The API for the photo feature
export interface PhotoFeature {
  takePhoto: (format?: 'image/png' | 'image/jpeg') => string; // Returns a base64 Data URL
}

// The API for the recorder feature
export interface RecorderFeature {
  startRecording: (options?: MediaRecorderOptions) => void;
  stopRecording: () => Promise<Blob>;
  readonly recordingState: RecordingState;
}

// A new interface for an audio-only feature
export interface VolumeMeterFeature {
  // Takes a callback that receives the volume level (0-100)
  startVolumeMonitor: (callback: (volume: number) => void, options?: { smoothingTimeConstant?: number }) => void;
  stopVolumeMonitor: () => void;
}