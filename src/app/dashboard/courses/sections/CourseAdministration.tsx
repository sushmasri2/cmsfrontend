// src/app/dashboard/courses/sections/CourseAdministration.tsx
"use client";

import { Course } from "@/types/course";
import { ValidatedInput } from "../shared/ValidatedInput";
import Select2 from "@/components/ui/Select2";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";

interface CourseAdministrationProps {
  courseData: Course;
  formData: Record<string, unknown>;
  onInputChange: (field: string, value: unknown) => void;
}

export default function CourseAdministration({
  formData,
  onInputChange
}: CourseAdministrationProps) {
  const { validateSingleField, getFieldError } = useUnifiedValidation();

  const handleChange = (field: string, value: string | string[]) => {
    onInputChange(field, value);
    validateSingleField(field, value);
  };

  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '';
    }
  };

  const scheduleOptions = [
    { label: 'Select Schedule', value: '' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-lg font-medium">Version</label>
          <ValidatedInput
            className="px-3 py-2"
            value={String(formData.version || "")}
            onChange={(e) => handleChange('version', e.target.value)}
            error={getFieldError('version')}
            placeholder="Enter Version"
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Kite ID</label>
          <ValidatedInput
            className="px-3 py-2"
            value={String(formData.kite_id || "")}
            onChange={(e) => handleChange('kite_id', e.target.value)}
            error={getFieldError('kite_id')}
            placeholder="Enter Kite ID"
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Zoho ID</label>
          <ValidatedInput
            className="px-3 py-2"
            value={String(formData.course_zoho_id || "")}
            onChange={(e) => handleChange('course_zoho_id', e.target.value)}
            error={getFieldError('course_zoho_id')}
            placeholder="Enter Zoho ID"
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Duration</label>
          <ValidatedInput
            className="px-3 py-2"
            value={String(formData.duration || "")}
            onChange={(e) => handleChange('duration', e.target.value)}
            error={getFieldError('duration')}
            placeholder="Enter Duration"
          />
        </div>
        <div>
          <label className="text-lg font-medium m-2">Specialty Type</label>
          <Select2
            options={[
              { label: 'Select Specialty Type', value: '' },
              { label: 'Doctors', value: 'doctors' },
              { label: 'Nurses', value: 'nurses' },
              { label: 'Others', value: 'others' },
            ]}
            value={String(formData.speciality_type || '')}
            onChange={(val) => handleChange('speciality_type', val as string)}
            placeholder="Select Specialty Type"
            style={{ padding: '0.6rem' }}
          />
          {getFieldError('speciality_type') && (
            <p className="text-sm text-red-600 mt-1 px-3" role="alert">
              {getFieldError('speciality_type')}
            </p>
          )}
        </div>
        <div>
          <ValidatedInput
            label="Partner Course Code"
            className="px-3 py-2"
            value={String(formData.partner_coursecode || "")}
            onChange={(e) => handleChange('partner_coursecode', e.target.value)}
            error={getFieldError('partner_coursecode')}
            placeholder="Enter Partner Course Code"
          />
        </div>
        <div>
          <ValidatedInput
            label="Course Start Date"
            type="date"
            className="px-3 py-2"
            value={formatDateForInput(formData.course_start_date as string)}
            onChange={(e) => handleChange('course_start_date', e.target.value)}
            error={getFieldError('course_start_date')}
            style={{ padding: '0.6rem' }}
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Duration (Y/M/D)</label>
          <div className="flex gap-2">
            <ValidatedInput
              className="px-3 py-2"
              value={String(formData.duration_years || "")}
              onChange={(e) => handleChange('duration_years', e.target.value)}
              placeholder="Years"
            />
            <ValidatedInput
              className="px-3 py-2"
              value={String(formData.duration_months || "")}
              onChange={(e) => handleChange('duration_months', e.target.value)}
              placeholder="Months"
            />
            <ValidatedInput
              className="px-3 py-2"
              value={String(formData.duration_days || "")}
              onChange={(e) => handleChange('duration_days', e.target.value)}
              placeholder="Days"
            />
          </div>
          <p className="text-red-500 text-sm mt-1">
            {getFieldError('duration_years') ||
              getFieldError('duration_months') ||
              getFieldError('duration_days')}
          </p>
        </div>
        <div>
          <label className="block text-lg font-medium">Course Schedule</label>
          <div className="flex gap-2">
            <Select2
              options={scheduleOptions}
              value={String(formData.schedule || '')}
              onChange={(val) => handleChange('schedule', val as string)}
              placeholder="Select Schedule"
              className="flex-1"
              style={{ padding: '0.6rem' }}
            />
            <ValidatedInput
              type="date"
              className="px-3 py-2 flex-1"
              value={formatDateForInput(formData.end_date as string)}
              onChange={(e) => handleChange('end_date', e.target.value)}
              error={getFieldError('end_date')}
              placeholder="End Date"
            />
          </div>
        </div>
      </div>
    </div>
  );
}