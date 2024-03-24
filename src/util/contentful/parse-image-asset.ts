import type { Asset, AssetLink } from 'contentful';

/**
 * The `ContentImage` interface represents the properties needed to render an
 * image on the browser.
 */
export interface ContentImage {
	/**
	 * The source URL of the image.
	 */
	src: string;
	/**
	 * The alternative text for the image for accessibility.
	 */
	alt: string;
	/**
	 * The width of the image in pixels.
	 */
	width: number;
	/**
	 * The height of the image in pixels.
	 */
	height: number;
}

/**
 * The `parseContentfulContentImage()` function parses the image asset from
 * Contentful, translating it into the properties returned by it, needed for an
 * image to render on the browser.
 */
export default function parseContentfulContentImage(
	asset?: Asset<undefined, string> | { sys: AssetLink },
): ContentImage | null {
	if (!asset) {
		return null;
	}

	if (!('fields' in asset)) {
		return null;
	}

	return {
		src: asset.fields.file?.url || '',
		alt: asset.fields.description || '',
		width: asset.fields.file?.details.image?.width || 0,
		height: asset.fields.file?.details.image?.height || 0,
	};
}
