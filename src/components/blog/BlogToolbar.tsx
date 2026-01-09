import { Search, LayoutGrid, Tag, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ViewMode, SortOrder } from '@/types/blog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BlogToolbarProps {
  viewMode: ViewMode;
  sortOrder: SortOrder;
  searchQuery: string;
  onViewModeChange: (mode: ViewMode) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onSearchChange: (query: string) => void;
}

export function BlogToolbar({
  viewMode,
  sortOrder,
  searchQuery,
  onViewModeChange,
  onSortOrderChange,
  onSearchChange,
}: BlogToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="gap-2"
        >
          <LayoutGrid className="h-4 w-4" />
          All blogs
        </Button>
        <Button
          variant={viewMode === 'grouped' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grouped')}
          className="gap-2"
        >
          <Tag className="h-4 w-4" />
          Grouped by tag
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSortOrderChange('newest')}>
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortOrderChange('oldest')}>
              Oldest first
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-[200px]"
          />
        </div>
      </div>
    </div>
  );
}
