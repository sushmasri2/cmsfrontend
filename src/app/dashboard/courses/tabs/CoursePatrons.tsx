"use client";
import { CoursePatron } from "@/types/coursepatrons";
import { getCoursesPatrons, createPatron, updatePatron, deletePatron } from "@/lib/coursepatrons-api";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus } from "lucide-react";
import { ValidatedInput } from "../shared/ValidatedInput";
import { usePatronValidation } from "../hooks/usePatronValidation";
import { showToast } from "@/lib/toast";
import { Modal } from "@/components/ui/modal";

interface CoursePatronsProps {
    courseData?: Course | null;
}

interface PatronFormData {
    name: string;
    designation: string;
    image: string;
}

export default function Patrons({ courseData }: CoursePatronsProps) {
    const [patrons, setPatrons] = useState<CoursePatron[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingPatron, setEditingPatron] = useState<CoursePatron | null>(null);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [formData, setFormData] = useState<PatronFormData>({
        name: '',
        designation: '',
        image: ''
    });
    const [submitting, setSubmitting] = useState<boolean>(false);
    
    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [patronToDelete, setPatronToDelete] = useState<CoursePatron | null>(null);

    // Validation hook
    const [, validationActions] = usePatronValidation();

    useEffect(() => {
        async function fetchPatrons() {
            if (courseData && courseData.uuid) {
                try {
                    const response = await getCoursesPatrons(courseData.uuid);
                    if (response && response.status === 'success' && response.data?.patrons) {
                        setPatrons(response.data.patrons);
                    } else {
                        setPatrons([]);
                    }
                } catch (error) {
                    console.error("Error fetching patrons:", error);
                    showToast("Failed to fetch patrons", "error");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
        fetchPatrons();
    }, [courseData]);

    const handlePatronChange = (field: keyof PatronFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        validationActions.validatePatronField(field, value);
    };

    const handleSubmit = async () => {
        
        // Check validation
        const isValid = validationActions.validateAllPatron(formData as Partial<CoursePatron>);

        if (!isValid) {
            showToast("Please fix validation errors", "error");
            return;
        }

        if (!courseData?.uuid) {
            showToast("Course UUID is required", "error");
            return;
        }
        setSubmitting(true);
        
        try {
            if (editingPatron) {
                const response = await updatePatron(editingPatron.uuid, formData);
                
                if (response.status === 'success') {
                    setPatrons(prev => prev.map(p =>
                        p.uuid === editingPatron.uuid
                            ? { ...p, ...formData }
                            : p
                    ));
                    showToast("Patron updated successfully", "success");
                    handleCancel();
                }
            } else {
                
                const response = await createPatron({
                    ...formData,
                    course_uuid: courseData.uuid
                });
                
                if (response.status === 'success' && response.data) {
                    setPatrons(prev => [...prev, response.data!]);
                    showToast("Patron created successfully", "success");
                    handleCancel();
                }
            }
        } catch (error) {
            console.error('Error saving patron:', error);
            showToast("Failed to save patron", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', designation: '', image: '' });
        setEditingPatron(null);
        setShowAddForm(false);
        validationActions.clearPatronErrors();
    };

    const handleEdit = (patron: CoursePatron) => {
        setEditingPatron(patron);
        setFormData({
            name: patron.name,
            designation: patron.designation,
            image: patron.image
        });
        setShowAddForm(true);
        validationActions.clearPatronErrors();
    };

    // FIXED: Open modal instead of direct deletion
    const handleDelete = (patron: CoursePatron) => {
        setPatronToDelete(patron);
        setIsDeleteModalOpen(true);
    };

    // FIXED: Actual deletion with correct UUID
    const confirmDelete = async () => {
        if (!patronToDelete) return;
        
        try {
            const response = await deletePatron(patronToDelete.uuid);
            if (response.status === 'success') {
                setPatrons(prev => prev.filter(p => p.uuid !== patronToDelete.uuid));
                showToast("Patron deleted successfully", "success");
            }
        } catch (error) {
            console.error('Error deleting patron:', error);
            showToast("Failed to delete patron", "error");
        } finally {
            closeDeleteModal();
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setPatronToDelete(null);
    };

    const handleAddNew = () => {
        setEditingPatron(null);
        setFormData({ name: '', designation: '', image: '' });
        setShowAddForm(true);
        validationActions.clearPatronErrors();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Course Patrons</h3>
                <Button onClick={handleAddNew} variant="primaryBtn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Patron
                </Button>
            </div>

            {showAddForm && (
                <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="text-md font-semibold mb-4">
                        {editingPatron ? 'Edit Patron' : 'Add New Patron'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-md font-semibold text-gray-600">Patron Name</label>
                            <ValidatedInput
                                type="text"
                                placeholder="Enter patron name"
                                value={formData.name}
                                onChange={(e) => handlePatronChange('name', e.target.value)}
                                error={validationActions.getFieldError('name')}
                                className={validationActions.hasFieldError('name') ? 'border-red-500' : ''}
                            />
                        </div>

                        <div>
                            <label className="text-md font-semibold text-gray-600">Designation</label>
                            <ValidatedInput
                                type="text"
                                placeholder="Enter designation"
                                value={formData.designation}
                                onChange={(e) => handlePatronChange('designation', e.target.value)}
                                error={validationActions.getFieldError('designation')}
                                className={validationActions.hasFieldError('designation') ? 'border-red-500' : ''}
                            />
                        </div>

                        <div>
                            <label className="text-md font-semibold text-gray-600">Image URL</label>
                            <ValidatedInput
                                type="text"
                                placeholder="Enter image URL"
                                value={formData.image}
                                onChange={(e) => handlePatronChange('image', e.target.value)}
                                error={validationActions.getFieldError('image')}
                                className={validationActions.hasFieldError('image') ? 'border-red-500' : ''}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                        <Button onClick={handleCancel} variant="outline">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="primaryBtn"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : (editingPatron ? 'Update' : 'Create')}
                        </Button>
                    </div>
                </div>
            )}

            <Modal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                type="confirmation"
                variant="delete"
                title="Delete Patron"
                message={`Are you sure you want to delete ${patronToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                onCancel={closeDeleteModal}
                destructive={true}
            />

            {patrons.length > 0 ? (
                <Table<CoursePatron>
                    columns={[
                        {
                            header: "S.No",
                            accessor: "index",
                            render: (value: unknown, row: CoursePatron, index: number) => (
                                <>{index + 1}</>
                            ),
                        },
                        {
                            header: 'Patron Image',
                            accessor: "image",
                            render: (value: unknown, row: CoursePatron) => (
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500 break-all">
                                        {row.image as string}
                                    </span>
                                </div>
                            ),
                        },
                        {
                            header: "Patron Name",
                            accessor: "name",
                            render: (value: unknown, row: CoursePatron) => (
                                <span className="font-medium">{row.name as string}</span>
                            ),
                        },
                        {
                            header: "Designation",
                            accessor: "designation",
                            render: (value: unknown, row: CoursePatron) => (
                                <span className="text-gray-600">{row.designation as string}</span>
                            ),
                        },
                        {
                            header: "Actions",
                            accessor: "actions",
                            render: (value: unknown, row: CoursePatron) => (
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(row)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDelete(row)}
                                    >
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
                    <p className="text-gray-500">No patrons available for this course.</p>
                    <Button onClick={handleAddNew} variant="primaryBtn" className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Patron
                    </Button>
                </div>
            )}
        </div>
    );
}