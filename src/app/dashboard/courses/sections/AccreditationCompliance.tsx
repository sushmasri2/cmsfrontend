// src/app/dashboard/courses/sections/AccreditationCompliance.tsx
"use client";

import { Course } from "@/types/course";
import { ValidatedTextarea } from "../shared/ValidatedTextarea";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";

interface AccreditationComplianceProps {
  courseData: Course;
  formData: Record<string, unknown>;
  onInputChange: (field: string, value: unknown) => void;
}

export default function AccreditationCompliance({
  formData,
  onInputChange
}: AccreditationComplianceProps) {
  const { validateSingleField, getFieldError } = useUnifiedValidation();

  const handleChange = (field: string, value: string) => {
    onInputChange(field, value);
    validateSingleField(field, value);
  };

  return (
    <div className="px-5 py-3">
      <div>
        <ValidatedTextarea
          label="Accreditation"
          className="mb-4 px-3 py-2"
          value={String(formData.accreditation || "")}
          onChange={(e) => handleChange('accreditation', e.target.value)}
          error={getFieldError('accreditation')}
          placeholder="Enter Accreditation"
          rows={3}
        />
      </div>
      <div className="text-sm text-gray-500 mt-2">
        Additional accreditation and compliance settings can be configured here.
      </div>
    </div>
  );
}