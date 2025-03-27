import { Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { formatDate } from "@/lib/utils";

type MedicalCardProps = {
  header: string;
  title: string;
  medicationName: string;
  dateToAdminister: Date;
  icon: React.ReactNode;
};

export default function MedicalCard({
  header,
  title,
  medicationName,
  dateToAdminister,
  icon,
}: MedicalCardProps) {
  return (
    <Card className="shadow-sm max-sm:gap-1 max-sm:py-2">
      <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2 max-sm:py-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
            {icon}
            {header}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-1 sm:p-4 sm:pt-2">
        <h3 className="font-medium text-sm sm:text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {medicationName}
        </p>
        <div className="mt-1 sm:mt-2 flex items-center text-xs sm:text-sm">
          <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          {formatDate(dateToAdminister)}
        </div>
      </CardContent>
    </Card>
  );
}
