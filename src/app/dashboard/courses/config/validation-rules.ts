import { ERROR_MESSAGES } from './error-messages';

export interface FieldValidationRule {
  required?: boolean | { value: boolean; message: string };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  custom?: (value: unknown) => string | null;
}

// Common regex patterns
export const PATTERNS = {
  imageUrl: /^(https?:\/\/.*\.(jpg|jpeg|png|gif|webp))|(\/.*\.(jpg|jpeg|png|gif|webp))$/i,
  httpUrl: /^https?:\/\/.+/,
  seoUrl: /^[a-z0-9-]*$/,
  number: /^[0-9]*$/,
  positiveNumber: /^[0-9]+$/,
  decimal: /^\d+(\.\d{1,2})?$/,
};

// Custom validators
const validators = {
  validId: (value: unknown) =>
    !value || isNaN(Number(value)) ? 'Please select a valid option' : null,

  validDate: (value: unknown) =>
    value && typeof value === 'string' && isNaN(Date.parse(value))
      ? 'Must be a valid date'
      : null,

  validUrl: (value: unknown) =>
    value && typeof value === 'string' && !PATTERNS.httpUrl.test(value)
      ? 'Must be a valid URL'
      : null,

  imageFormat: (value: unknown) =>
    value && typeof value === 'string' && !PATTERNS.imageUrl.test(value)
      ? 'Must be a valid image format'
      : null,

  rating: (value: unknown) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 5) {
      return ERROR_MESSAGES.ANALYTICS.RATING_INVALID;
    }
    const str = String(value);
    if (str.includes('.') && str.split('.')[1].length > 2) {
      return ERROR_MESSAGES.ANALYTICS.RATING_DECIMAL_INVALID;
    }
    return null;
  },

  weekDays: (value: unknown) => {
    if (value && typeof value === 'string') {
      const parts = value.split(',').map(p => p.trim());
      const validWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const allValid = parts.every(part =>
        validWeekdays.some(validDay => validDay.toLowerCase() === part.toLowerCase())
      );
      if (!allValid) {
        return ERROR_MESSAGES.ADMINISTRATION.WEEK_DAYS_INVALID;
      }
    }
    return null;
  },

  schedule: (value: unknown) =>
    value && typeof value === 'string' && !['daily', 'weekly', 'monthly', 'yearly'].includes(value.toLowerCase())
      ? ERROR_MESSAGES.ADMINISTRATION.SCHEDULE_INVALID
      : null,

  specialityType: (value: unknown) =>
    value && typeof value === 'string' && !['doctors', 'nurses', 'others'].includes(value.toLowerCase())
      ? ERROR_MESSAGES.ADMINISTRATION.SPECIALITY_TYPE_INVALID
      : null,
};

export const VALIDATION_RULES: Record<string, FieldValidationRule> = {
  // ========== COURSE INFORMATION ==========
  course_name: {
    required: { value: true, message: ERROR_MESSAGES.COURSE_INFORMATION.COURSE_NAME_REQUIRED },
    minLength: { value: 3, message: ERROR_MESSAGES.COURSE_INFORMATION.COURSE_NAME_MIN_LENGTH },
    maxLength: { value: 255, message: ERROR_MESSAGES.COURSE_INFORMATION.COURSE_NAME_MAX_LENGTH },
  },

  title: {
    required: { value: true, message: ERROR_MESSAGES.COURSE_INFORMATION.TITLE_REQUIRED },
    minLength: { value: 3, message: ERROR_MESSAGES.COURSE_INFORMATION.TITLE_MIN_LENGTH },
    maxLength: { value: 255, message: ERROR_MESSAGES.COURSE_INFORMATION.TITLE_MAX_LENGTH },
  },

  course_card_title: {
    required: { value: true, message: ERROR_MESSAGES.COURSE_INFORMATION.COURSE_CARD_TITLE_REQUIRED },
    maxLength: { value: 255, message: ERROR_MESSAGES.COURSE_INFORMATION.COURSE_CARD_TITLE_MAX_LENGTH },
  },

  one_line_description: {
    required: { value: true, message: ERROR_MESSAGES.COURSE_INFORMATION.ONE_LINE_DESC_REQUIRED },
    minLength: { value: 10, message: ERROR_MESSAGES.COURSE_INFORMATION.ONE_LINE_DESC_MIN_LENGTH },
    maxLength: { value: 500, message: ERROR_MESSAGES.COURSE_INFORMATION.ONE_LINE_DESC_MAX_LENGTH },
  },

  short_description: {
    maxLength: { value: 1000, message: ERROR_MESSAGES.COURSE_INFORMATION.SHORT_DESC_MAX_LENGTH },
  },

  description: {
    minLength: { value: 50, message: ERROR_MESSAGES.COURSE_INFORMATION.DESCRIPTION_MIN_LENGTH },
    maxLength: { value: 5000, message: ERROR_MESSAGES.COURSE_INFORMATION.DESCRIPTION_MAX_LENGTH },
  },

  category_id: {
    required: { value: true, message: ERROR_MESSAGES.COURSE_INFORMATION.CATEGORY_REQUIRED },
    custom: validators.validId,
  },

  course_type_id: {
    required: { value: true, message: ERROR_MESSAGES.COURSE_INFORMATION.COURSE_TYPE_REQUIRED },
    custom: validators.validId,
  },

  // ========== VISUAL ASSETS ==========
  banner: {
    required: { value: true, message: ERROR_MESSAGES.VISUAL_ASSETS.BANNER_REQUIRED },
    maxLength: { value: 500, message: ERROR_MESSAGES.VISUAL_ASSETS.BANNER_MAX_LENGTH },
    custom: validators.imageFormat,
  },

  banner_alt_tag: {
    required: { value: true, message: ERROR_MESSAGES.VISUAL_ASSETS.BANNER_ALT_REQUIRED },
    maxLength: { value: 255, message: ERROR_MESSAGES.VISUAL_ASSETS.BANNER_ALT_MAX_LENGTH },
  },

  thumbnail_web: {
    maxLength: { value: 500, message: ERROR_MESSAGES.VISUAL_ASSETS.THUMBNAIL_WEB_MAX_LENGTH },
    custom: validators.imageFormat,
  },

  thumbnail_mobile: {
    maxLength: { value: 500, message: ERROR_MESSAGES.VISUAL_ASSETS.THUMBNAIL_MOBILE_MAX_LENGTH },
    custom: validators.imageFormat,
  },

  course_demo_url: {
    required: { value: true, message: ERROR_MESSAGES.VISUAL_ASSETS.DEMO_URL_REQUIRED },
    maxLength: { value: 500, message: ERROR_MESSAGES.VISUAL_ASSETS.DEMO_URL_MAX_LENGTH },
    custom: validators.validUrl,
  },

  course_demo_mobile_url: {
    required: { value: true, message: ERROR_MESSAGES.VISUAL_ASSETS.DEMO_MOBILE_URL_REQUIRED },
    maxLength: { value: 500, message: ERROR_MESSAGES.VISUAL_ASSETS.DEMO_MOBILE_URL_MAX_LENGTH },
    custom: validators.validUrl,
  },

  brochure: {
    maxLength: { value: 500, message: ERROR_MESSAGES.VISUAL_ASSETS.BROCHURE_MAX_LENGTH },
    custom: validators.validUrl,
  },

  // ========== COURSE CONTENT ==========
  overview: {
    required: { value: true, message: ERROR_MESSAGES.COURSE_CONTENT.OVERVIEW_REQUIRED },
    maxLength: { value: 5000, message: ERROR_MESSAGES.COURSE_CONTENT.OVERVIEW_MAX_LENGTH },
  },

  what_you_will_learn: {
    maxLength: { value: 5000, message: ERROR_MESSAGES.COURSE_CONTENT.WHAT_YOU_LEARN_MAX_LENGTH },
  },

  summary: {
    maxLength: { value: 1000, message: ERROR_MESSAGES.COURSE_CONTENT.SUMMARY_MAX_LENGTH },
  },

  disclosure: {
    maxLength: { value: 2000, message: ERROR_MESSAGES.COURSE_CONTENT.DISCLOSURE_MAX_LENGTH },
  },

  financial_aid: {
    maxLength: { value: 2000, message: ERROR_MESSAGES.COURSE_CONTENT.FINANCIAL_AID_MAX_LENGTH },
  },

  pedagogy: {
    maxLength: { value: 2000, message: ERROR_MESSAGES.COURSE_CONTENT.PEDAGOGY_MAX_LENGTH },
  },

  alumni_work: {
    maxLength: { value: 2000, message: ERROR_MESSAGES.COURSE_CONTENT.ALUMNI_WORK_MAX_LENGTH },
  },

  // ========== COURSE ADMINISTRATION ==========
  duration: {
    maxLength: { value: 100, message: ERROR_MESSAGES.ADMINISTRATION.DURATION_MAX_LENGTH },
  },

  duration_years: {
    pattern: { value: PATTERNS.number, message: ERROR_MESSAGES.ADMINISTRATION.DURATION_YEARS_INVALID },
    min: { value: 0, message: ERROR_MESSAGES.ADMINISTRATION.DURATION_YEARS_INVALID },
  },

  duration_months: {
    pattern: { value: PATTERNS.number, message: ERROR_MESSAGES.ADMINISTRATION.DURATION_MONTHS_INVALID },
    min: { value: 0, message: ERROR_MESSAGES.ADMINISTRATION.DURATION_MONTHS_INVALID },
    max: { value: 12, message: ERROR_MESSAGES.ADMINISTRATION.DURATION_MONTHS_INVALID },
  },

  duration_days: {
    pattern: { value: PATTERNS.number, message: ERROR_MESSAGES.ADMINISTRATION.DURATION_DAYS_INVALID },
    min: { value: 0, message: ERROR_MESSAGES.ADMINISTRATION.DURATION_DAYS_INVALID },
    max: { value: 365, message: ERROR_MESSAGES.ADMINISTRATION.DURATION_DAYS_INVALID },
  },

  course_start_date: {
    custom: validators.validDate,
  },

  end_date: {
    custom: validators.validDate,
  },

  schedule: {
    custom: validators.schedule,
  },

  speciality_type: {
    custom: validators.specialityType,
  },

  version: {
    maxLength: { value: 100, message: ERROR_MESSAGES.ADMINISTRATION.VERSION_MAX_LENGTH },
  },

  kite_id: {
    pattern: { value: PATTERNS.positiveNumber, message: ERROR_MESSAGES.ADMINISTRATION.KITE_ID_INVALID },
  },

  course_zoho_id: {
    maxLength: { value: 100, message: ERROR_MESSAGES.ADMINISTRATION.ZOHO_ID_MAX_LENGTH },
  },

  partner_coursecode: {
    maxLength: { value: 100, message: ERROR_MESSAGES.ADMINISTRATION.PARTNER_CODE_MAX_LENGTH },
  },

  w_days: {
    custom: validators.weekDays,
  },

  // ========== ACCREDITATION ==========
  accreditation: {
    maxLength: { value: 2000, message: ERROR_MESSAGES.ACCREDITATION.ACCREDITATION_MAX_LENGTH },
  },

  // ========== ANALYTICS ==========
  rating: {
    min: { value: 0, message: ERROR_MESSAGES.ANALYTICS.RATING_INVALID },
    max: { value: 5, message: ERROR_MESSAGES.ANALYTICS.RATING_INVALID },
    pattern: { value: PATTERNS.decimal, message: ERROR_MESSAGES.ANALYTICS.RATING_DECIMAL_INVALID },
    custom: validators.rating,
  },

  rating_count: {
    pattern: { value: PATTERNS.positiveNumber, message: ERROR_MESSAGES.ANALYTICS.RATING_COUNT_INVALID },
  },

  active_learners: {
    pattern: { value: PATTERNS.number, message: ERROR_MESSAGES.ANALYTICS.ACTIVE_LEARNERS_INVALID },
  },

  cpd_points: {
    pattern: { value: PATTERNS.positiveNumber, message: ERROR_MESSAGES.ANALYTICS.CPD_POINTS_INVALID },
  },

  enable_contact_programs: {
    required: { value: true, message: ERROR_MESSAGES.ANALYTICS.CONTACT_PROGRAMS_REQUIRED },
  },

  is_kyc_required: {
    required: { value: true, message: ERROR_MESSAGES.ANALYTICS.KYC_REQUIRED_FIELD },
  },

  is_preferred_course: {
    required: { value: true, message: ERROR_MESSAGES.ANALYTICS.PREFERRED_COURSE_REQUIRED },
  },

  enable_index_tag: {
    required: { value: true, message: ERROR_MESSAGES.ANALYTICS.INDEX_TAG_REQUIRED },
  },

  no_price: {
    required: { value: true, message: ERROR_MESSAGES.ANALYTICS.NO_PRICE_REQUIRED },
  },

  // ========== PRICING ==========
  price: {
    required: { value: true, message: ERROR_MESSAGES.PRICING.PRICE_REQUIRED },
    min: { value: 0, message: ERROR_MESSAGES.PRICING.PRICE_NEGATIVE },
    pattern: { value: PATTERNS.positiveNumber, message: ERROR_MESSAGES.PRICING.PRICE_INVALID },
  },

  future_price: {
    min: { value: 0, message: ERROR_MESSAGES.PRICING.FUTURE_PRICE_NEGATIVE },
    pattern: { value: PATTERNS.positiveNumber, message: ERROR_MESSAGES.PRICING.FUTURE_PRICE_INVALID },
  },

  future_price_effect_from: {
    custom: validators.validDate,
  },

  extended_validity_price: {
    min: { value: 0, message: ERROR_MESSAGES.PRICING.EXTENDED_PRICE_NEGATIVE },
    pattern: { value: PATTERNS.positiveNumber, message: ERROR_MESSAGES.PRICING.EXTENDED_PRICE_INVALID },
  },

  major_update_price: {
    min: { value: 0, message: ERROR_MESSAGES.PRICING.MAJOR_UPDATE_PRICE_NEGATIVE },
    pattern: { value: PATTERNS.positiveNumber, message: ERROR_MESSAGES.PRICING.MAJOR_UPDATE_PRICE_INVALID },
  },

  // ========== SEO ==========
  seo_title: {
    maxLength: { value: 255, message: ERROR_MESSAGES.SEO.SEO_TITLE_MAX_LENGTH },
  },

  seo_description: {
    maxLength: { value: 500, message: ERROR_MESSAGES.SEO.SEO_DESCRIPTION_MAX_LENGTH },
  },

  seo_url: {
    pattern: { value: PATTERNS.seoUrl, message: ERROR_MESSAGES.SEO.SEO_URL_INVALID },
    maxLength: { value: 255, message: ERROR_MESSAGES.SEO.SEO_URL_MAX_LENGTH },
  },

  sem_url: {
    pattern: { value: PATTERNS.seoUrl, message: ERROR_MESSAGES.SEO.SEM_URL_INVALID },
    maxLength: { value: 255, message: ERROR_MESSAGES.SEO.SEM_URL_MAX_LENGTH },
  },

  // ========== PATRON ==========
  patron_name: {
    required: { value: true, message: ERROR_MESSAGES.PATRON.NAME_REQUIRED },
    minLength: { value: 2, message: ERROR_MESSAGES.PATRON.NAME_MIN_LENGTH },
    maxLength: { value: 255, message: ERROR_MESSAGES.PATRON.NAME_MAX_LENGTH },
  },

  patron_designation: {
    required: { value: true, message: ERROR_MESSAGES.PATRON.DESIGNATION_REQUIRED },
    minLength: { value: 2, message: ERROR_MESSAGES.PATRON.DESIGNATION_MIN_LENGTH },
    maxLength: { value: 255, message: ERROR_MESSAGES.PATRON.DESIGNATION_MAX_LENGTH },
  },

  patron_image: {
    required: { value: true, message: ERROR_MESSAGES.PATRON.IMAGE_REQUIRED },
    maxLength: { value: 500, message: ERROR_MESSAGES.PATRON.IMAGE_MAX_LENGTH },
    custom: validators.imageFormat,
  },
};