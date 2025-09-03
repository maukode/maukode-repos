// src/core/types.ts

/**
 * A generic interface for any media filter.
 * T represents the data type being manipulated 
 * (e.g., ImageData for images, AudioBuffer for audio).
 */
export interface IMediaFilter<T> {
    /**
     * Applies the filter to the given data.
     * @param data The media data to process.
     * @returns The processed media data.
     */
    apply(data: T): T;
}

/**
 * A utility type for filter options.
 */
export type FilterOptions = Record<string, any>;