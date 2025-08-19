async function listDevices(deviceKind: MediaDeviceKind) {
  if (!navigator.mediaDevices?.enumerateDevices) {
    throw new Error('Device enumeration is not supported by this browser.');
  }
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === deviceKind);
}

export const listAudioInputDevices = () => listDevices('audioinput');
export const listVideoInputDevices = () => listDevices('videoinput');