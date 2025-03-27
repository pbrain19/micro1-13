import { Calendar, Check } from "lucide-react";
import { Card } from "./ui/card";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type MedicalCardProps = {
  header: string;
  title: string;
  medicationName: string;
  dateToAdminister: Date;
  icon: React.ReactNode;
  isComplete?: boolean;
  id: string;
  onEdit: (id: string) => void;
  onToggleComplete: (id: string, isComplete: boolean) => void;
};

export default function MedicalCard({
  header,
  title,
  medicationName,
  dateToAdminister,
  icon,
  isComplete = false,
  id,
  onEdit,
  onToggleComplete,
}: MedicalCardProps) {
  const handleCardClick = () => {
    onEdit(id);
  };

  const handleCheckboxChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click when clicking the checkbox
    onToggleComplete(id, !isComplete);
  };

  return (
    <Card
      className={cn(
        "shadow-sm cursor-pointer transition-colors hover:bg-accent/50 max-sm:p-0 p-1",
        isComplete && "bg-muted/50"
      )}
      onClick={handleCardClick}
    >
      <div className="p-2.5 max-sm:p-4">
        {/* Row 1: Header with icon and checkbox */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">{icon}</span>
            <p className="font-medium text-sm">{header}</p>
          </div>
          <button
            onClick={handleCheckboxChange}
            className="h-5 w-5 flex items-center justify-center rounded border border-primary hover:bg-primary/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label={isComplete ? "Mark as incomplete" : "Mark as complete"}
          >
            {isComplete && <Check className="h-3.5 w-3.5 text-primary" />}
          </button>
        </div>

        {/* Mobile layout: Each item on its own line */}
        <div className="block max-sm:hidden space-y-1">
          <p
            className={cn(
              "text-sm font-medium line-clamp-1",
              isComplete && "line-through text-muted-foreground"
            )}
          >
            {title}
          </p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(dateToAdminister)}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {medicationName}
          </p>
        </div>

        {/* Desktop layout: Title and medication on left, date on right */}
        <div className="hidden max-sm:flex max-sm:flex-col justify-between items-start max-sm:space-y-1">
          <div className="min-w-0 flex-1 max-sm:space-y-1 ">
            <p
              className={cn(
                "text-sm font-medium truncate",
                isComplete && "line-through text-muted-foreground"
              )}
            >
              {title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {medicationName}
            </p>
          </div>
          <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap ml-2 max-sm:ml-0 max-sm:mt-1">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(dateToAdminister)}
          </div>
        </div>
      </div>
    </Card>
  );
}
