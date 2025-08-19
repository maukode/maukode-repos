import type { CoreMedia, PhotoFeature } from '../types';

export function withPhoto<T extends CoreMedia>(instance: T): T & PhotoFeature {
  const takePhoto = (format: 'image/png' | 'image/jpeg' = 'image/png'): string => {
    const { videoElement, isPlaying, stream } = instance._internal.getInternalState();

    if (!isPlaying) {
      throw new Error('Webcam is not playing. Call start() before taking a photo.');
    }

    if (!videoElement || stream?.getVideoTracks().length === 0) {
      throw new Error('Cannot take a photo from a stream with no video track.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d')!.drawImage(videoElement, 0, 0);

    return canvas.toDataURL(format);
  };

  return {
    ...instance,
    takePhoto,
  };
}