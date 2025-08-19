// Assuming your library exports a function or class like 'createMedia'
// import { createMedia } from 'headless-media';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>Vanilla JS Media Player</h2>
    <p>Check the console to see library output.</p>
  </div>
`
// Example usage:
// const mediaContainer = document.getElementById('media-container');
// if (mediaContainer) {
//   const player = createMedia({
//     container: mediaContainer,
//     source: 'your-media-source.mp4'
//   });
//   console.log('Player instance:', player);
// }

console.log("headless-media library would be initialized here.");