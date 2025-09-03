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

export interface StartRecordingOptions {
  recorderOptions?: MediaRecorderOptions;
  onStateChange?: (state: RecordingState) => void;
}

/**
 * Defines the features added by the recorder decorator.
 */
export interface RecorderFeature {
  /**
   * Starts recording the media stream.
   * @param {MediaRecorderOptions} [options] - Optional configuration for the MediaRecorder.
   * @throws {Error} if the stream is not available or recording is already active.
   */
  startRecording: (options?: StartRecordingOptions) => void;

  /**
   * Stops the active recording.
   * @returns {Promise<Blob>} A promise that resolves with the recorded media as a Blob.
   * @throws {Error} if recording has not been started.
   */
  stopRecording: () => Promise<Blob>;

  /**
   * Pauses the active recording.
   * @throws {Error} if the recorder is not in the 'recording' state.
   */
  pauseRecording: () => void;

  /**
   * Resumes a paused recording.
   * @throws {Error} if the recorder is not in the 'paused' state.
   */
  resumeRecording: () => void;

  /**
   * Gets the current state of the MediaRecorder.
   * @returns {'inactive' | 'recording' | 'paused'} The current recording state.
   */
  readonly recordingState: RecordingState;
}

// A new interface for an audio-only feature
export interface VolumeMeterFeature {
  // Takes a callback that receives the volume level (0-100)
  startVolumeMonitor: (callback: (volume: number) => void, options?: { smoothingTimeConstant?: number }) => void;
  stopVolumeMonitor: () => void;
}