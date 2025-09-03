// src/image/ImagePipeline.ts
import type { IImageFilter } from './filters/IImageFilter';

export function applyImageFilters(
    initialData: ImageData,
    filters: IImageFilter[]
): ImageData {
    // Use reduce to apply each filter sequentially
    return filters.reduce(
        (currentData, filter) => filter.apply(currentData),
        initialData
    );
}