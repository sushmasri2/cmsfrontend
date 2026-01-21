'use client';

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "../shared/ValidatedInput";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";
import { getCoursesPatrons, createPatron, updatePatron, deletePatron } from "@/lib/coursepatrons-api";
import {CoursePatron} from "@/types/coursepatrons";
import { showToast } from "@/lib/toast";
import { Edit, Plus, Trash2 } from "lucide-react";
import Table from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";

interface CoursePatronsProps {
  courseData: Course;
}

export default function CoursePatrons({ courseData }: CoursePatronsProps) {
  const [patrons, setPatrons] = useState<CoursePatron[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatron, setEditingPatron] = useState<CoursePatron | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPatron, setDeletingPatron] = useState<CoursePatron | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    image: ''
  });

  const { validateTab, getFieldError, clearErrors } = useUnifiedValidation();

  useEffect(() => {
    if (courseData?.uuid) {
      getCoursesPatrons(courseData.uuid).then(response => {
        if (response?.status === 'success' && response.data?.patrons) {
          setPatrons(response.data.patrons);
        }
      });
    }
  }, [courseData?.uuid]);

  const handleAddNew = () => {
    setEditingPatron(null);
    setFormData({ name: '', designation: '', image: '' });
    setShowForm(true);
    clearErrors();
  };

  const handleEdit = (patron: CoursePatron) => {
    setEditingPatron(patron);
    setFormData({
      name: patron.name,
      designation: patron.designation,
      image: patron.image
    });
    setShowForm(true);
    clearErrors();
  };

  const handleSave = async () => {
    const validation = validateTab.validatePatron(formData);
    
    if (!validation.isValid) {
      showToast('Please fix validation errors', 'error');
      return;
    }

    try {
      if (editingPatron) {
        const response = await updatePatron(editingPatron.uuid, formData);
        if (response.status === 'success') {
          setPatrons(prev => prev.map(p =>
            p.uuid === editingPatron.uuid ? { ...p, ...formData } : p
          ));
          showToast('Patron updated successfully', 'success');
        }
      } else {
        const response = await createPatron({
          ...formData,
          course_uuid: courseData.uuid
        });
        if (response.status === 'success' && response.data) {
          setPatrons(prev => [...prev, response.data!]);
          showToast('Patron created successfully', 'success');
        }
      }
      setShowForm(false);
      clearErrors();
    } catch (error) {
      console.error('Error saving patron:', error);
      showToast('Failed to save patron', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deletingPatron) return;

    try {
      const response = await deletePatron(deletingPatron.uuid);
      if (response.status === 'success') {
        setPatrons(prev => prev.filter(p => p.uuid !== deletingPatron.uuid));
        showToast('Patron deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting patron:', error);
      showToast('Failed to delete patron', 'error');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingPatron(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Patrons</h3>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Patron
        </Button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-md font-semibold mb-4">
            {editingPatron ? 'Edit Patron' : 'Add New Patron'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ValidatedInput
              label="Patron Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={getFieldError('name')}
              placeholder="Enter patron name"
            />
            <ValidatedInput
              label="Designation"
              value={formData.designation}
              onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
              error={getFieldError('designation')}
              placeholder="Enter designation"
            />
            <ValidatedInput
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              error={getFieldError('image')}
              placeholder="Enter image URL"
            />
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button onClick={() => setShowForm(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingPatron ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      )}

      {patrons.length > 0 ? (
        <Table
          columns={[
            { header: "S.No", accessor: "index", render: (_, __, idx) => idx + 1 },
            { header: "Image", accessor: "image", render: (val) => <span className="text-sm text-gray-500 break-all">{val as string}</span> },
            { header: "Name", accessor: "name" },
            { header: "Designation", accessor: "designation" },
            {
              header: "Actions",
              accessor: "actions",
              render: (_, row) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setDeletingPatron(row);
                    setIsDeleteModalOpen(true);
                  }}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              )
            }
          ]}
          data={patrons}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No patrons available.</p>
        </div>
      )}

      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        type="confirmation"
        variant="delete"
        title="Delete Patron"
        message={`Are you sure you want to delete ${deletingPatron?.name}?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        destructive={true}
      />
    </div>
  );
}
