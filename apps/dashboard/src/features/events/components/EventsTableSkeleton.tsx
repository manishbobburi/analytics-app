import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_ROWS = 10;

const SKELETON_COLUMNS = ['w-32', 'w-40', 'w-24', 'w-40', 'w-20', 'w-20', 'w-20'];

export function EventTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {SKELETON_COLUMNS.map((width, index) => (
                <TableHead key={index} className="h-10 whitespace-nowrap px-4">
                  <Skeleton className={`h-4 ${width}`} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {SKELETON_COLUMNS.map((width, columnIndex) => (
                  <TableCell key={columnIndex} className="px-4 py-3">
                    <Skeleton className={`h-4 ${width}`} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
