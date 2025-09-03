import type { IImageFilter } from './IImageFilter';

export class BrightnessFilter implements IImageFilter {
    private amount: number
    // We can add options to our filters
    constructor(amount: number = 10) {
        // amount should be between -255 and 255
        this.amount = Math.max(-255, Math.min(255, amount));
    }

    apply(imageData: ImageData): ImageData {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] += this.amount;       // Red
            data[i + 1] += this.amount;   // Green
            data[i + 2] += this.amount;   // Blue
        }
        return imageData;
    }
}