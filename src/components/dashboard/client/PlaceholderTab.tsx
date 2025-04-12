
import { Button } from "@/components/ui/button";

interface PlaceholderTabProps {
  title: string;
  message: string;
  setActiveTab: (tab: string) => void;
}

export const PlaceholderTab = ({ title, message, setActiveTab }: PlaceholderTabProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">{message}</p>
        <Button onClick={() => setActiveTab("overview")}>Go Back to Dashboard</Button>
      </div>
    </div>
  );
};
