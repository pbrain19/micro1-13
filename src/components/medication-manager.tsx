"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MedicationSchedule } from "@/lib/types";
import { Plus, Pill, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddEditMedicationModal from "@/components/modals/add-edit-medication-modal";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import MedicalCard from "@/components/medical-card";

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

  const handleEdit = (id: string) => {
    const medication = medications.find((m) => m.id === id);
    if (medication) {
      setCurrentMedication(medication);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdate = (medication: MedicationSchedule) => {
    onUpdate(medication);
    setIsEditModalOpen(false);
    toast.success("Medication updated successfully");
  };

  const handleDelete = (id: string) => {
    // Find the medication's index before removing it
    const medicationIndex = medications.findIndex((m) => m.id === id);
    const medicationToDelete = medications[medicationIndex];

    // Delete the medication
    onDelete(id);
    setIsDeleteModalOpen(false);

    // Show toast with undo button
    toast.success("Medication deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          // Use onUpdate instead of onAdd to restore with same ID
          onUpdate(medicationToDelete);
          toast.success("Medication restored");
        },
      },
    });
  };

  const handleToggleComplete = (id: string, isComplete: boolean) => {
    const medication = medications.find((m) => m.id === id);
    if (medication) {
      onUpdate({
        ...medication,
        isComplete,
      });
      toast.success(
        `Medication marked as ${isComplete ? "complete" : "incomplete"}`
      );
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent edit modal from opening
    const medication = medications.find((m) => m.id === id);
    if (medication) {
      setCurrentMedication(medication);
      setIsDeleteModalOpen(true);
    }
  };

  return (
    <Card className="max-sm:gap-2 max-sm:py-4">
      <CardHeader className="flex flex-row max-sm:flex-col items-center justify-between max-sm:p-4  max-sm:pt-0">
        <CardTitle className="max-sm:mb-4">Medication Schedule</CardTitle>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="max-sm:w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </CardHeader>
      <CardContent className="max-sm:px-4">
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
                <div key={medication.id} className="relative">
                  <MedicalCard
                    id={medication.id}
                    header="Medication"
                    title={medication.title}
                    medicationName={medication.medicationName}
                    dateToAdminister={medication.dateToAdminister}
                    isComplete={medication.isComplete}
                    icon={<Pill className="h-3.5 w-3.5" />}
                    onEdit={handleEdit}
                    onToggleComplete={handleToggleComplete}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2.5 right-2 z-10"
                    onClick={(e) => handleDeleteClick(medication.id, e)}
                    aria-label="Delete medication"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
