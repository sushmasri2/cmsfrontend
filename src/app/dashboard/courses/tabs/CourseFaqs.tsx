'use client';

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { FAQs } from "@/types/faqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Select2 from "@/components/ui/Select2";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Edit, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { getCourseFAQs, createFAQ, updateFAQCourse, deleteFAQ } from "@/lib/faqs-api";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";
import { showToast } from "@/lib/toast";

interface CourseFAQsProps {
  courseData: Course;
}

export default function CourseFAQs({ courseData }: CourseFAQsProps) {
  const [faqs, setFAQs] = useState<FAQs[]>([]);
  const [faqOpenItems, setFaqOpenItems] = useState<string[]>([]);
  const [formMode, setFormMode] = useState<'none' | 'add' | 'edit'>('none');
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    status: 'active',
    position: 1
  });

  const { validateTab, getFieldError, clearErrors } = useUnifiedValidation();

  useEffect(() => {
    if (courseData?.uuid) {
      getCourseFAQs(courseData.uuid).then(response => {
        setFAQs(response.data);
      });
    }
  }, [courseData?.uuid]);

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      status: 'active',
      position: 1
    });
    setFormMode('none');
    setEditingFaqId(null);
    clearErrors();
  };

  const handleAddClick = () => {
    resetForm();
    setFormMode('add');
    setFormData(prev => ({ ...prev, position: faqs.length + 1 }));
  };

  const handleEdit = (event: React.MouseEvent, faq: FAQs) => {
    event.preventDefault();
    event.stopPropagation();

    setFormMode('edit');
    setEditingFaqId(faq.uuid);
    setFormData({
      question: faq.question,
      answer: faq.answers,
      status: faq.status === 1 ? "active" : "inactive",
      position: faq.position || 1
    });
  };

  const handleSave = async () => {
    const validation = validateTab.validateFAQ(formData);
    
    if (!validation.isValid) {
      showToast('Please fix validation errors', 'error');
      return;
    }

    const faqData = {
      course_id: courseData?.uuid || "",
      question: formData.question,
      answers: formData.answer,
      position: formData.position,
      status: formData.status === "active" ? 1 : 0
    };

    try {
      if (formMode === 'edit' && editingFaqId) {
        const response = await updateFAQCourse(
          editingFaqId,
          formData.question,
          formData.answer,
          formData.status === "active" ? 1 : 0,
          formData.position
        );
        setFAQs(faqs.map(faq =>
          faq.uuid === editingFaqId ? (Array.isArray(response.data) ? response.data[0] : response.data) : faq
        ));
        showToast('FAQ updated successfully', 'success');
      } else {
        const response = await createFAQ(faqData);
        setFAQs([...faqs, Array.isArray(response.data) ? response.data[0] : response.data]);
        showToast('FAQ created successfully', 'success');
      }
      resetForm();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      showToast('Failed to save FAQ', 'error');
    }
  };

  const handleDelete = (event: React.MouseEvent, faqUuid: string) => {
    event.preventDefault();
    event.stopPropagation();
    setDeletingFaqId(faqUuid);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingFaqId) return;

    try {
      await deleteFAQ(deletingFaqId);
      setFAQs(faqs.filter(faq => faq.uuid !== deletingFaqId));
      showToast('FAQ deleted successfully', 'success');
      setDeletingFaqId(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      showToast('Failed to delete FAQ', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-4">
        <Button variant="default" onClick={handleAddClick}>
          Add FAQ
        </Button>
      </div>

      {formMode !== 'none' && (
        <div className="border p-4 rounded-lg mb-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">
            {formMode === 'edit' ? 'Edit FAQ' : 'Add New FAQ'}
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-2">Question</label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter your question"
                className={getFieldError('question') ? 'border-red-500' : ''}
              />
              {getFieldError('question') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('question')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Answer</label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Enter your answer"
                rows={4}
                className={getFieldError('answer') ? 'border-red-500' : ''}
              />
              {getFieldError('answer') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('answer')}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Status</label>
                <Select2
                  value={formData.status}
                  onChange={(value) => setFormData(prev => ({ ...prev, status: value as string }))}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Position</label>
                <Input
                  type="number"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave}>
              {formMode === 'edit' ? 'Update FAQ' : 'Save FAQ'}
            </Button>
          </div>
        </div>
      )}

      <Accordion type="multiple" value={faqOpenItems} onValueChange={setFaqOpenItems}>
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <AccordionItem
              key={faq.uuid}
              className="border rounded-lg mt-3"
              value={`faq-${faq.uuid}`}
            >
              <AccordionTrigger arrowPosition="left" className="flex bg-gray-50 px-3">
                <h4 className="flex-1">{faq.question}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => handleEdit(e, faq)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => handleDelete(e, faq.uuid)}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 py-2">
                <p>{faq.answers}</p>
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div className="text-gray-500 italic mt-3 px-3">
            No FAQs available for this course.
          </div>
        )}
      </Accordion>

      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        type="confirmation"
        variant="delete"
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        destructive={true}
      />
    </div>
  );
}
