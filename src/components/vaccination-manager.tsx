"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VaccinationSchedule } from "@/lib/types";
import { Plus, Syringe, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddEditVaccinationModal from "@/components/modals/add-edit-vaccination-modal";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import MedicalCard from "@/components/medical-card";

interface VaccinationManagerProps {
  vaccinations: VaccinationSchedule[];
  onAdd: (vaccination: VaccinationSchedule) => void;
  onUpdate: (vaccination: VaccinationSchedule) => void;
  onDelete: (id: string) => void;
}

export default function VaccinationManager({
  vaccinations,
  onAdd,
  onUpdate,
  onDelete,
}: VaccinationManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentVaccination, setCurrentVaccination] =
    useState<VaccinationSchedule | null>(null);

  const handleAdd = (vaccination: VaccinationSchedule) => {
    onAdd({
      ...vaccination,
      id: crypto.randomUUID(),
    });
    setIsAddModalOpen(false);
    toast.success("Vaccination added successfully");
  };

  const handleEdit = (id: string) => {
    const vaccination = vaccinations.find((v) => v.id === id);
    if (vaccination) {
      setCurrentVaccination(vaccination);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdate = (vaccination: VaccinationSchedule) => {
    onUpdate(vaccination);
    setIsEditModalOpen(false);
    toast.success("Vaccination updated successfully");
  };

  const handleDelete = (id: string) => {
    // Find the vaccination's index before removing it
    const vaccinationIndex = vaccinations.findIndex((v) => v.id === id);
    const vaccinationToDelete = vaccinations[vaccinationIndex];

    // Delete the vaccination
    onDelete(id);
    setIsDeleteModalOpen(false);

    // Show toast with undo button
    toast.success("Vaccination deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          // Use onUpdate instead of onAdd to restore with same ID
          onUpdate(vaccinationToDelete);
          toast.success("Vaccination restored");
        },
      },
    });
  };

  const handleToggleComplete = (id: string, isComplete: boolean) => {
    const vaccination = vaccinations.find((v) => v.id === id);
    if (vaccination) {
      onUpdate({
        ...vaccination,
        isComplete,
      });
      toast.success(
        `Vaccination marked as ${isComplete ? "complete" : "incomplete"}`
      );
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent edit modal from opening
    const vaccination = vaccinations.find((v) => v.id === id);
    if (vaccination) {
      setCurrentVaccination(vaccination);
      setIsDeleteModalOpen(true);
    }
  };

  return (
    <Card className="max-sm:gap-2">
      <CardHeader className="flex flex-row max-sm:flex-col items-center justify-between max-sm:p-4">
        <CardTitle className="max-sm:mb-4">Vaccination Schedule</CardTitle>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="max-sm:w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vaccination
        </Button>
      </CardHeader>
      <CardContent className="max-sm:px-4">
        {vaccinations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No vaccinations scheduled. Add one to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {vaccinations
              .sort(
                (a, b) =>
                  a.dateToAdminister.getTime() - b.dateToAdminister.getTime()
              )
              .map((vaccination) => (
                <div key={vaccination.id} className="relative">
                  <MedicalCard
                    id={vaccination.id}
                    header="Vaccination"
                    title={vaccination.title}
                    medicationName={vaccination.medicationName}
                    dateToAdminister={vaccination.dateToAdminister}
                    isComplete={vaccination.isComplete}
                    icon={<Syringe className="h-3.5 w-3.5" />}
                    onEdit={handleEdit}
                    onToggleComplete={handleToggleComplete}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2.5 right-2 z-10"
                    onClick={(e) => handleDeleteClick(vaccination.id, e)}
                    aria-label="Delete vaccination"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        )}
      </CardContent>

      {/* Add Modal */}
      <AddEditVaccinationModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAdd}
      />

      {/* Edit Modal */}
      {currentVaccination && (
        <AddEditVaccinationModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSave={handleUpdate}
          vaccination={currentVaccination}
        />
      )}

      {/* Delete Confirmation Modal */}
      {currentVaccination && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={() => handleDelete(currentVaccination.id)}
          title="Delete Vaccination"
          description="Are you sure you want to delete this vaccination? This action cannot be undone."
        />
      )}
    </Card>
  );
}
