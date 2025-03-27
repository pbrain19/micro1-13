"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { MedicationSchedule } from "@/lib/types";
import { Calendar, Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import AddEditMedicationModal from "@/components/modals/add-edit-medication-modal";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";

interface MedicationManagerProps {
  medications: MedicationSchedule[];
  onAdd: (medication: MedicationSchedule) => void;
  onUpdate: (medication: MedicationSchedule) => void;
  onDelete: (id: string) => void;
}

export default function MedicationManager({
  medications,
  onAdd,
  onUpdate,
  onDelete,
}: MedicationManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMedication, setCurrentMedication] =
    useState<MedicationSchedule | null>(null);

  const handleAdd = (medication: MedicationSchedule) => {
    onAdd({
      ...medication,
      id: crypto.randomUUID(),
    });
    setIsAddModalOpen(false);
    toast.success("Medication added successfully");
  };

  const handleEdit = (medication: MedicationSchedule) => {
    setCurrentMedication(medication);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (medication: MedicationSchedule) => {
    onUpdate(medication);
    setIsEditModalOpen(false);
    toast.success("Medication updated successfully");
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setIsDeleteModalOpen(false);
    toast.success("Medication deleted successfully");
  };

  const handleToggleComplete = (medication: MedicationSchedule) => {
    onUpdate({
      ...medication,
      isComplete: !medication.isComplete,
    });
    toast.success(
      `Medication marked as ${
        medication.isComplete ? "incomplete" : "complete"
      }`
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row max-sm:flex-col items-center justify-between">
        <CardTitle className="max-sm:mb-4">Medication Schedule</CardTitle>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="max-sm:w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No medications scheduled. Add one to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {medications
              .sort(
                (a, b) =>
                  a.dateToAdminister.getTime() - b.dateToAdminister.getTime()
              )
              .map((medication) => (
                <div
                  key={medication.id}
                  className={`flex items-start justify-between p-4 border rounded-lg ${
                    medication.isComplete ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={medication.isComplete}
                      onCheckedChange={() => handleToggleComplete(medication)}
                      className="mt-1"
                    />
                    <div>
                      <h3
                        className={`font-medium ${
                          medication.isComplete
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {medication.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {medication.medicationName}
                      </p>
                      <p className="text-sm mt-1">{medication.details}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(medication.dateToAdminister)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(medication)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentMedication(medication);
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
      <AddEditMedicationModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAdd}
      />

      {/* Edit Modal */}
      {currentMedication && (
        <AddEditMedicationModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSave={handleUpdate}
          medication={currentMedication}
        />
      )}

      {/* Delete Confirmation Modal */}
      {currentMedication && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={() => handleDelete(currentMedication.id)}
          title="Delete Medication"
          description="Are you sure you want to delete this medication? This action cannot be undone."
        />
      )}
    </Card>
  );
}
