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
import { useState } from "react";
import AddEditVaccinationModal from "./modals/add-edit-vaccination-modal";
import AddEditMedicationModal from "./modals/add-edit-medication-modal";
import AddEditAppointmentModal from "./modals/add-edit-appointment-modal";
import { toast } from "sonner";

interface DashboardProps {
  vaccinations: VaccinationSchedule[];
  medications: MedicationSchedule[];
  appointments: AppointmentSchedule[];
  onUpdateVaccination: (vaccination: VaccinationSchedule) => void;
  onUpdateMedication: (medication: MedicationSchedule) => void;
  onUpdateAppointment: (appointment: AppointmentSchedule) => void;
}

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
      <Card className="max-sm:py-4 max-sm:gap-2">
        <CardHeader className="px-4 py-3 sm:px-6 max-sm:py-0">
          <CardTitle>Upcoming Health Events</CardTitle>
          <CardDescription>
            The next scheduled items for your pet
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-2 sm:px-6 sm:py-3">
          <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {nextVaccination && (
              <MedicalCard
                id={nextVaccination.id}
                header="Next Vaccination"
                title={nextVaccination.title}
                medicationName={nextVaccination.medicationName}
                dateToAdminister={nextVaccination.dateToAdminister}
                isComplete={nextVaccination.isComplete}
                icon={<Syringe className="h-3.5 w-3.5 text-muted-foreground" />}
                onEdit={handleEditVaccination}
                onToggleComplete={handleToggleVaccinationComplete}
              />
            )}

            {nextMedication && (
              <MedicalCard
                id={nextMedication.id}
                header="Next Medication"
                title={nextMedication.title}
                medicationName={nextMedication.medicationName}
                dateToAdminister={nextMedication.dateToAdminister}
                isComplete={nextMedication.isComplete}
                icon={<Pill className="h-3.5 w-3.5 text-muted-foreground" />}
                onEdit={handleEditMedication}
                onToggleComplete={handleToggleMedicationComplete}
              />
            )}

            {nextAppointment && (
              <MedicalCard
                id={nextAppointment.id}
                header="Next Appointment"
                title={nextAppointment.title}
                medicationName={nextAppointment.doctorName}
                dateToAdminister={nextAppointment.dateToAdminister}
                isComplete={nextAppointment.isComplete}
                icon={<User className="h-3.5 w-3.5 text-muted-foreground" />}
                onEdit={handleEditAppointment}
                onToggleComplete={handleToggleAppointmentComplete}
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
