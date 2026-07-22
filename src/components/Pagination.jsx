import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Pagination({ page, totalPages, onPageChange, prevLabel = 'Trang trước', nextLabel = 'Trang sau', showIcons = true }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 0}
        onClick={() => onPageChange(page - 1)}
      >
        {showIcons && <ChevronLeft className="h-4 w-4" />}
        {prevLabel}
      </Button>
      <span className="text-sm text-muted-foreground px-3">
        <span className="font-bold text-foreground">Trang {page + 1}</span>
        <span> / {totalPages}</span>
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        {nextLabel}
        {showIcons && <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
}