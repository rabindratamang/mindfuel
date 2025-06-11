"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/ui-kit/forms/search-bar"

interface Column<T> {
  header: string
  accessorKey: keyof T
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  pagination?: boolean
  pageSize?: number
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  pagination = false,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof T | null
    direction: "asc" | "desc" | null
  }>({ key: null, direction: null })

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
    onSearch?.(value)
  }

  const handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" | null = "asc"

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = null
      }
    }

    setSortConfig({ key, direction })
  }

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!]
      const bValue = b[sortConfig.key!]

      if (aValue === bValue) return 0

      if (sortConfig.direction === "asc") {
        return aValue < bValue ? -1 : 1
      } else {
        return aValue > bValue ? -1 : 1
      }
    })
  }, [data, sortConfig])

  const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1
  const paginatedData = pagination ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sortedData

  return (
    <div className={cn("space-y-4", className)}>
      {searchable && (
        <div className="flex justify-end">
          <SearchBar placeholder={searchPlaceholder} onChange={handleSearch} className="w-full sm:w-64 md:w-80" />
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={cn(
                    column.sortable ? "cursor-pointer select-none" : "",
                    "whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4",
                  )}
                  onClick={() => column.sortable && handleSort(column.accessorKey)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortConfig.key === column.accessorKey ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : sortConfig.direction === "desc" ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronsUpDown className="h-3 w-3 opacity-50" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 opacity-50" />
                        )}
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                  className="border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">
                      {column.cell ? column.cell(row) : (row[column.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-xs sm:text-sm"
            >
              Previous
            </Button>
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page = i + 1
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    page = currentPage - 2 + i
                  }
                  if (currentPage > totalPages - 2) {
                    page = totalPages - 4 + i
                  }
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-8 h-8 text-xs sm:text-sm",
                      currentPage === page ? "bg-teal-500 hover:bg-teal-600" : "",
                    )}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-xs sm:text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
