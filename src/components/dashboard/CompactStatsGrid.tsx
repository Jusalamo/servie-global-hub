import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatItem {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface CompactStatsGridProps {
  stats: StatItem[];
  className?: string;
}

export const CompactStatsGrid = ({ stats, className }: CompactStatsGridProps) => {
  return (
    <div className={cn(
      'grid gap-3',
      // Mobile: 2 columns, Tablet: 2 columns, Desktop: 4 columns
      'grid-cols-2 md:grid-cols-2 lg:grid-cols-4',
      className
    )}>
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground truncate">
              {stat.title}
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground flex-shrink-0">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-lg md:text-xl font-bold truncate">
              {typeof stat.value === 'number' && !isNaN(stat.value)
                ? stat.value.toLocaleString()
                : stat.value}
            </div>
            {(stat.description || stat.trend) && (
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                {stat.description}
                {stat.trend && (
                  <span className={cn(
                    'ml-1',
                    stat.trend.isPositive ? 'text-green-500' : 'text-red-500'
                  )}>
                    {stat.trend.isPositive ? '↑' : '↓'} {Math.abs(stat.trend.value)}%
                  </span>
                )}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompactStatsGrid;
