import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type ImageFormat = 'webp' | 'jpeg' | 'png' | 'avif';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  width?: number;
  height?: number;
  thumbnailSize?: number;
  quality?: number;
  priority?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
  format?: ImageFormat;
  srcSetSizes?: number[];
}

/**
 * Optimized image component with lazy loading, responsive images, and performance optimizations.
 * Supports blur-up placeholders, responsive srcSet, and automatic format conversion.
 */
const OptimizedImage = ({
  src,
  alt,
  className = "",
  imgClassName = "",
  sizes = "100vw",
  width,
  height,
  thumbnailSize = 400,
  quality = 75,
  priority = false,
  onClick,
  onLoad,
  onError,
  lazy = true,
  format = 'webp',
  srcSetSizes = [320, 640, 768, 1024, 1280, 1536],
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const imgElementRef = useRef<HTMLImageElement>(null);

  // Check if the URL is from Supabase Storage
  const isSupabaseUrl = (url: string) => 
    url.includes("supabase") && url.includes("/storage/");

  // Generate optimized image URL with transformations
  const getOptimizedUrl = (
    url: string, 
    size: number, 
    format: ImageFormat = 'webp',
    quality: number = 75
  ): string => {
    if (!isSupabaseUrl(url)) return url;
    
    const separator = url.includes("?") ? "&" : "?";
    const params = new URLSearchParams();
    
    if (width || height) {
      params.append('width', (width || '').toString());
      params.append('height', (height || '').toString());
      params.append('resize', 'cover');
      params.append('quality', quality.toString());
    } else {
      params.append('width', size.toString());
      params.append('quality', quality.toString());
    }
    
    return `${url}${separator}${params.toString()}`;
  };

  // Generate srcSet string for responsive images
  const generateSrcSet = (url: string): string => {
    if (!isSupabaseUrl(url)) return '';
    
    return srcSetSizes
      .map((size) => {
        const optimizedUrl = getOptimizedUrl(url, size, format, quality);
        return `${optimizedUrl} ${size}w`;
      })
      .join(', ');
  };

  const srcSet = generateSrcSet(src);
  const optimizedUrl = getOptimizedUrl(src, thumbnailSize, format, quality);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.01,
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [lazy]);

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
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        onClick={onClick}
      >
        <span className="text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef} 
      className={cn(
        "relative overflow-hidden",
        className
      )} 
      onClick={onClick}
      style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/50 animate-pulse" />
      )}

      {/* Actual image - only load when in view or priority */}
      {(isInView || priority) && (
        <>
          <img
            ref={imgElementRef}
            src={optimizedUrl}
            srcSet={srcSet || undefined}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              imgClassName
            )}
            onLoad={handleLoad}
            onError={handleError}
            {...(priority ? { fetchPriority: 'high' } : {})}
          />
          
          {/* Low-quality image preview for better perceived performance */}
          {!isLoaded && (
            <img
              src={getOptimizedUrl(src, 20, format, 10)}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
              onError={(e) => {
                // Hide the low-quality image if it fails to load
                (e.target as HTMLImageElement).style.opacity = '0';
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export { OptimizedImage };
export type { OptimizedImageProps };