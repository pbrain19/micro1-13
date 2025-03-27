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
import { Pill, Syringe, Calendar } from "lucide-react";
import MedicalCard from "@/components/medical-card";
import { useState } from "react";
import AddEditVaccinationModal from "./modals/add-edit-vaccination-modal";
import AddEditMedicationModal from "./modals/add-edit-medication-modal";
import AddEditAppointmentModal from "./modals/add-edit-appointment-modal";
import { toast } from "sonner";
import { startOfWeek, endOfWeek, addWeeks, isWithinInterval } from "date-fns";

interface DashboardProps {
  vaccinations: VaccinationSchedule[];
  medications: MedicationSchedule[];
  appointments: AppointmentSchedule[];
  onUpdateVaccination: (vaccination: VaccinationSchedule) => void;
  onUpdateMedication: (medication: MedicationSchedule) => void;
  onUpdateAppointment: (appointment: AppointmentSchedule) => void;
}

type UpcomingEvent = {
  type: "vaccination" | "medication" | "appointment";
  data: VaccinationSchedule | MedicationSchedule | AppointmentSchedule;
};

export default function Dashboard({
  vaccinations,
  medications,
  appointments,
  onUpdateVaccination,
  onUpdateMedication,
  onUpdateAppointment,
}: DashboardProps) {
  // Modal state
  const [editingVaccination, setEditingVaccination] =
    useState<VaccinationSchedule | null>(null);
  const [editingMedication, setEditingMedication] =
    useState<MedicationSchedule | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<AppointmentSchedule | null>(null);

  // Get this week's and next week's date ranges
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const nextWeekStart = addWeeks(thisWeekStart, 1);
  const nextWeekEnd = addWeeks(thisWeekEnd, 1);

  // Count events for this week
  const thisWeekVaccinations = vaccinations.filter(
    (v) =>
      !v.isComplete &&
      isWithinInterval(v.dateToAdminister, {
        start: thisWeekStart,
        end: thisWeekEnd,
      })
  ).length;

  const thisWeekMedications = medications.filter(
    (m) =>
      !m.isComplete &&
      isWithinInterval(m.dateToAdminister, {
        start: thisWeekStart,
        end: thisWeekEnd,
      })
  ).length;

  const thisWeekAppointments = appointments.filter(
    (a) =>
      !a.isComplete &&
      isWithinInterval(a.dateToAdminister, {
        start: thisWeekStart,
        end: thisWeekEnd,
      })
  ).length;

  // Count events for next week
  const nextWeekVaccinations = vaccinations.filter(
    (v) =>
      !v.isComplete &&
      isWithinInterval(v.dateToAdminister, {
        start: nextWeekStart,
        end: nextWeekEnd,
      })
  ).length;

  const nextWeekMedications = medications.filter(
    (m) =>
      !m.isComplete &&
      isWithinInterval(m.dateToAdminister, {
        start: nextWeekStart,
        end: nextWeekEnd,
      })
  ).length;

  const nextWeekAppointments = appointments.filter(
    (a) =>
      !a.isComplete &&
      isWithinInterval(a.dateToAdminister, {
        start: nextWeekStart,
        end: nextWeekEnd,
      })
  ).length;

  // Combine and sort all upcoming events
  const upcomingEvents: UpcomingEvent[] = [
    ...vaccinations
      .filter((v) => !v.isComplete)
      .map((v) => ({ type: "vaccination" as const, data: v })),
    ...medications
      .filter((m) => !m.isComplete)
      .map((m) => ({ type: "medication" as const, data: m })),
    ...appointments
      .filter((a) => !a.isComplete)
      .map((a) => ({ type: "appointment" as const, data: a })),
  ]
    .sort(
      (a, b) =>
        a.data.dateToAdminister.getTime() - b.data.dateToAdminister.getTime()
    )
    .slice(0, 3); // Only show the next 3 events

  // Handler functions
  const handleEditVaccination = (id: string) => {
    const vaccination = vaccinations.find((v) => v.id === id);
    if (vaccination) {
      setEditingVaccination(vaccination);
    }
  };

  const handleEditMedication = (id: string) => {
    const medication = medications.find((m) => m.id === id);
    if (medication) {
      setEditingMedication(medication);
    }
  };

  const handleEditAppointment = (id: string) => {
    const appointment = appointments.find((a) => a.id === id);
    if (appointment) {
      setEditingAppointment(appointment);
    }
  };

  const handleToggleVaccinationComplete = (id: string, isComplete: boolean) => {
    const vaccination = vaccinations.find((v) => v.id === id);
    if (vaccination) {
      onUpdateVaccination({
        ...vaccination,
        isComplete,
      });
      toast.success(
        `Vaccination marked as ${isComplete ? "complete" : "incomplete"}`
      );
    }
  };

  const handleToggleMedicationComplete = (id: string, isComplete: boolean) => {
    const medication = medications.find((m) => m.id === id);
    if (medication) {
      onUpdateMedication({
        ...medication,
        isComplete,
      });
      toast.success(
        `Medication marked as ${isComplete ? "complete" : "incomplete"}`
      );
    }
  };

  const handleToggleAppointmentComplete = (id: string, isComplete: boolean) => {
    const appointment = appointments.find((a) => a.id === id);
    if (appointment) {
      onUpdateAppointment({
        ...appointment,
        isComplete,
      });
      toast.success(
        `Appointment marked as ${isComplete ? "complete" : "incomplete"}`
      );
    }
  };

  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-4">
        <Card className=" max-sm:gap-2 max-sm:py-2">
          <CardHeader className="px-4 py-0 sm:px-6 max-sm:py-0">
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2 sm:px-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Syringe className="h-4 w-4 text-muted-foreground" />
                  <span>Vaccinations</span>
                </div>
                <span className="font-medium">{thisWeekVaccinations}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-muted-foreground" />
                  <span>Medications</span>
                </div>
                <span className="font-medium">{thisWeekMedications}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Appointments</span>
                </div>
                <span className="font-medium">{thisWeekAppointments}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="max-sm:gap-2 max-sm:py-2">
          <CardHeader className="px-4 py-0 sm:px-6 max-sm:py-0">
            <CardTitle className="text-lg">Next Week</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2 sm:px-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Syringe className="h-4 w-4 text-muted-foreground" />
                  <span>Vaccinations</span>
                </div>
                <span className="font-medium">{nextWeekVaccinations}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-muted-foreground" />
                  <span>Medications</span>
                </div>
                <span className="font-medium">{nextWeekMedications}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Appointments</span>
                </div>
                <span className="font-medium">{nextWeekAppointments}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="max-sm:py-4 max-sm:gap-2">
        <CardHeader className="px-4 py-3 sm:px-6 max-sm:py-0">
          <CardTitle>Upcoming Health Events</CardTitle>
          <CardDescription>
            The next scheduled items for your pet
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-2 sm:px-6 sm:py-3">
          <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {upcomingEvents.map((event) => {
              switch (event.type) {
                case "vaccination":
                  return (
                    <MedicalCard
                      key={event.data.id}
                      id={event.data.id}
                      header="Next Vaccination"
                      title={event.data.title}
                      medicationName={event.data.medicationName}
                      dateToAdminister={event.data.dateToAdminister}
                      isComplete={event.data.isComplete}
                      icon={
                        <Syringe className="h-3.5 w-3.5 text-muted-foreground" />
                      }
                      onEdit={handleEditVaccination}
                      onToggleComplete={handleToggleVaccinationComplete}
                    />
                  );
                case "medication":
                  return (
                    <MedicalCard
                      key={event.data.id}
                      id={event.data.id}
                      header="Next Medication"
                      title={event.data.title}
                      medicationName={event.data.medicationName}
                      dateToAdminister={event.data.dateToAdminister}
                      isComplete={event.data.isComplete}
                      icon={
                        <Pill className="h-3.5 w-3.5 text-muted-foreground" />
                      }
                      onEdit={handleEditMedication}
                      onToggleComplete={handleToggleMedicationComplete}
                    />
                  );
                case "appointment":
                  return (
                    <MedicalCard
                      key={event.data.id}
                      id={event.data.id}
                      header="Next Appointment"
                      title={event.data.title}
                      medicationName={event.data.doctorName}
                      dateToAdminister={event.data.dateToAdminister}
                      isComplete={event.data.isComplete}
                      icon={
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      }
                      onEdit={handleEditAppointment}
                      onToggleComplete={handleToggleAppointmentComplete}
                    />
                  );
              }
            })}

            {upcomingEvents.length === 0 && (
              <div className="col-span-full text-center py-4 sm:py-6">
                <p className="text-muted-foreground">
                  No upcoming health events. Add some using the tabs below.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modals */}
      {editingVaccination && (
        <AddEditVaccinationModal
          open={!!editingVaccination}
          onOpenChange={() => setEditingVaccination(null)}
          onSave={(updatedVaccination) => {
            onUpdateVaccination(updatedVaccination);
            setEditingVaccination(null);
          }}
          vaccination={editingVaccination}
        />
      )}

      {editingMedication && (
        <AddEditMedicationModal
          open={!!editingMedication}
          onOpenChange={() => setEditingMedication(null)}
          onSave={(updatedMedication) => {
            onUpdateMedication(updatedMedication);
            setEditingMedication(null);
          }}
          medication={editingMedication}
        />
      )}

      {editingAppointment && (
        <AddEditAppointmentModal
          open={!!editingAppointment}
          onOpenChange={() => setEditingAppointment(null)}
          onSave={(updatedAppointment) => {
            onUpdateAppointment(updatedAppointment);
            setEditingAppointment(null);
          }}
          appointment={editingAppointment}
        />
      )}
    </>
  );
}
