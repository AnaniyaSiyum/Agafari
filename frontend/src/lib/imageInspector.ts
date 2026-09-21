/**
 * Utility for client-side image dimension inspection and aspect ratio validation.
 * Provides clear size specifications, validation badges, and warning notices for non-standard image uploads.
 */

export interface ImageInspectionResult {
  width: number;
  height: number;
  fileSizeMb: number;
  aspectRatio: number;
  recommendedWidth: number;
  recommendedHeight: number;
  recommendedRatioName: string;
  isOptimal: boolean;
  statusBadgeText: string;
  warningMessage?: string;
}

export interface ImageSpecPreset {
  recommendedWidth: number;
  recommendedHeight: number;
  recommendedRatioName: string;
  maxSizeMb: number;
  description: string;
}

export const IMAGE_SPECS: Record<string, ImageSpecPreset> = {
  HERO_COVER: {
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    recommendedRatioName: '16:9 Widescreen',
    maxSizeMb: 10,
    description: '1920 × 1080 px (16:9 Landscape) • Max 10MB',
  },
  COUPLE_PORTRAIT: {
    recommendedWidth: 800,
    recommendedHeight: 800,
    recommendedRatioName: '1:1 Square / 4:5 Portrait',
    maxSizeMb: 5,
    description: '800 × 800 px (1:1) or 800 × 1000 px (4:5) • Max 5MB',
  },
  STORY_CARD: {
    recommendedWidth: 800,
    recommendedHeight: 600,
    recommendedRatioName: '4:3 Standard',
    maxSizeMb: 5,
    description: '800 × 600 px (4:3 Standard) • Max 5MB',
  },
  MEDIA_ASSET: {
    recommendedWidth: 1200,
    recommendedHeight: 800,
    recommendedRatioName: '3:2 / 4:5 Gallery Format',
    maxSizeMb: 15,
    description: '1200 × 800 px (3:2) or 1080 × 1350 px (4:5) • Max 15MB',
  },
};

/**
 * Reads a File object and evaluates its dimensions against recommended specifications.
 */
export async function inspectImageFile(
  file: File,
  specKey: keyof typeof IMAGE_SPECS | ImageSpecPreset
): Promise<ImageInspectionResult> {
  const spec: ImageSpecPreset = typeof specKey === 'string' ? IMAGE_SPECS[specKey] : specKey;
  const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2));

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        resolve({
          width: 0,
          height: 0,
          fileSizeMb,
          aspectRatio: 1,
          recommendedWidth: spec.recommendedWidth,
          recommendedHeight: spec.recommendedHeight,
          recommendedRatioName: spec.recommendedRatioName,
          isOptimal: true,
          statusBadgeText: 'File Loaded',
        });
        return;
      }

      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const actualRatio = height > 0 ? width / height : 1;
        const targetRatio = spec.recommendedWidth / spec.recommendedHeight;

        // Ratio difference percentage
        const ratioDiff = Math.abs(actualRatio - targetRatio) / targetRatio;
        const isRatioOptimal = ratioDiff <= 0.25; // within 25% tolerance
        const isSizeOptimal = fileSizeMb <= spec.maxSizeMb;
        const isOptimal = isRatioOptimal && isSizeOptimal;

        const actualRatioFormatted = (actualRatio).toFixed(2);

        let warningMessage: string | undefined;
        if (!isOptimal) {
          if (!isRatioOptimal && !isSizeOptimal) {
            warningMessage = `⚠️ Non-standard Aspect Ratio (${width}×${height}px, ${actualRatioFormatted}:1) & large file size (${fileSizeMb}MB). Recommended is ${spec.recommendedWidth}×${spec.recommendedHeight}px (${spec.recommendedRatioName}, Max ${spec.maxSizeMb}MB). Image may crop or load slowly.`;
          } else if (!isRatioOptimal) {
            warningMessage = `⚠️ Non-standard Aspect Ratio: Loaded image is ${width}×${height}px (${actualRatioFormatted}:1 ratio). Recommended size is ${spec.recommendedWidth}×${spec.recommendedHeight}px (${spec.recommendedRatioName}). Image might crop or stretch on wide screen displays.`;
          } else {
            warningMessage = `⚠️ Large File Size Warning: Image is ${fileSizeMb}MB (Recommended max ${spec.maxSizeMb}MB). May take longer to load for guests on mobile data.`;
          }
        }

        const statusBadgeText = isOptimal
          ? `✓ Optimal Dimensions Validated: ${width}×${height}px (${spec.recommendedRatioName})`
          : `⚠️ Dimension Alert: ${width}×${height}px`;

        resolve({
          width,
          height,
          fileSizeMb,
          aspectRatio: actualRatio,
          recommendedWidth: spec.recommendedWidth,
          recommendedHeight: spec.recommendedHeight,
          recommendedRatioName: spec.recommendedRatioName,
          isOptimal,
          statusBadgeText,
          warningMessage,
        });
      };

      img.onerror = () => {
        resolve({
          width: 0,
          height: 0,
          fileSizeMb,
          aspectRatio: 1,
          recommendedWidth: spec.recommendedWidth,
          recommendedHeight: spec.recommendedHeight,
          recommendedRatioName: spec.recommendedRatioName,
          isOptimal: true,
          statusBadgeText: 'Image loaded',
        });
      };

      img.src = dataUrl;
    };
    reader.onerror = () => {
      resolve({
        width: 0,
        height: 0,
        fileSizeMb,
        aspectRatio: 1,
        recommendedWidth: spec.recommendedWidth,
        recommendedHeight: spec.recommendedHeight,
        recommendedRatioName: spec.recommendedRatioName,
        isOptimal: true,
        statusBadgeText: 'File read error',
      });
    };
    reader.readAsDataURL(file);
  });
}
