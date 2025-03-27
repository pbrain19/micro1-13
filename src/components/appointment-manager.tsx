"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentSchedule } from "@/lib/types";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddEditAppointmentModal from "@/components/modals/add-edit-appointment-modal";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import MedicalCard from "@/components/medical-card";

interface AppointmentManagerProps {
  appointments: AppointmentSchedule[];
  onAdd: (appointment: AppointmentSchedule) => void;
  onUpdate: (appointment: AppointmentSchedule) => void;
  onDelete: (id: string) => void;
}

export default function AppointmentManager({
  appointments,
  onAdd,
  onUpdate,
  onDelete,
}: AppointmentManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] =
    useState<AppointmentSchedule | null>(null);

  const handleAdd = (appointment: AppointmentSchedule) => {
    onAdd({
      ...appointment,
      id: crypto.randomUUID(),
    });
    setIsAddModalOpen(false);
    toast.success("Appointment added successfully");
  };

  const handleEdit = (id: string) => {
    const appointment = appointments.find((a) => a.id === id);
    if (appointment) {
      setCurrentAppointment(appointment);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdate = (appointment: AppointmentSchedule) => {
    onUpdate(appointment);
    setIsEditModalOpen(false);
    toast.success("Appointment updated successfully");
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setIsDeleteModalOpen(false);
    toast.success("Appointment deleted successfully");
  };

  const handleToggleComplete = (id: string, isComplete: boolean) => {
    const appointment = appointments.find((a) => a.id === id);
    if (appointment) {
      onUpdate({
        ...appointment,
        isComplete,
      });
      toast.success(
        `Appointment marked as ${isComplete ? "complete" : "incomplete"}`
      );
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent edit modal from opening
    const appointment = appointments.find((a) => a.id === id);
    if (appointment) {
      setCurrentAppointment(appointment);
      setIsDeleteModalOpen(true);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row max-sm:flex-col items-center justify-between max-sm:p-4">
        <CardTitle className="max-sm:mb-4">Appointment Schedule</CardTitle>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="max-sm:w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Appointment
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No appointments scheduled. Add one to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments
              .sort(
                (a, b) =>
                  a.dateToAdminister.getTime() - b.dateToAdminister.getTime()
              )
              .map((appointment) => (
                <div key={appointment.id} className="relative">
                  <MedicalCard
                    id={appointment.id}
                    header="Appointment"
                    title={appointment.title}
                    medicationName={`With ${appointment.doctorName}`}
                    dateToAdminister={appointment.dateToAdminister}
                    isComplete={appointment.isComplete}
                    icon={<Calendar className="h-3.5 w-3.5" />}
                    onEdit={handleEdit}
                    onToggleComplete={handleToggleComplete}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2.5 right-12 z-10"
                    onClick={(e) => handleDeleteClick(appointment.id, e)}
                    aria-label="Delete appointment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        )}
      </CardContent>

      {/* Add Modal */}
      <AddEditAppointmentModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAdd}
      />

      {/* Edit Modal */}
      {currentAppointment && (
        <AddEditAppointmentModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSave={handleUpdate}
          appointment={currentAppointment}
        />
      )}

      {/* Delete Confirmation Modal */}
      {currentAppointment && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={() => handleDelete(currentAppointment.id)}
          title="Delete Appointment"
          description="Are you sure you want to delete this appointment? This action cannot be undone."
        />
      )}
    </Card>
  );
}
