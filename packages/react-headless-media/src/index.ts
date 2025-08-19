import { useCallback, useEffect, useRef, useState } from "react";
import { createMedia, CoreMedia, MediaStartOptions, listVideoInputDevices, listAudioInputDevices, PhotoFeature, RecorderFeature, withPhoto, withRecorder } from "@maukode/headless-media";

// ====================================================================
// ====================================================================
// HOOK 1: useMediaDevices
// A simple hook to fetch and provide lists of available media devices.
export function useMediaDevices() {
  const [devices, setDevices] = useState<{
    video: MediaDeviceInfo[];
    audio: MediaDeviceInfo[];
  }>({ video: [], audio: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const [video, audio] = await Promise.all([
          listVideoInputDevices(),
          listAudioInputDevices(),
        ]);
        setDevices({ video, audio });
      } catch (error) {
        console.error("Error fetching media devices:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { ...devices, isLoading };
}


// ====================================================================
// HOOK 2: useMedia
// The main hook to manage the media instance and its features.
// ====================================================================

// Define the options for the hook, allowing users to enable features
interface UseMediaOptions {
  withPhoto?: boolean;
  withRecorder?: boolean;
}

// Define a status object to make state updates easier
interface MediaStatus {
    isPlaying: boolean;
    recordingState: RecordingState;
}

export function useMedia(options: UseMediaOptions = {}) {
  const { withPhoto: enablePhoto, withRecorder: enableRecorder } = options;

  // Ref to hold the <video> element
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Ref to hold the media library instance. We use a ref to avoid
  // re-creating the instance on every render.
  const mediaInstanceRef = useRef<CoreMedia & Partial<PhotoFeature & RecorderFeature> | null>(null);

  // Reactive state for the component to re-render when status changes
  const [status, setStatus] = useState<MediaStatus>({
    isPlaying: false,
    recordingState: 'inactive',
  });

  // Effect to create and clean up the media instance
  useEffect(() => {
    // This effect runs once on mount to create the instance
    if (videoRef.current) {
      let instance: CoreMedia & Partial<PhotoFeature & RecorderFeature> = createMedia(videoRef.current);
      
      // Conditionally compose features based on options.
      // This is what enables tree-shaking! If `enablePhoto` is false,
      // the `withPhoto` module can be shaken from the final bundle.
      if (enablePhoto) {
        instance = withPhoto(instance);
      }
      if (enableRecorder) {
        instance = withRecorder(instance);
      }
      mediaInstanceRef.current = instance;
    }

    // Return a cleanup function to be called on unmount
    return () => {
      mediaInstanceRef.current?.stop();
    };
  }, [enablePhoto, enableRecorder]); // Re-run if features change

  // Memoized function to update the reactive status state
  const updateStatus = useCallback(() => {
    if (mediaInstanceRef.current) {
        setStatus({
            isPlaying: mediaInstanceRef.current.isPlaying,
            recordingState: mediaInstanceRef.current.recordingState || 'inactive',
        });
    }
  }, []);

  // --- Control Functions ---
  // We wrap all control functions in `useCallback` to ensure they have a
  // stable identity across re-renders, preventing unnecessary child re-renders.

  const start = useCallback(async (startOptions: MediaStartOptions) => {
    await mediaInstanceRef.current?.start(startOptions);
    updateStatus();
  }, [updateStatus]);

  const stop = useCallback(() => {
    mediaInstanceRef.current?.stop();
    updateStatus();
  }, [updateStatus]);

  const takePhoto = useCallback(() => {
    return mediaInstanceRef.current?.takePhoto?.();
  }, []);

  const startRecording = useCallback(() => {
    mediaInstanceRef.current?.startRecording?.();
    updateStatus();
  }, [updateStatus]);

  const stopRecording = useCallback(async () => {
    const blob = await mediaInstanceRef.current?.stopRecording?.();
    updateStatus();
    return blob;
  }, [updateStatus]);

  return {
    videoRef,
    ...status,
    start,
    stop,
    takePhoto,
    startRecording,
    stopRecording,
  };
}
