// src/app/dashboard/courses/sections/VisualAssets.tsx
"use client";

import { Course } from "@/types/course";
import { ValidatedInput } from "../shared/ValidatedInput";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";

interface VisualAssetsProps {
  courseData: Course;
  formData: Record<string, unknown>;
  onInputChange: (field: string, value: unknown) => void;
}

export default function VisualAssets({
  formData,
  onInputChange
}: VisualAssetsProps) {
  const { validateSingleField, getFieldError } = useUnifiedValidation();

  const handleChange = (field: string, value: string) => {
    onInputChange(field, value);
    validateSingleField(field, value);
  };

  return (
    <div className="px-5 py-3">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-lg font-medium m-2">Banner of the Course</label>
          <ValidatedInput
            type="text"
            name="banner"
            className="mb-4 px-3 py-0"
            value={String(formData.banner || "")}
            onChange={(e) => handleChange('banner', e.target.value)}
            error={getFieldError('banner')}
            placeholder="Enter banner URL"
          />
        </div>
        <div>
          <label className="text-lg font-medium m-2">Web Thumbnail</label>
          <ValidatedInput
            type="text"
            name="thumbnail_web"
            className="mb-4 px-3 py-0"
            placeholder="Enter Web Thumbnail URL"
            value={String(formData.thumbnail_web || "")}
            onChange={(e) => handleChange('thumbnail_web', e.target.value)}
            error={getFieldError('thumbnail_web')}
          />
        </div>
        <div>
          <label className="text-lg font-medium m-2">Mobile Thumbnail</label>
          <ValidatedInput
            type="text"
            name="thumbnail_mobile"
            className="mb-4 px-3 py-0"
            placeholder="Enter Mobile Thumbnail URL"
            value={String(formData.thumbnail_mobile || "")}
            onChange={(e) => handleChange('thumbnail_mobile', e.target.value)}
            error={getFieldError('thumbnail_mobile')}
          />
        </div>
        <div>
          <label className="text-lg font-medium m-2">Course Banner URL Web</label>
          <ValidatedInput
            type="text"
            name="course_demo_url"
            className="mb-4 px-3 py-0"
            placeholder="Enter Course Banner URL Web"
            value={String(formData.course_demo_url || "")}
            onChange={(e) => handleChange('course_demo_url', e.target.value)}
            error={getFieldError('course_demo_url')}
            required
          />
        </div>
        <div>
          <label className="text-lg font-medium m-2">Course Banner URL Mobile</label>
          <ValidatedInput
            type="text"
            name="course_demo_mobile_url"
            className="mb-4 px-3 py-0"
            placeholder="Enter Course Banner URL Mobile"
            value={String(formData.course_demo_mobile_url || "")}
            onChange={(e) => handleChange('course_demo_mobile_url', e.target.value)}
            error={getFieldError('course_demo_mobile_url')}
            required
          />
        </div>
        <div>
          <label className="text-lg font-medium m-2">Banner Alt Tag</label>
          <ValidatedInput
            type="text"
            name="banner_alt_tag"
            className="mb-4 px-3 py-0"
            placeholder="Enter Banner Alt Tag"
            value={String(formData.banner_alt_tag || "")}
            onChange={(e) => handleChange('banner_alt_tag', e.target.value)}
            error={getFieldError('banner_alt_tag')}
            required
          />
        </div>
        <div>
          <label className="text-lg font-medium m-2">Brochure</label>
          <ValidatedInput
            type="text"
            name="brochure"
            className="mb-4 px-3 py-0"
            value={String(formData.brochure || "")}
            placeholder="Enter Brochure URL"
            onChange={(e) => handleChange('brochure', e.target.value)}
            error={getFieldError('brochure')}
          />
        </div>
      </div>
    </div>
  );
}