import type { CoreMedia, RecorderFeature, StartRecordingOptions } from "../types";

// Assuming types are in a separate file or defined above.
// import type { CoreMedia, RecorderFeature } from './types';

/**
 * A higher-order function that wraps a CoreMedia instance and adds recording capabilities.
 *
 * @template T - A type that extends CoreMedia.
 * @param {T} instance - The CoreMedia instance to enhance.
 * @returns {T & RecorderFeature} The enhanced instance with recording methods.
 */
export function withRecorder<T extends CoreMedia>(instance: T): T & RecorderFeature {
  const internalState = instance._internal.getInternalState();
  let mediaRecorder: MediaRecorder | null = null;
  let recordedChunks: Blob[] = [];

  // MODIFIED: startRecording now accepts the new options object
  const startRecording = (options?: StartRecordingOptions): void => {
    if (!internalState.stream) throw new Error('Stream not available...');
    if (mediaRecorder && mediaRecorder.state !== 'inactive') throw new Error('Recording in progress...');

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(internalState.stream, options?.recorderOptions);

    // *** THE KEY ADDITION ***
    // Wire up event listeners to the state change callback
    const notifyStateChange = (state: RecordingState) => {
      if (options?.onStateChange) {
        options.onStateChange(state);
      }
    };

    mediaRecorder.onstart = () => notifyStateChange('recording');
    mediaRecorder.onpause = () => notifyStateChange('paused');
    mediaRecorder.onresume = () => notifyStateChange('recording'); // Resuming returns to 'recording'
    mediaRecorder.onstop = () => {
      notifyStateChange('inactive');
      // The rest of the original onstop logic (creating the blob) remains in stopRecording()
    };
    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      notifyStateChange('inactive');
    };

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.start();
  };

  const pauseRecording = (): void => {
    if (!mediaRecorder || mediaRecorder.state !== 'recording') {
      throw new Error("Recording is not active, can't pause.");
    }
    mediaRecorder.pause();
  };

  const resumeRecording = (): void => {
    if (!mediaRecorder || mediaRecorder.state !== 'paused') {
      throw new Error("Recording is not paused, can't resume.");
    }
    mediaRecorder.resume();
  };

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        return reject(new Error('Recording has not been started or is already stopped.'));
      }

      // Event listener for when recording is stopped
      mediaRecorder.onstop = () => {
        // Use the mimeType from the recorder itself for accuracy
        const mimeType = mediaRecorder?.mimeType || 'application/octet-stream';
        const recordedBlob = new Blob(recordedChunks, { type: mimeType });

        // Clean up for the next recording
        recordedChunks = [];

        resolve(recordedBlob);
      };

      // Handle potential errors during recording or stopping
      mediaRecorder.onerror = (event) => {
        reject((event as any).error || new Error('An unknown error occurred during recording.'));
      };

      // Request to stop the recording, which will trigger the 'onstop' event.
      mediaRecorder.stop();
    });
  };

  // Combine the original instance with the new recorder features
  const recorderApi: RecorderFeature = {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    get recordingState() {
      return mediaRecorder ? mediaRecorder.state : 'inactive';
    }
  };

  return Object.assign(instance, recorderApi);
}