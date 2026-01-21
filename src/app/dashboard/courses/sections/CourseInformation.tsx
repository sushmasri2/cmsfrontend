"use client";

import { Course } from "@/types/course";
import { ValidatedTextarea } from "../shared/ValidatedTextarea";
import { ValidatedInput } from "../shared/ValidatedInput";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";

interface CourseInformationProps {
  courseData: Course;
  formData: Record<string, unknown>;
  onInputChange: (field: string, value: unknown) => void;
}

export default function CourseInformation({
  formData,
  onInputChange
}: CourseInformationProps) {
  const { validateSingleField, getFieldError } = useUnifiedValidation();

  const handleChange = (field: string, value: string) => {
    onInputChange(field, value);
    validateSingleField(field, value);
  };

  return (
    <div className="px-5 py-3">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ValidatedInput
          type="text"
          name="course_name"
          label="Course Name"
          placeholder="Course Name"
          value={String(formData.course_name || "")}
          onChange={(e) => handleChange('course_name', e.target.value)}
          error={getFieldError('course_name')}
          required
        />
        <ValidatedInput
          type="text"
          name="course_card_title"
          label="Course Card Title"
          placeholder="Course Card Title"
          value={String(formData.course_card_title || "")}
          onChange={(e) => handleChange('course_card_title', e.target.value)}
          error={getFieldError('course_card_title')}
          required
        />
        <ValidatedInput
          type="text"
          name="title"
          label="Title"
          placeholder="Title"
          value={String(formData.title || "")}
          onChange={(e) => handleChange('title', e.target.value)}
          error={getFieldError('title')}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <ValidatedTextarea
          name="one_line_description"
          label="One Line Description"
          placeholder="One line description of the course"
          value={String(formData.one_line_description || "")}
          error={getFieldError('one_line_description')}
          onChange={(e) => handleChange('one_line_description', e.target.value)}
          rows={2}
        />
        <ValidatedTextarea
          name="short_description"
          label="Short Description"
          placeholder="Short description"
          value={String(formData.short_description || "")}
          error={getFieldError('short_description')}
          onChange={(e) => handleChange('short_description', e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="mb-4">
        <ValidatedTextarea
          name="description"
          label="Description"
          placeholder="Course description"
          value={String(formData.description || "")}
          error={getFieldError('description')}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}