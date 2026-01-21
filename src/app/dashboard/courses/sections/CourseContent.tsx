// src/app/dashboard/courses/sections/CourseContent.tsx
"use client";

import { Course } from "@/types/course";
import { ValidatedTextarea } from "../shared/ValidatedTextarea";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";

interface CourseContentProps {
  courseData: Course;
  formData: Record<string, unknown>;
  onInputChange: (field: string, value: unknown) => void;
}

export default function CourseContent({
  formData,
  onInputChange
}: CourseContentProps) {
  const { validateSingleField, getFieldError } = useUnifiedValidation();

  const handleChange = (field: string, value: string) => {
    onInputChange(field, value);
    validateSingleField(field, value);
  };

  return (
    <div className="px-5 py-3">
      <div className="mb-4">
        <ValidatedTextarea
          name="summary"
          label="Course Summary"
          placeholder="Course summary"
          value={String(formData.summary || "")}
          error={getFieldError('summary')}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={3}
        />
      </div>
      <div className="mb-4">
        <ValidatedTextarea
          label="Special Features"
          placeholder="Special features of the course"
          className="mb-4 px-3 py-2"
          value={String(formData.what_you_will_learn || "")}
          onChange={(e) => handleChange('what_you_will_learn', e.target.value)}
          error={getFieldError('what_you_will_learn')}
          rows={3}
        />
      </div>

      <div className="mb-4">
        <ValidatedTextarea
          label="What You Will Gain"
          placeholder="What students will gain from this course"
          className="mb-4 px-3 py-2"
          value={String(formData.overview || "")}
          onChange={(e) => handleChange('overview', e.target.value)}
          error={getFieldError('overview')}
          rows={3}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <ValidatedTextarea
            label="Disclosure"
            placeholder="Course disclosure information"
            className="mb-4 px-3 py-2"
            value={String(formData.disclosure || "")}
            onChange={(e) => handleChange('disclosure', e.target.value)}
            error={getFieldError('disclosure')}
            rows={3}
          />
        </div>
        <div>
          <ValidatedTextarea
            label="Financial Aid"
            placeholder="Financial Aid details"
            className="mb-4 px-3 py-2"
            value={String(formData.financial_aid || "")}
            onChange={(e) => handleChange('financial_aid', e.target.value)}
            error={getFieldError('financial_aid')}
            rows={3}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <ValidatedTextarea
            label="Pedagogy"
            placeholder="Pedagogy details"
            className="mb-4 px-3 py-2"
            value={String(formData.pedagogy || "")}
            onChange={(e) => handleChange('pedagogy', e.target.value)}
            error={getFieldError('pedagogy')}
            rows={3}
          />
        </div>
        <div className="mb-4">
          <ValidatedTextarea
            label="Alumni Work"
            placeholder="Details about alumni work"
            className="mb-4 px-3 py-2"
            value={String(formData.alumni_work || "")}
            onChange={(e) => handleChange('alumni_work', e.target.value)}
            error={getFieldError('alumni_work')}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}