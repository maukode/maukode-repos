import type { IImageFilter } from './IImageFilter';

export class SepiaFilter implements IImageFilter {
    apply(imageData: ImageData): ImageData {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const tr = 0.393 * r + 0.769 * g + 0.189 * b;
            const tg = 0.349 * r + 0.686 * g + 0.168 * b;
            const tb = 0.272 * r + 0.534 * g + 0.131 * b;

            data[i] = Math.min(255, tr);
            data[i + 1] = Math.min(255, tg);
            data[i + 2] = Math.min(255, tb);
        }
        return imageData;
    }
}