import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface GalleryLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[] | string[] | string;
  initialIndex?: number;
  showThumbnails?: boolean;
  showNavigation?: boolean;
  showCaption?: boolean;
  onIndexChange?: (index: number) => void;
}

/**
 * Enhanced Lightbox component for viewing images with keyboard navigation,
 * touch gestures, and accessibility features.
 */
const GalleryLightbox = ({
  isOpen,
  onClose,
  images: imagesProp,
  initialIndex = 0,
  showThumbnails = true,
  showNavigation = true,
  showCaption = true,
  onIndexChange,
}: GalleryLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Normalize images prop to always be an array of GalleryImage objects
  const images = useMemo<GalleryImage[]>(() => {
    if (Array.isArray(imagesProp)) {
      return imagesProp.map(img => 
        typeof img === 'string' ? { src: img, alt: '' } : img
      );
    }
    return [{ src: imagesProp, alt: '' }];
  }, [imagesProp]);

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasMultipleImages) goToPrev();
          break;
        case 'ArrowRight':
          if (hasMultipleImages) goToNext();
          break;
        case 'f':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, hasMultipleImages]);

  // Handle initial index changes
  useEffect(() => {
    if (isOpen && initialIndex >= 0 && initialIndex < images.length) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
    }
  }, [initialIndex, isOpen, images.length]);

  // Reset state when closing
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset states with a delay for smoother transitions
      setTimeout(() => {
        setCurrentIndex(0);
        setIsLoading(true);
        setIsFullscreen(false);
      }, 300);
    }
  };

  // Navigation functions
  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const goToImage = (index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
      setIsLoading(true);
      onIndexChange?.(index);
    }
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || !hasMultipleImages) return;
    
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // Only handle horizontal swipes
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      setTouchStartX(null);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      dialogRef.current?.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Preload next and previous images
  useEffect(() => {
    if (!isOpen || !hasMultipleImages) return;

    const preloadUrls = [
      images[(currentIndex - 1 + images.length) % images.length]?.src,
      images[(currentIndex + 1) % images.length]?.src,
    ].filter(Boolean);

    preloadUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [currentIndex, images, isOpen, hasMultipleImages]);

  // Handle image load
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    // Add protection attributes after load
    img.setAttribute('oncontextmenu', 'return false');
    img.setAttribute('draggable', 'false');
    img.style.pointerEvents = 'none';
    img.style.userSelect = 'none';
    img.style.setProperty('-webkit-user-select', 'none');
    img.style.setProperty('-webkit-touch-callout', 'none');
    setIsLoading(false);
  };

  // Handle image error
  const handleImageError = () => {
    setIsLoading(false);
    // You could add error state handling here
  };

  // Prevent context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Prevent drag start
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  // Don't render if no images
  if (!images.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        ref={dialogRef}
        className={cn(
          "max-w-full max-h-[90vh] p-0 bg-transparent border-none shadow-none",
          isFullscreen ? "h-screen max-h-none" : "max-w-5xl"
        )}
      >
        <div 
          className={cn(
            "relative flex flex-col h-full w-full select-none",
            isFullscreen ? "bg-black" : "bg-background/90 backdrop-blur-sm"
          )}
          style={{
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
            WebkitTouchCallout: 'none',
            touchAction: 'manipulation'
          }}
          onContextMenu={handleContextMenu}
        >
          {/* Header with close button and image counter */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Close gallery"
            >
              <X size={24} />
            </button>
            
            {hasMultipleImages && (
              <div className="text-white text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            )}
            
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              )}
            </button>
          </div>

          {/* Main image container */}
          <div 
            className={cn(
              "relative flex-1 flex items-center justify-center p-4 overflow-hidden",
              isFullscreen ? "h-[calc(100%-120px)]" : "max-h-[70vh]"
            )}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}

            {/* Navigation arrows */}
            {showNavigation && hasMultipleImages && (
              <>
                <button
                  onClick={goToPrev}
                  className={cn(
                    "absolute left-4 p-2 rounded-full bg-background/80 hover:bg-background text-foreground z-10 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "transform hover:scale-110 active:scale-95"
                  )}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={goToNext}
                  className={cn(
                    "absolute right-4 p-2 rounded-full bg-background/80 hover:bg-background text-foreground z-10 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "transform hover:scale-110 active:scale-95"
                  )}
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Main image */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              onTouchStart={handleTouchStart}
              style={{
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                touchAction: 'pan-y'
              }}
            >
              {/* Transparent overlay to intercept interactions */}
              <div 
                className="absolute inset-0 z-10"
                style={{
                  background: 'transparent',
                  pointerEvents: 'auto',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Main image with protection attributes */}
              <img
                src={currentImage.src}
                alt={currentImage.alt || "Gallery image"}
                className={cn(
                  "max-w-full max-h-full object-contain transition-opacity duration-300 select-none",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                style={{
                  pointerEvents: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  touchAction: 'none'
                }}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="eager"
                decoding="async"
                draggable="false"
                unselectable="on"
              />
            </div>
          </div>

          {/* Caption */}
          {showCaption && currentImage.caption && (
            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
              <p className="text-sm sm:text-base">{currentImage.caption}</p>
            </div>
          )}

          {/* Thumbnail strip */}
          {showThumbnails && hasMultipleImages && (
            <div className="flex overflow-x-auto py-2 px-4 space-x-2 bg-black/50">
              {images.map((img, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all relative group",
                    index === currentIndex 
                      ? "border-primary ring-2 ring-primary" 
                      : "border-transparent hover:border-foreground/30"
                  )}
                  onClick={() => goToImage(index)}
                  onContextMenu={handleContextMenu}
                  onDragStart={handleDragStart}
                  style={{
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    touchAction: 'manipulation'
                  }}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <div className="absolute inset-0 z-10" style={{ pointerEvents: 'auto' }} />
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    onContextMenu={handleContextMenu}
                    onDragStart={handleDragStart}
                    style={{
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'none',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { GalleryLightbox };
export type { GalleryImage, GalleryLightboxProps };