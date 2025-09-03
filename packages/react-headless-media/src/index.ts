import { useCallback, useEffect, useRef, useState } from "react";
import { createMedia, CoreMedia, MediaStartOptions, listVideoInputDevices, listAudioInputDevices, PhotoFeature, RecorderFeature, withPhoto, withRecorder, StartRecordingOptions } from "@maukode/headless-media";

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
// HOOK 2: useMedia (Refactored)
// ====================================================================

interface UseMediaOptions {
  withPhoto?: boolean;
  withRecorder?: boolean;
}

// A more comprehensive status object
interface MediaStatus {
  isPlaying: boolean;
  recordingState: RecordingState;
  error: Error | null;
}

// Conditionally add features to the type for better IntelliSense
type MediaInstance<T extends UseMediaOptions> = CoreMedia &
  (T['withPhoto'] extends true ? PhotoFeature : {}) &
  (T['withRecorder'] extends true ? RecorderFeature : {});

export function useMedia<T extends UseMediaOptions>(options: T) {
  const { withPhoto: enablePhoto, withRecorder: enableRecorder } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaInstanceRef = useRef<CoreMedia & Partial<PhotoFeature & RecorderFeature> | null>(null);

  const [status, setStatus] = useState<MediaStatus>({
    isPlaying: false,
    recordingState: 'inactive',
    error: null,
  });

  // Effect to create and clean up the media instance
  useEffect(() => {
    if (videoRef.current) {
      let instance: CoreMedia & Partial<PhotoFeature & RecorderFeature> = createMedia(videoRef.current);

      if (enablePhoto) {
        instance = withPhoto(instance);
      }
      if (enableRecorder) {
        instance = withRecorder(instance);
      }
      mediaInstanceRef.current = instance as MediaInstance<T>;
    }

    return () => {
      mediaInstanceRef.current?.stop();
      mediaInstanceRef.current = null;
    };
  }, [enablePhoto, enableRecorder]);

  // --- Control Functions ---

  const handleError = useCallback((err: unknown) => {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Media Hook Error:", error);
    setStatus(s => ({ ...s, error }));
  }, []);

  const start = useCallback(async (startOptions: MediaStartOptions) => {
    try {
      await mediaInstanceRef.current?.start(startOptions);
      setStatus(s => ({ ...s, isPlaying: true, error: null }));
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const stop = useCallback(() => {
    mediaInstanceRef.current?.stop();
    setStatus(s => ({ ...s, isPlaying: false }));
  }, []);

  // --- Photo Feature ---
  const takePhoto = useCallback(async () => {
    // Ensure the function exists before calling
    if (mediaInstanceRef.current?.takePhoto) {
      try {
        return await mediaInstanceRef.current.takePhoto();
      } catch (err) {
        handleError(err);
      }
    }
    return undefined;
  }, [handleError]);

  // --- Recorder Features ---
  const startRecording = useCallback((recorderOptions?: MediaRecorderOptions) => {
    if (mediaInstanceRef.current?.startRecording) {
      try {
        const optionsWithCallback: StartRecordingOptions = {
          recorderOptions,
          // THIS IS THE FIX: We subscribe to the library's state changes
          onStateChange: (newState: RecordingState) => {
            setStatus(s => ({ ...s, recordingState: newState, error: null }));
          },
        };
        mediaInstanceRef.current.startRecording(optionsWithCallback);
      } catch (err) {
        handleError(err);
      }
    }
  }, [handleError]);

  const pauseRecording = useCallback(() => {
    try {
      mediaInstanceRef.current?.pauseRecording?.();
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const resumeRecording = useCallback(() => {
    try {
      mediaInstanceRef.current?.resumeRecording?.();
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  const stopRecording = useCallback(async () => {
    if (mediaInstanceRef.current?.stopRecording) {
      try {
        // The onStateChange handler will automatically set state to 'inactive'
        const blob = await mediaInstanceRef.current.stopRecording();
        return blob;
      } catch (err) {
        handleError(err);
      }
    }
    return undefined;
  }, [handleError]);


  return {
    videoRef,
    ...status,
    start,
    stop,
    // Conditionally return functions based on options for type safety
    ...(enablePhoto && { takePhoto }),
    ...(enableRecorder && {
      startRecording,
      stopRecording,
      pauseRecording,
      resumeRecording
    }),
  };
}