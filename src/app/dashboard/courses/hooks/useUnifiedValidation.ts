import { useState, useCallback } from 'react';
import { ERROR_MESSAGES } from '../config/error-messages';
import { VALIDATION_RULES } from '../config/validation-rules';

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

function validateField(fieldName: string, value: unknown): string | null {
  const rules = VALIDATION_RULES[fieldName];
  if (!rules) return null;

  const isEmpty = value === null || value === undefined || 
    (typeof value === 'string' && value.trim() === '') || value === '';

  // Required check
  if (rules.required) {
    const req = typeof rules.required === 'boolean' 
      ? { value: rules.required, message: `${fieldName} is required` }
      : rules.required;
    
    if (req.value && isEmpty) return req.message;
  }

  if (isEmpty) return null;

  const strValue = String(value).trim();
  const numValue = Number(value);

  // Min/Max length
  if (rules.minLength && strValue.length < rules.minLength.value) {
    return rules.minLength.message;
  }
  if (rules.maxLength && strValue.length > rules.maxLength.value) {
    return rules.maxLength.message;
  }

  // Pattern
  if (rules.pattern && !rules.pattern.value.test(strValue)) {
    return rules.pattern.message;
  }

  // Numeric min/max
  if (rules.min && !isNaN(numValue) && numValue < rules.min.value) {
    return rules.min.message;
  }
  if (rules.max && !isNaN(numValue) && numValue > rules.max.value) {
    return rules.max.message;
  }

  // Custom validator
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
}

// ============================================================================
// TAB-SPECIFIC VALIDATION FUNCTIONS
// ============================================================================

export const TabValidators = {
  // COURSE STRUCTURE TAB
  validateCourseStructure: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    // Add structure-specific validation if needed
    return { isValid: errors.length === 0, errors };
  },

  // COURSE SETTINGS TAB
  validateCourseSettings: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    const fields = [
      'course_name', 'title', 'course_card_title', 'one_line_description',
      'short_description', 'description', 'category_id', 'course_type_id',
      'banner', 'banner_alt_tag', 'thumbnail_web', 'thumbnail_mobile',
      'course_demo_url', 'course_demo_mobile_url', 'brochure',
      'overview', 'what_you_will_learn', 'summary', 'disclosure',
      'financial_aid', 'pedagogy', 'alumni_work',
      'duration', 'duration_years', 'duration_months', 'duration_days',
      'course_start_date', 'end_date', 'schedule', 'speciality_type',
      'version', 'kite_id', 'course_zoho_id', 'partner_coursecode',
      'accreditation',
      'rating', 'rating_count', 'active_learners', 'cpd_points',
      'enable_contact_programs', 'is_kyc_required', 'is_preferred_course',
      'enable_index_tag', 'no_price'
    ];

    fields.forEach(field => {
      if (field in data) {
        const error = validateField(field, data[field]);
        if (error) errors.push({ field, message: error });
      }
    });

    // Cross-field validation: end_date must be after start_date
    if (data.course_start_date && data.end_date) {
      const start = new Date(data.course_start_date as string);
      const end = new Date(data.end_date as string);
      if (start >= end) {
        errors.push({
          field: 'end_date',
          message: ERROR_MESSAGES.ADMINISTRATION.END_DATE_BEFORE_START
        });
      }
    }

    return { isValid: errors.length === 0, errors };
  },

  // PRICING TAB
  validatePricing: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    const fields = ['price', 'future_price', 'future_price_effect_from', 
                   'extended_validity_price', 'major_update_price'];

    fields.forEach(field => {
      if (field in data) {
        const error = validateField(field, data[field]);
        if (error) errors.push({ field, message: error });
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  // SEO TAB
  validateSEO: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    const fields = ['seo_title', 'seo_description', 'seo_url', 'sem_url'];

    fields.forEach(field => {
      if (field in data) {
        const error = validateField(field, data[field]);
        if (error) errors.push({ field, message: error });
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  // FAQs TAB
  validateFAQ: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    
    if (!data.question || String(data.question).trim() === '') {
      errors.push({ field: 'question', message: 'Question is required' });
    }
    if (!data.answer || String(data.answer).trim() === '') {
      errors.push({ field: 'answer', message: 'Answer is required' });
    }

    return { isValid: errors.length === 0, errors };
  },

  // CERTIFICATES TAB
  validateCertificate: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    
    if (!data.key || String(data.key).trim() === '') {
      errors.push({ field: 'key', message: 'Certificate type is required' });
    }
    if (!data.url || String(data.url).trim() === '') {
      errors.push({ field: 'url', message: 'Certificate URL is required' });
    }

    return { isValid: errors.length === 0, errors };
  },

  // RECOMMENDATIONS TAB
  validateRecommendation: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    
    if (!data.recommended_course_uuid) {
      errors.push({ field: 'recommended_course_uuid', message: 'Please select a course' });
    }
    if (data.position === undefined || data.position === null) {
      errors.push({ field: 'position', message: 'Position is required' });
    }

    return { isValid: errors.length === 0, errors };
  },

  // PATRONS TAB
  validatePatron: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    const fields = ['patron_name', 'patron_designation', 'patron_image'];

    // Map patron fields to validation rules
    const fieldMap: Record<string, string> = {
      name: 'patron_name',
      designation: 'patron_designation',
      image: 'patron_image'
    };

    Object.entries(fieldMap).forEach(([dataKey, ruleKey]) => {
      if (dataKey in data) {
        const error = validateField(ruleKey, data[dataKey]);
        if (error) errors.push({ field: dataKey, message: error });
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  // SECTION-SPECIFIC VALIDATORS
  validateCourseInformation: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    const fields = ['course_name', 'title', 'course_card_title', 
                   'one_line_description', 'short_description', 'description',
                   'category_id', 'course_type_id'];

    fields.forEach(field => {
      if (field in data) {
        const error = validateField(field, data[field]);
        if (error) errors.push({ field, message: error });
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  validateVisualAssets: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    const fields = ['banner', 'banner_alt_tag', 'thumbnail_web', 
                   'thumbnail_mobile', 'course_demo_url', 'course_demo_mobile_url',
                   'brochure'];

    fields.forEach(field => {
      if (field in data) {
        const error = validateField(field, data[field]);
        if (error) errors.push({ field, message: error });
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  validateCourseContent: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    const fields = ['overview', 'what_you_will_learn', 'summary', 
                   'disclosure', 'financial_aid', 'pedagogy', 'alumni_work'];

    fields.forEach(field => {
      if (field in data) {
        const error = validateField(field, data[field]);
        if (error) errors.push({ field, message: error });
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  validateAdministration: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    const fields = ['duration', 'duration_years', 'duration_months', 'duration_days',
                   'course_start_date', 'end_date', 'schedule', 'speciality_type',
                   'version', 'kite_id', 'course_zoho_id', 'partner_coursecode'];

    fields.forEach(field => {
      if (field in data) {
        const error = validateField(field, data[field]);
        if (error) errors.push({ field, message: error });
      }
    });

    return { isValid: errors.length === 0, errors };
  },

  validateAccreditation: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    if ('accreditation' in data) {
      const error = validateField('accreditation', data.accreditation);
      if (error) errors.push({ field: 'accreditation', message: error });
    }
    return { isValid: errors.length === 0, errors };
  },

  validateAnalytics: (data: Record<string, unknown>) => {
    const errors: ValidationError[] = [];
    const fields = ['rating', 'rating_count', 'active_learners', 'cpd_points',
                   'enable_contact_programs', 'is_kyc_required', 
                   'is_preferred_course', 'enable_index_tag', 'no_price'];

    fields.forEach(field => {
      if (field in data) {
        const error = validateField(field, data[field]);
        if (error) errors.push({ field, message: error });
      }
    });

    return { isValid: errors.length === 0, errors };
  },
};

// ============================================================================
// MAIN VALIDATION HOOK
// ============================================================================

export function useUnifiedValidation() {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateSingleField = useCallback((fieldName: string, value: unknown) => {
    const error = validateField(fieldName, value);

    setErrors(prev => {
      const filtered = prev.filter(e => e.field !== fieldName);
      return error ? [...filtered, { field: fieldName, message: error }] : filtered;
    });

    return error;
  }, []);

  const validateMultipleFields = useCallback((data: Record<string, unknown>) => {
    const newErrors: ValidationError[] = [];

    Object.entries(data).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) {
        newErrors.push({ field, message: error });
      }
    });

    setErrors(newErrors);
    return { isValid: newErrors.length === 0, errors: newErrors };
  }, []);

  const clearErrors = useCallback(() => setErrors([]), []);
  
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => prev.filter(e => e.field !== fieldName));
  }, []);

  const getFieldError = useCallback((fieldName: string) => {
    return errors.find(e => e.field === fieldName)?.message || null;
  }, [errors]);

  const hasFieldError = useCallback((fieldName: string) => {
    return errors.some(e => e.field === fieldName);
  }, [errors]);

  return {
    errors,
    validateSingleField,
    validateMultipleFields,
    validateTab: TabValidators,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError,
    isValid: errors.length === 0,
  };
}