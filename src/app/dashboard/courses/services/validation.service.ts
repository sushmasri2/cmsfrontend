import { VALIDATION_RULES, FieldValidationRule } from '../config/validation-rules';

export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'length' | 'range' | 'custom';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates a single field value against its rules
 */
export function validateField(
  fieldName: string,
  value: unknown,
  rules: FieldValidationRule
): ValidationError | null {
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    value === '';

  // Required validation
  if (rules.required) {
    const requiredRule = typeof rules.required === 'boolean' 
      ? { value: rules.required, message: `${fieldName} is required` }
      : rules.required;
    
    if (requiredRule.value && isEmpty) {
      return {
        field: fieldName,
        message: requiredRule.message,
        type: 'required',
      };
    }
  }

  // Skip other validations if empty and not required
  if (isEmpty) return null;

  const stringValue = String(value).trim();
  const numericValue = Number(value);

  // Length validations
  if (rules.minLength && stringValue.length < rules.minLength.value) {
    return {
      field: fieldName,
      message: rules.minLength.message,
      type: 'length',
    };
  }

  if (rules.maxLength && stringValue.length > rules.maxLength.value) {
    return {
      field: fieldName,
      message: rules.maxLength.message,
      type: 'length',
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.value.test(stringValue)) {
    return {
      field: fieldName,
      message: rules.pattern.message,
      type: 'format',
    };
  }

  // Numeric range validations
  if (rules.min !== undefined && !isNaN(numericValue) && numericValue < rules.min.value) {
    return {
      field: fieldName,
      message: rules.min.message,
      type: 'range',
    };
  }

  if (rules.max !== undefined && !isNaN(numericValue) && numericValue > rules.max.value) {
    return {
      field: fieldName,
      message: rules.max.message,
      type: 'range',
    };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return {
        field: fieldName,
        message: customError,
        type: 'custom',
      };
    }
  }

  return null;
}

/**
 * Validates multiple fields at once
 */
export function validateFields(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  Object.entries(data).forEach(([fieldName, value]) => {
    const rules = VALIDATION_RULES[fieldName];
    if (rules) {
      const error = validateField(fieldName, value, rules);
      if (error) {
        errors.push(error);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Gets error message for a specific field
 */
export function getFieldError(fieldName: string, errors: ValidationError[]): string | null {
  return errors.find(e => e.field === fieldName)?.message || null;
}

/**
 * Checks if a field has an error
 */
export function hasFieldError(fieldName: string, errors: ValidationError[]): boolean {
  return errors.some(e => e.field === fieldName);
}
