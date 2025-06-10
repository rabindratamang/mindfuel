"use client"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  maxVisiblePages?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = []

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const halfVisible = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, currentPage + halfVisible)

    if (currentPage <= halfVisible) {
      end = maxVisiblePages
    } else if (currentPage > totalPages - halfVisible) {
      start = totalPages - maxVisiblePages + 1
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push("ellipsis")
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("ellipsis")
      }
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <nav className={cn("flex items-center justify-center space-x-1", className)}>
      {/* First page */}
      {showFirstLast && currentPage > 1 && (
        <Button variant="outline" size="sm" onClick={() => onPageChange(1)} className="px-2">
          First
        </Button>
      )}

      {/* Previous page */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Page numbers */}
      {visiblePages.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <div key={`ellipsis-${index}`} className="px-2">
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </div>
          )
        }

        const isActive = page === currentPage

        return (
          <motion.div key={page} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={cn("w-9", isActive && "bg-teal-500 hover:bg-teal-600 text-white")}
            >
              {page}
            </Button>
          </motion.div>
        )
      })}

      {/* Next page */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Last page */}
      {showFirstLast && currentPage < totalPages && (
        <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)} className="px-2">
          Last
        </Button>
      )}
    </nav>
  )
}
