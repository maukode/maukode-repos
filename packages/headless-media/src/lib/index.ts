export {createMedia} from './core';
export {withPhoto} from './features/photo';
export {withRecorder} from './features/recorder';
export type {
    CoreMediaState, 
    MediaStartOptions,
    CoreMedia,
    PhotoFeature,
    RecorderFeature,
    VolumeMeterFeature
} from './types';
export {listAudioInputDevices, listVideoInputDevices} from './utils/device';