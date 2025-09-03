// src/image/utils.ts

/**
 * Loads an image element and draws it to a canvas, 
 * returning the canvas and its 2D context.
 * @param source An image source (URL, HTMLImageElement, etc.)
 * @returns A promise that resolves with the canvas and context.
 */
export async function loadImageToCanvas(source: HTMLImageElement | string): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }> {
    const image = source instanceof HTMLImageElement ? source : await loadImage(source);
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get 2D context from canvas.');
    }

    ctx.drawImage(image, 0, 0);
    return { canvas, ctx };
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Important for fetching images from other domains
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}