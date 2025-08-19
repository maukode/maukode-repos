import type { CoreMedia, RecorderFeature } from '../types';

export function withRecorder<T extends CoreMedia>(instance: T): T & RecorderFeature {
  const internalState = instance._internal.getInternalState();
  let mediaRecorder: MediaRecorder | null = null;
  let recordedChunks: BlobPart[] = [];

  const startRecording = (options?: MediaRecorderOptions): void => {
    if (!internalState.stream) throw new Error('Stream not available');
    mediaRecorder = new MediaRecorder(internalState.stream, options);
    mediaRecorder.start();
  };

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        return reject(new Error('Recording has not been started.'));
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: mediaRecorder?.mimeType });
        recordedChunks = [];
        resolve(blob);
      };
      mediaRecorder.stop();
    });
  };

  return {
    ...instance,
    startRecording,
    stopRecording,
    get recordingState() { return mediaRecorder ? mediaRecorder.state : 'inactive'; }
  };
}