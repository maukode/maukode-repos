// src/image/filters/GrayscaleFilter.ts
import type { IImageFilter } from './IImageFilter';

export class GrayscaleFilter implements IImageFilter {
    apply(imageData: ImageData): ImageData {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Using the luminosity method for better results
            // L = 0.299*R + 0.587*G + 0.114*B
            const luminosity = 0.299 * r + 0.587 * g + 0.114 * b;

            data[i] = luminosity;     // Red
            data[i + 1] = luminosity; // Green
            data[i + 2] = luminosity; // Blue
        }
        return imageData;
    }
}