"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { VaccinationSchedule } from "@/lib/types"
import { Calendar, Edit, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import AddEditVaccinationModal from "@/components/modals/add-edit-vaccination-modal"
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal"

interface VaccinationManagerProps {
  vaccinations: VaccinationSchedule[]
  onAdd: (vaccination: VaccinationSchedule) => void
  onUpdate: (vaccination: VaccinationSchedule) => void
  onDelete: (id: string) => void
}

export default function VaccinationManager({ vaccinations, onAdd, onUpdate, onDelete }: VaccinationManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentVaccination, setCurrentVaccination] = useState<VaccinationSchedule | null>(null)

  const handleAdd = (vaccination: VaccinationSchedule) => {
    onAdd({
      ...vaccination,
      id: crypto.randomUUID(),
    })
    setIsAddModalOpen(false)
    toast.success("Vaccination added successfully")
  }

  const handleEdit = (vaccination: VaccinationSchedule) => {
    setCurrentVaccination(vaccination)
    setIsEditModalOpen(true)
  }

  const handleUpdate = (vaccination: VaccinationSchedule) => {
    onUpdate(vaccination)
    setIsEditModalOpen(false)
    toast.success("Vaccination updated successfully")
  }

  const handleDelete = (id: string) => {
    onDelete(id)
    setIsDeleteModalOpen(false)
    toast.success("Vaccination deleted successfully")
  }

  const handleToggleComplete = (vaccination: VaccinationSchedule) => {
    onUpdate({
      ...vaccination,
      isComplete: !vaccination.isComplete,
    })
    toast.success(`Vaccination marked as ${vaccination.isComplete ? "incomplete" : "complete"}`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vaccination Schedule</CardTitle>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vaccination
        </Button>
      </CardHeader>
      <CardContent>
        {vaccinations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No vaccinations scheduled. Add one to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vaccinations
              .sort((a, b) => a.dateToAdminister.getTime() - b.dateToAdminister.getTime())
              .map((vaccination) => (
                <div
                  key={vaccination.id}
                  className={`flex items-start justify-between p-4 border rounded-lg ${
                    vaccination.isComplete ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={vaccination.isComplete}
                      onCheckedChange={() => handleToggleComplete(vaccination)}
                      className="mt-1"
                    />
                    <div>
                      <h3
                        className={`font-medium ${vaccination.isComplete ? "line-through text-muted-foreground" : ""}`}
                      >
                        {vaccination.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{vaccination.medicationName}</p>
                      <p className="text-sm mt-1">{vaccination.details}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(vaccination.dateToAdminister)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(vaccination)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentVaccination(vaccination)
                        setIsDeleteModalOpen(true)
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
      <AddEditVaccinationModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSave={handleAdd} />

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
  )
}

