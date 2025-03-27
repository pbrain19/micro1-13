import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  VaccinationSchedule,
  MedicationSchedule,
  AppointmentSchedule,
} from "@/lib/types";
import { Pill, Syringe, User } from "lucide-react";
import MedicalCard from "@/components/medical-card";
interface DashboardProps {
  vaccinations: VaccinationSchedule[];
  medications: MedicationSchedule[];
  appointments: AppointmentSchedule[];
}

export default function Dashboard({
  vaccinations,
  medications,
  appointments,
}: DashboardProps) {
  // Get the next upcoming item of each type (not completed and soonest date)
  const nextVaccination = vaccinations
    .filter((v) => !v.isComplete)
    .sort(
      (a, b) => a.dateToAdminister.getTime() - b.dateToAdminister.getTime()
    )[0];

  const nextMedication = medications
    .filter((m) => !m.isComplete)
    .sort(
      (a, b) => a.dateToAdminister.getTime() - b.dateToAdminister.getTime()
    )[0];

  const nextAppointment = appointments
    .filter((a) => !a.isComplete)
    .sort(
      (a, b) => a.dateToAdminister.getTime() - b.dateToAdminister.getTime()
    )[0];

  return (
    <Card className="max-sm:py-4 max-sm:gap-2">
      <CardHeader className="px-4 py-3 sm:px-6 max-sm:py-0">
        <CardTitle>Upcoming Health Events</CardTitle>
        <CardDescription>The next scheduled items for your pet</CardDescription>
      </CardHeader>
      <CardContent className="px-4 py-2 sm:px-6 sm:py-3">
        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {nextVaccination && (
            <MedicalCard
              header="Next Vaccination"
              title={nextVaccination.title}
              medicationName={nextVaccination.medicationName}
              dateToAdminister={nextVaccination.dateToAdminister}
              icon={
                <Syringe className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              }
            />
          )}

          {nextMedication && (
            <MedicalCard
              header="Next Medication"
              title={nextMedication.title}
              medicationName={nextMedication.medicationName}
              dateToAdminister={nextMedication.dateToAdminister}
              icon={
                <Pill className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              }
            />
          )}

          {nextAppointment && (
            <MedicalCard
              header="Next Appointment"
              title={nextAppointment.title}
              medicationName={nextAppointment.medicationName}
              dateToAdminister={nextAppointment.dateToAdminister}
              icon={
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              }
            />
          )}

          {!nextVaccination && !nextMedication && !nextAppointment && (
            <div className="col-span-full text-center py-4 sm:py-6">
              <p className="text-muted-foreground">
                No upcoming health events. Add some using the tabs below.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
