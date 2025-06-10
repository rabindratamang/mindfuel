"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface GalleryImage {
  id: string
  src: string
  alt: string
  caption?: string
  thumbnail?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4 | 5
  gap?: "sm" | "md" | "lg"
  showCaptions?: boolean
  lightbox?: boolean
  className?: string
}

export function ImageGallery({
  images,
  columns = 3,
  gap = "md",
  showCaptions = true,
  lightbox = true,
  className,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState<number | null>(null)

  const getColumnsClass = () => {
    switch (columns) {
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      case 4:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      case 5:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    }
  }

  const getGapClass = () => {
    switch (gap) {
      case "sm":
        return "gap-2"
      case "md":
        return "gap-4"
      case "lg":
        return "gap-6"
      default:
        return "gap-4"
    }
  }

  const openLightbox = (index: number) => {
    if (lightbox) {
      setSelectedImage(index)
    }
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImage !== null) {
        switch (event.key) {
          case "Escape":
            closeLightbox()
            break
          case "ArrowLeft":
            goToPrevious()
            break
          case "ArrowRight":
            goToNext()
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage])

  return (
    <>
      <div className={cn("grid", getColumnsClass(), getGapClass(), className)}>
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="group relative overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={image.thumbnail || image.src}
              alt={image.alt}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {lightbox && (
              <motion.div
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => openLightbox(index)}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
              >
                <ZoomIn className="h-8 w-8 text-white" />
              </motion.div>
            )}

            {showCaptions && image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && selectedImage !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] mx-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage].src || "/placeholder.svg"}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-full object-contain"
              />

              {images[selectedImage].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-center">{images[selectedImage].caption}</p>
                </div>
              )}
            </motion.div>

            {/* Controls */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
