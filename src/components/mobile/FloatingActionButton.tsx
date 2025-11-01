import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FABProps {
  actions: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
}

export const FloatingActionButton = ({ actions }: FABProps) => {
  if (actions.length === 0) return null;

  // Single action - direct button
  if (actions.length === 1) {
    return (
      <Button
        onClick={actions[0].onClick}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-servie hover:bg-servie-600 text-white md:hidden z-50"
        size="icon"
      >
        {actions[0].icon || <Plus className="h-6 w-6" />}
      </Button>
    );
  }

  // Multiple actions - dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-servie hover:bg-servie-600 text-white md:hidden z-50"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {actions.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.onClick} className="cursor-pointer">
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
