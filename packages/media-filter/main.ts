import { loadImageToCanvas } from './src/image/utils';
import { applyImageFilters } from './src/image/ImagePipeline';
import { SepiaFilter } from './src/image/filters/SepiaFilter';
import { BrightnessFilter } from './src/image/filters/BrightnessFilter';

// --- IMAGE DEMO ---
async function runImageDemo() {
  const originalImage = document.getElementById('original-image') as HTMLImageElement;
  const filteredCanvas = document.getElementById('filtered-image-canvas') as HTMLCanvasElement;
  const filteredCtx = filteredCanvas.getContext('2d')!;

  originalImage.crossOrigin = "Anonymous"

  // Wait for the image to be fully loaded by the browser
  originalImage.onload = async () => {
    const { canvas, ctx } = await loadImageToCanvas(originalImage);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Define a chain of filters
    const filters = [
      new SepiaFilter(),
      new BrightnessFilter(10), // Add 20 to RGB values
    ];

    // Apply the filters
    const filteredImageData = applyImageFilters(imageData, filters);

    // Display the result
    filteredCanvas.width = filteredImageData.width;
    filteredCanvas.height = filteredImageData.height;
    filteredCtx.putImageData(filteredImageData, 0, 0);
  };
  // Handle cases where the image is already cached and loaded
  if (originalImage.complete) {
    originalImage.onload(new Event('load'));
  }
}

runImageDemo()