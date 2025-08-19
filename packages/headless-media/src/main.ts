import { createMedia } from './lib/core';

const videoEl = document.getElementById('webcam-video') as HTMLVideoElement;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const stopBtn = document.getElementById('stop-btn') as HTMLButtonElement;

// Create the controller instance
const controller = createMedia(videoEl);

startBtn.addEventListener('click', () => controller.start({ video: true, audio: true }));
stopBtn.addEventListener('click', () => controller.stop());