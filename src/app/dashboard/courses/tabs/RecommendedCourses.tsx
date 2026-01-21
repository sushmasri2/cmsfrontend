'use client';

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { RecommendedCourse } from "@/types/recommendedcourses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select2 from "@/components/ui/Select2";
import Table from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Edit, Trash2 } from "lucide-react";
import { 
  getRecommendedCourse, 
  updateRecommendedCourse, 
  addRecommendedCourse, 
  deleteRecommendedCourse 
} from "@/lib/recommendedcourse-api";
import { getCourses } from "@/lib/courses-api";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";
import { showToast } from "@/lib/toast";

interface CourseRecommendationsProps {
  courseData: Course;
}

export default function CourseRecommendations({ courseData }: CourseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    recommended_course_uuid: "",
    position: 0,
    status: 1,
    must_have: 0
  });

  const { validateTab, clearErrors } = useUnifiedValidation();

  useEffect(() => {
    const fetchData = async () => {
      const courses = await getCourses();
      setAvailableCourses(courses);

      if (courseData?.uuid) {
        const recs = await getRecommendedCourse(courseData.uuid);
        setRecommendations(recs);
      }
    };
    fetchData();
  }, [courseData?.uuid]);

  const handleAdd = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({
      recommended_course_uuid: "",
      position: 0,
      status: 1,
      must_have: 0
    });
  };

  const handleEdit = (row: RecommendedCourse) => {
    setShowForm(true);
    setEditingId(row.id);
    setFormData({
      recommended_course_uuid: row.recommendedCourse?.uuid || "",
      position: row.position,
      status: row.status,
      must_have: row.must_have
    });
  };

  const handleSave = async () => {
    const validation = validateTab.validateRecommendation(formData);
    
    if (!validation.isValid) {
      showToast('Please select a course and enter position', 'error');
      return;
    }

    const payload = {
      course_uuid: courseData?.uuid || "",
      recommended_course_uuid: formData.recommended_course_uuid,
      position: formData.position,
      status: formData.status,
      must_have: formData.must_have
    };

    try {
      if (editingId) {
        const editingRec = recommendations.find(r => r.id === editingId);
        if (editingRec?.uuid) {
          await updateRecommendedCourse(payload, editingRec.uuid);
          const updated = await getRecommendedCourse(courseData.uuid);
          setRecommendations(updated);
          showToast('Recommendation updated successfully', 'success');
        }
      } else {
        await addRecommendedCourse(payload);
        const updated = await getRecommendedCourse(courseData.uuid);
        setRecommendations(updated);
        showToast('Recommendation added successfully', 'success');
      }
      setShowForm(false);
      clearErrors();
    } catch (error) {
      showToast('Failed to save recommendation', 'error');
      console.error(error);
    }
  };

  const confirmDelete = async () => {
    if (!deletingUuid) return;

    try {
      await deleteRecommendedCourse(deletingUuid);
      setRecommendations(recs => recs.filter(r => r.uuid !== deletingUuid));
      showToast('Recommendation deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setDeletingUuid(null);
    } catch (error) {
      showToast('Failed to delete recommendation', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>Add Recommended Course</Button>
      </div>

      {showForm && (
        <div className="border p-4 rounded-lg mb-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">
            {editingId ? "Edit Recommended Course" : "Add Recommended Course"}
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label>Select Course</label>
              <Select2
                options={availableCourses.map(c => ({
                  label: c.course_name,
                  value: c.uuid
                }))}
                value={formData.recommended_course_uuid}
                onChange={(value) => setFormData(prev => ({ ...prev, recommended_course_uuid: value as string }))}
              />
            </div>
            <div>
              <label>Position</label>
              <Input
                type="number"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label>Status</label>
              <Select2
                options={[
                  { value: "1", label: "Active" },
                  { value: "0", label: "Inactive" }
                ]}
                value={formData.status.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, status: parseInt(value as string) }))}
              />
            </div>
            <div>
              <label>Must Have</label>
              <input
                type="checkbox"
                checked={formData.must_have === 1}
                onChange={(e) => setFormData(prev => ({ ...prev, must_have: e.target.checked ? 1 : 0 }))}
                className="mt-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? "Update" : "Save"}</Button>
          </div>
        </div>
      )}

      {recommendations.length > 0 ? (
        <Table
          columns={[
            { header: "S.No", accessor: "index", render: (_,__,idx) => idx + 1 },
            { header: "Course Name", accessor: "course_name", render: (_,row) => row.recommendedCourse?.course_name },
            { header: "Position", accessor: "position" },
            { header: "Must Have", accessor: "must_have", render: (val) => val ? "Yes" : "No" },
            { header: "Status", accessor: "status", render: (val) => val ? "Active" : "Inactive" },
            {
              header: "Actions",
              accessor: "actions",
              render: (_,row) => (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(row)}><Edit /></Button>
                  <Button variant="outline" onClick={() => {
                    setDeletingUuid(row.uuid);
                    setIsDeleteModalOpen(true);
                  }}><Trash2 className="text-red-600" /></Button>
                </div>
              )
            }
          ]}
          data={recommendations}
        />
      ) : (
        <p>No recommended courses available.</p>
      )}

      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        type="confirmation"
        variant="delete"
        title="Delete Recommendation"
        message="Are you sure you want to delete this recommendation?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        destructive={true}
      />
    </div>
  );
}
