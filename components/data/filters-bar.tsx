'use client'

import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FilterConfig } from '@/lib/types'

interface FiltersBarProps {
  search: string
  onSearchChange: (value: string) => void
  filters?: FilterConfig[]
  filterValues?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onClearFilters?: () => void
  placeholder?: string
  className?: string
}

export function FiltersBar({
  search,
  onSearchChange,
  filters,
  filterValues = {},
  onFilterChange,
  onClearFilters,
  placeholder = 'Buscar...',
  className,
}: FiltersBarProps) {
  const hasActiveFilters = search || Object.values(filterValues).some(Boolean)

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter selects */}
      {filters?.map((filter) => (
        <Select
          key={filter.key}
          value={filterValues[filter.key] || ''}
          onValueChange={(value) => onFilterChange?.(filter.key, value)}
        >
          <SelectTrigger aria-label={filter.label} className="w-[160px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {filter.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {/* Clear filters button */}
      {hasActiveFilters && onClearFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-9 px-2 text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 size-4" />
          Limpar
        </Button>
      )}
    </div>
  )
}
