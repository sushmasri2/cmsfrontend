import { useState, useCallback } from 'react';
import { ValidationError, validateField, validateFields as validateAllFields } from '../services/validation.service';
import { VALIDATION_RULES } from '../config/validation-rules';

export function useValidation() {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateSingleField = useCallback((fieldName: string, value: unknown) => {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) return null;

    const error = validateField(fieldName, value, rules);

    // Update errors state
    setErrors(prev => {
      const filtered = prev.filter(e => e.field !== fieldName);
      return error ? [...filtered, error] : filtered;
    });

    return error;
  }, []);

  const validateFields = useCallback((data: Record<string, unknown>) => {
    const result = validateAllFields(data);
    setErrors(result.errors);
    return result;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

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
    validateFields,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError,
    isValid: errors.length === 0,
  };
}