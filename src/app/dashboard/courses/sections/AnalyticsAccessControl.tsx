// src/app/dashboard/courses/sections/AnalyticsAccessControl.tsx
"use client";

import Select2 from "@/components/ui/Select2";
import { Course } from "@/types/course";
import { ValidatedInput } from "../shared/ValidatedInput";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";

interface AnalyticsAccessControlProps {
  courseData: Course;
  formData: Record<string, unknown>;
  onInputChange: (field: string, value: unknown) => void;
}

export default function AnalyticsAccessControl({
  formData,
  onInputChange
}: AnalyticsAccessControlProps) {
  const { validateSingleField, getFieldError } = useUnifiedValidation();

  const handleChange = (field: string, value: string) => {
    onInputChange(field, value);
    validateSingleField(field, value);
  };

  return (
    <div className="px-5 py-3">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <ValidatedInput
            type="text"
            className="mb-4 px-3 py-0"
            label="Rating"
            value={String(formData.rating || "")}
            onChange={(e) => handleChange('rating', e.target.value)}
            error={getFieldError('rating')}
          />
        </div>
        <div>
          <ValidatedInput
            type="text"
            className="mb-4 px-3 py-0"
            label="Rating Count"
            value={String(formData.rating_count || "")}
            onChange={(e) => handleChange('rating_count', e.target.value)}
            error={getFieldError('rating_count')}
          />
        </div>
        <div>
          <ValidatedInput
            label="Active Learners"
            type="text"
            className="mb-4 px-3 py-0"
            value={String(formData.active_learners || "")}
            onChange={(e) => handleChange('active_learners', e.target.value)}
            error={getFieldError('active_learners')}
          />
        </div>
        <div>
          <ValidatedInput
            label="CPD Points"
            type="text"
            className="mb-4 px-3 py-0"
            value={String(formData.cpd_points || "")}
            onChange={(e) => handleChange('cpd_points', e.target.value)}
            error={getFieldError('cpd_points')}
          />
        </div>
        <div>
          <label className="text-lg font-medium m-2">Contact Program</label>
          <Select2
            options={[
              { label: 'Yes', value: '1' },
              { label: 'No', value: '0' },
            ]}
            value={String(formData.enable_contact_programs || '')}
            onChange={(val) => {
              if (typeof val === 'string' && (val === '1' || val === '0')) {
                handleChange('enable_contact_programs', val);
              }
            }}
            placeholder="Select Yes or No"
            style={{ padding: '0.6rem' }}
          />
          {getFieldError('enable_contact_programs') && (
            <p className="text-sm text-red-600 mt-1 px-3" role="alert">
              {getFieldError('enable_contact_programs')}
            </p>
          )}
        </div>
        <div>
          <label className="text-lg font-medium m-2">KYC Required</label>
          <Select2
            options={[
              { label: 'Yes', value: '1' },
              { label: 'No', value: '0' },
            ]}
            value={String(formData.is_kyc_required || '')}
            onChange={(val) => {
              if (typeof val === 'string' && (val === '1' || val === '0')) {
                handleChange('is_kyc_required', val);
              }
            }}
            placeholder="Select Yes or No"
            style={{ padding: '0.6rem' }}
          />
          {getFieldError('is_kyc_required') && (
            <p className="text-sm text-red-600 mt-1 px-3" role="alert">
              {getFieldError('is_kyc_required')}
            </p>
          )}
        </div>
        <div>
          <label className="text-lg font-medium m-2">Preferred Course</label>
          <Select2
            options={[
              { label: 'Yes', value: '1' },
              { label: 'No', value: '0' },
            ]}
            value={String(formData.is_preferred_course || '')}
            onChange={(val) => {
              if (typeof val === 'string' && (val === '1' || val === '0')) {
                handleChange('is_preferred_course', val);
              }
            }}
            placeholder="Select Yes or No"
            style={{ padding: '0.6rem' }}
          />
          {getFieldError('is_preferred_course') && (
            <p className="text-sm text-red-600 mt-1 px-3" role="alert">
              {getFieldError('is_preferred_course')}
            </p>
          )}
        </div>
        <div>
          <label className="text-lg font-medium m-2">Enable Index Tags</label>
          <Select2
            options={[
              { label: 'Yes', value: '1' },
              { label: 'No', value: '0' },
            ]}
            value={String(formData.enable_index_tag || '')}
            onChange={(val) => {
              if (typeof val === 'string' && (val === '1' || val === '0')) {
                handleChange('enable_index_tag', val);
              }
            }}
            placeholder="Select Yes or No"
            style={{ padding: '0.6rem' }}
          />
          {getFieldError('enable_index_tag') && (
            <p className="text-sm text-red-600 mt-1 px-3" role="alert">
              {getFieldError('enable_index_tag')}
            </p>
          )}
        </div>
        <div>
          <label className="text-lg font-medium m-2">No Price</label>
          <Select2
            options={[
              { label: 'Yes', value: '1' },
              { label: 'No', value: '0' },
            ]}
            value={String(formData.no_price || '')}
            onChange={(val) => {
              if (typeof val === 'string' && (val === '1' || val === '0')) {
                handleChange('no_price', val);
              }
            }}
            placeholder="Select Yes or No"
            style={{ padding: '0.6rem' }}
          />
          {getFieldError('no_price') && (
            <p className="text-sm text-red-600 mt-1 px-3" role="alert">
              {getFieldError('no_price')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}