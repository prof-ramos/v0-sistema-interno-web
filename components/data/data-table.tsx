'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Column } from '@/lib/types'

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

type SortDirection = 'asc' | 'desc' | null

function getColumnValue<T extends object>(item: T, key: keyof T | string): unknown {
  if (typeof key !== 'string' || !(key in item)) {
    return undefined
  }

  return item[key as keyof T]
}

export function DataTable<T extends object>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyMessage = 'Nenhum registro encontrado.',
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortKey(null)
        setSortDirection(null)
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data
    const sortColumn = columns.find((item) => String(item.key) === sortKey)

    return [...data].sort((a, b) => {
      const aValue = sortColumn?.sortableValue ? sortColumn.sortableValue(a) : getColumnValue(a, sortKey)
      const bValue = sortColumn?.sortableValue ? sortColumn.sortableValue(b) : getColumnValue(b, sortKey)

      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      let comparison: number
      if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime()
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        const aFinite = Number.isFinite(aValue)
        const bFinite = Number.isFinite(bValue)
        if (!aFinite && !bFinite) comparison = 0
        else if (!aFinite) comparison = 1
        else if (!bFinite) comparison = -1
        else comparison = aValue - bValue
      } else {
        comparison = String(aValue).localeCompare(String(bValue), 'pt-BR', {
          numeric: true,
          sensitivity: 'base',
        })
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [columns, data, sortKey, sortDirection])

  const getSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ChevronsUpDown className="ml-1 size-4 opacity-50" />
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="ml-1 size-4" />
    }
    return <ChevronDown className="ml-1 size-4" />
  }

  if (isLoading) {
    return (
      <div className={cn('rounded-lg border', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)} style={{ width: column.width }}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn('rounded-lg border bg-muted/50 p-8 text-center', className)}>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border overflow-hidden', className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead 
                key={String(column.key)} 
                style={{ width: column.width }}
                className="bg-muted/30"
              >
                {column.sortable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 hover:bg-transparent"
                    onClick={() => handleSort(String(column.key))}
                  >
                    {column.header}
                    {getSortIcon(String(column.key))}
                  </Button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={cn(
                onRowClick && 'cursor-pointer hover:bg-accent/50'
              )}
            >
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render
                    ? column.render(item)
                    : String(getColumnValue(item, column.key) ?? '-')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
