import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
}

/**
 * Simplified optimized image component with basic lazy loading and error handling.
 */
const OptimizedImage = ({
  src,
  alt,
  className = "",
  imgClassName = "",
  sizes = "100vw",
  width,
  height,
  quality = 80,
  priority = false,
  onClick,
  onLoad,
  onError,
  lazy = true,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={cn("bg-gray-100 flex items-center justify-center text-gray-400", className)}>
        <span>Image not available</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)} onClick={onClick}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={lazy && !priority ? "lazy" : "eager"}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export { OptimizedImage };
export type { OptimizedImageProps };