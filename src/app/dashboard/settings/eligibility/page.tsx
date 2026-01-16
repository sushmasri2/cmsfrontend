"use client";
import type { Eligibility,CreateEligibilityPayload } from "@/types/eligibility";
import { getEligibilities,createEligibilities,updateEligibility,deleteEligibility } from "@/lib/eligibility-api";
import { useEffect } from "react";
import React from "react";
import Table from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { showToast } from '@/lib/toast';
import { useApiCache } from "@/hooks/use-api-cache";
import { setGlobalCacheInstance } from "@/lib/cache-utils";

export default function Eligibility() {
    // Set up cache instance for automatic cache invalidation
    const cacheInstance = useApiCache();
    setGlobalCacheInstance(cacheInstance);

    const [eligibilities, setEligibilities] = React.useState<Eligibility[]>([]);
    const [showForm, setShowForm] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [editingUUID, seteditingUUID] = React.useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [eligibilityToDelete, setEligibilityToDelete] = React.useState<Eligibility | null>(null);
    const [formData, setFormData] = React.useState({
        name: "",
        position: "",
        status: "1"
    });

    useEffect(() => {
        const fetchEligibility = async () => {
            const data: Eligibility[] = await getEligibilities();
            setEligibilities(data);
        };

        fetchEligibility();
    }, []);

    const handleAddEligibility = () => {
        setFormData({
            name: "",
            position: "",
            status: "1"
        });
        setIsEditing(false);
        setShowForm(!showForm);
    };

    const handleEditEligibility = (eligibility: Eligibility) => {
        setFormData({
            name: eligibility.name,
            position: eligibility.position !== undefined && eligibility.position !== null ? String(eligibility.position) : "",
            // status in API may be number or boolean - normalize to "1" or "0"
            status: eligibility.status === undefined ? "1" : (Number(eligibility.status) === 1 || eligibility.status === true) ? "1" : "0"
        });
        seteditingUUID(eligibility.uuid);
        setIsEditing(true);
        setShowForm(true);
        setError(null);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCancel = () => {
        setShowForm(false);
        setIsEditing(false);
        seteditingUUID(null);
        setError(null);
        setFormData({
            name: "",
            position: "",
            status: "1"
        });
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError("Eligibility name is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const eligibilityData: CreateEligibilityPayload = {
                name: formData.name.trim(),
                position: formData.position ? parseInt(formData.position) : 0,
                status: formData.status === "1"
            };

            if (isEditing && editingUUID) {
                eligibilityData.uuid = editingUUID;
                await updateEligibility(editingUUID, eligibilityData);
                showToast('Eligibility updated successfully', 'success');
            } else {
                await createEligibilities(eligibilityData);
                showToast('Eligibility created successfully', 'success');
            }

            // Refresh the eligibility list
            const updatedEligibilities = await getEligibilities();
            setEligibilities(updatedEligibilities);

            // Reset form and close it
            handleCancel();

        } catch (error) {
            console.error('Error saving eligibility:', error);
            setError(error instanceof Error ? error.message : 'An error occurred while saving');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (eligibility: Eligibility) => {
        setEligibilityToDelete(eligibility);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!eligibilityToDelete) return;

        setLoading(true);
        setError(null);

        try {
            await deleteEligibility((eligibilityToDelete.uuid));

            // Refresh the eligibility list
            const updatedEligibilities = await getEligibilities();
            setEligibilities(updatedEligibilities);

            showToast('Eligibility deleted successfully', 'success');

        } catch (error) {
            console.error('Error deleting eligibility:', error);
            setError(error instanceof Error ? error.message : 'An error occurred while deleting');
            showToast('Failed to delete eligibility', 'error');
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setEligibilityToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setEligibilityToDelete(null);
    };

    return <>
        <div className="flex justify-end gap-3 mb-3">
            <Button variant="primaryBtn" onClick={handleAddEligibility}>
                {showForm ? 'Cancel' : 'Add Eligibility'}
            </Button>
        </div>
        {showForm && (
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <p className="font-semibold mb-2 text-lg">
                    {isEditing ? 'Edit Eligibility' : 'Create Eligibility'}
                </p>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label>Eligibility Name</label>
                        <Input
                            type="text"
                            placeholder="Eligibility Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Position</label>
                        <Input
                            type="number"
                            placeholder="Position"
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="font-semibold mb-2">Status</label>
                        <div className="flex gap-2">
                            <label className="flex items-center cursor-pointer">
                                <Input
                                    type="radio"
                                    name="status"
                                    value="1"
                                    checked={formData.status === "1"}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="mr-2 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <Input
                                    type="radio"
                                    name="status"
                                    value="0"
                                    checked={formData.status === "0"}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="mr-2 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Inactive</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="primaryBtn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update' : 'Create')}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </div>
        )}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            {eligibilities.length > 0 ? (
                <Table
                    columns={[
                        {
                            header: "S.No",
                            accessor: "index",
                            render: (value: unknown, row: Record<string, unknown>, index: number) => (
                                <>{index + 1}</>
                            ),
                        },
                        {
                            header: "Eligibility Name",
                            accessor: "name",
                            render: (value: unknown) => <>{value as string}</>,
                        },
                        {
                            header: "Position",
                            accessor: "position",
                            render: (value: unknown) => String(value ?? ''),
                        },
                        {
                            header: "Status",
                            accessor: "status",
                            render: (value: unknown) => {
                                const v = value as number | boolean | undefined;
                                if (v === undefined || v === null) return 'Inactive';
                                if (typeof v === 'boolean') return v ? 'Active' : 'Inactive';
                                return Number(v) === 1 ? 'Active' : 'Inactive';
                            },
                        },
                        {
                            header: "Actions",
                            accessor: "actions",
                            render: (value: unknown, row: Record<string, unknown>) => (
                                <div className="flex gap-2">
                                    <Button
                                        variant='outline'
                                        onClick={() => handleEditEligibility(row as unknown as Eligibility)}
                                        disabled={loading}
                                    >
                                        <Edit />
                                    </Button>
                                    <Button
                                        variant='outline'
                                        onClick={() => handleDeleteClick(row as unknown as Eligibility)}
                                        disabled={loading}
                                    >
                                        <Trash2 color="red" />
                                    </Button>
                                </div>
                            )
                        }
                    ]}
                    data={eligibilities as unknown as Record<string, unknown>[]}
                    className="min-w-full divide-y divide-gray-200 "
                    responsive
                />
            ) : (
                <p>No eligibilities available.</p>
            )}
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
            type="confirmation"
            variant="delete"
            open={showDeleteModal}
            onOpenChange={setShowDeleteModal}
            title="Delete Eligibility"
            message={`Are you sure you want to delete "${eligibilityToDelete?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            loading={loading}
        />
    </>
}