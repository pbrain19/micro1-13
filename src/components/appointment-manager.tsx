"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { AppointmentSchedule } from "@/lib/types";
import { Calendar, Edit, Plus, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import AddEditAppointmentModal from "@/components/modals/add-edit-appointment-modal";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";

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

  const handleEdit = (appointment: AppointmentSchedule) => {
    setCurrentAppointment(appointment);
    setIsEditModalOpen(true);
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

  const handleToggleComplete = (appointment: AppointmentSchedule) => {
    onUpdate({
      ...appointment,
      isComplete: !appointment.isComplete,
    });
    toast.success(
      `Appointment marked as ${
        appointment.isComplete ? "incomplete" : "complete"
      }`
    );
  };
  console.log("here");
  return (
    <Card>
      <CardHeader className="flex flex-row max-sm:flex-col items-center justify-between">
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
                <div
                  key={appointment.id}
                  className={`flex items-start justify-between p-4 border rounded-lg ${
                    appointment.isComplete ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={appointment.isComplete}
                      onCheckedChange={() => handleToggleComplete(appointment)}
                      className="mt-1"
                    />
                    <div>
                      <h3
                        className={`font-medium ${
                          appointment.isComplete
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {appointment.title}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-3 w-3" />
                        {appointment.doctorName}
                      </div>
                      <p className="text-sm mt-1">{appointment.details}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(appointment.dateToAdminister)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(appointment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentAppointment(appointment);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
