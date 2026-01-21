'use client';

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "../shared/ValidatedInput";
import { ValidatedTextarea } from "../shared/ValidatedTextarea";
import { useCourseUpdate } from "../hooks/useCourseUpdate";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";

interface CourseSEOProps {
  courseData: Course;
}

export default function CourseSEO({ courseData }: CourseSEOProps) {
  const [formData, setFormData] = useState({
    seo_title: courseData?.seo_title || '',
    seo_description: courseData?.seo_description || '',
    seo_url: courseData?.seo_url || '',
    sem_url: courseData?.sem_url || ''
  });

  const { mutate: updateCourse, isPending } = useCourseUpdate();
  const { validateTab, getFieldError, validateSingleField } = useUnifiedValidation();

  useEffect(() => {
    if (courseData) {
      setFormData({
        seo_title: courseData.seo_title || '',
        seo_description: courseData.seo_description || '',
        seo_url: courseData.seo_url || '',
        sem_url: courseData.sem_url || ''
      });
    }
  }, [courseData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateSingleField(field, value);
  };

  const handleSave = () => {
    if (!courseData?.uuid) return;

    const validation = validateTab.validateSEO(formData);
    if (!validation.isValid) return;

    updateCourse({
      courseUuid: courseData.uuid,
      data: formData,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ValidatedInput
          label="SEO Title"
          value={formData.seo_title}
          onChange={(e) => handleChange('seo_title', e.target.value)}
          error={getFieldError('seo_title')}
          placeholder="Enter SEO title"
        />
        <ValidatedInput
          label="SEO URL"
          value={formData.seo_url}
          onChange={(e) => handleChange('seo_url', e.target.value)}
          error={getFieldError('seo_url')}
          placeholder="Enter SEO url (lowercase, hyphens only)"
        />
        <ValidatedInput
          label="SEM URL"
          value={formData.sem_url}
          onChange={(e) => handleChange('sem_url', e.target.value)}
          error={getFieldError('sem_url')}
          placeholder="Enter SEM url"
        />
      </div>

      <ValidatedTextarea
        label="SEO Description"
        value={formData.seo_description}
        onChange={(e) => handleChange('seo_description', e.target.value)}
        error={getFieldError('seo_description')}
        placeholder="Enter SEO description"
        rows={4}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {
          setFormData({
            seo_title: courseData?.seo_title || '',
            seo_description: courseData?.seo_description || '',
            seo_url: courseData?.seo_url || '',
            sem_url: courseData?.sem_url || ''
          });
        }}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save SEO Settings'}
        </Button>
      </div>
    </div>
  );
}