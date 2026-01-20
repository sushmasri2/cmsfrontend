export const ERROR_MESSAGES = {
  // Course Information Tab
  COURSE_INFORMATION: {
    COURSE_NAME_REQUIRED: 'Course name is required',
    COURSE_NAME_MIN_LENGTH: 'Course name must be at least 3 characters',
    COURSE_NAME_MAX_LENGTH: 'Course name cannot exceed 255 characters',
    TITLE_REQUIRED: 'Course title is required',
    TITLE_MIN_LENGTH: 'Title must be at least 3 characters',
    TITLE_MAX_LENGTH: 'Title cannot exceed 255 characters',
    COURSE_CARD_TITLE_REQUIRED: 'Course card title is required',
    COURSE_CARD_TITLE_MAX_LENGTH: 'Course card title cannot exceed 255 characters',
    ONE_LINE_DESC_REQUIRED: 'One line description is required',
    ONE_LINE_DESC_MIN_LENGTH: 'Description must be at least 10 characters',
    ONE_LINE_DESC_MAX_LENGTH: 'Description cannot exceed 500 characters',
    SHORT_DESC_MAX_LENGTH: 'Short description cannot exceed 1000 characters',
    DESCRIPTION_MIN_LENGTH: 'Description must be at least 50 characters',
    DESCRIPTION_MAX_LENGTH: 'Description cannot exceed 5000 characters',
    CATEGORY_REQUIRED: 'Please select a category',
    COURSE_TYPE_REQUIRED: 'Please select a course type',
    CATEGORY_INVALID: 'Please select a valid category',
    COURSE_TYPE_INVALID: 'Please select a valid course type',
  },

  // Visual Assets Tab
  VISUAL_ASSETS: {
    BANNER_REQUIRED: 'Banner image is required',
    BANNER_INVALID_FORMAT: 'Banner must be a valid image URL (.jpg, .jpeg, .png, .gif, .webp)',
    BANNER_MAX_LENGTH: 'Banner URL cannot exceed 500 characters',
    BANNER_ALT_REQUIRED: 'Banner alt tag is required',
    BANNER_ALT_MAX_LENGTH: 'Banner alt tag cannot exceed 255 characters',
    THUMBNAIL_WEB_INVALID: 'Web thumbnail must be a valid image URL',
    THUMBNAIL_WEB_MAX_LENGTH: 'Web thumbnail URL cannot exceed 500 characters',
    THUMBNAIL_MOBILE_INVALID: 'Mobile thumbnail must be a valid image URL',
    THUMBNAIL_MOBILE_MAX_LENGTH: 'Mobile thumbnail URL cannot exceed 500 characters',
    DEMO_URL_REQUIRED: 'Course demo URL is required',
    DEMO_URL_INVALID: 'Course demo URL must be a valid URL',
    DEMO_URL_MAX_LENGTH: 'Course demo URL cannot exceed 500 characters',
    DEMO_MOBILE_URL_REQUIRED: 'Course demo mobile URL is required',
    DEMO_MOBILE_URL_INVALID: 'Course demo mobile URL must be a valid URL',
    DEMO_MOBILE_URL_MAX_LENGTH: 'Course demo mobile URL cannot exceed 500 characters',
    BROCHURE_INVALID: 'Brochure must be a valid URL',
    BROCHURE_MAX_LENGTH: 'Brochure URL cannot exceed 500 characters',
  },

  // Course Content Tab
  COURSE_CONTENT: {
    OVERVIEW_REQUIRED: 'Overview is required',
    OVERVIEW_MAX_LENGTH: 'Overview cannot exceed 5000 characters',
    WHAT_YOU_LEARN_MAX_LENGTH: 'Special features cannot exceed 5000 characters',
    SUMMARY_MAX_LENGTH: 'Summary cannot exceed 1000 characters',
    DISCLOSURE_MAX_LENGTH: 'Disclosure cannot exceed 2000 characters',
    FINANCIAL_AID_MAX_LENGTH: 'Financial aid information cannot exceed 2000 characters',
    PEDAGOGY_MAX_LENGTH: 'Pedagogy cannot exceed 2000 characters',
    ALUMNI_WORK_MAX_LENGTH: 'Alumni work cannot exceed 2000 characters',
  },

  // Course Administration Tab
  ADMINISTRATION: {
    DURATION_MAX_LENGTH: 'Duration cannot exceed 100 characters',
    DURATION_YEARS_INVALID: 'Duration years must be a positive number',
    DURATION_MONTHS_INVALID: 'Duration months must be between 0 and 12',
    DURATION_DAYS_INVALID: 'Duration days must be between 0 and 365',
    START_DATE_INVALID: 'Start date must be a valid date',
    END_DATE_INVALID: 'End date must be a valid date',
    END_DATE_BEFORE_START: 'End date must be after start date',
    SCHEDULE_INVALID: 'Schedule must be one of: daily, weekly, monthly, yearly',
    SPECIALITY_TYPE_INVALID: 'Speciality type must be one of: doctors, nurses, others',
    VERSION_MAX_LENGTH: 'Version cannot exceed 100 characters',
    KITE_ID_INVALID: 'Kite ID must be a number',
    ZOHO_ID_MAX_LENGTH: 'Zoho ID cannot exceed 100 characters',
    PARTNER_CODE_MAX_LENGTH: 'Partner course code cannot exceed 100 characters',
    EXTENDED_VALIDITY_YEARS_INVALID: 'Extended validity years must be a positive number',
    EXTENDED_VALIDITY_MONTHS_INVALID: 'Extended validity months must be between 0 and 12',
    EXTENDED_VALIDITY_DAYS_INVALID: 'Extended validity days must be between 0 and 365',
    WEEK_DAYS_INVALID: 'Week days must be comma-separated weekday names',
    MONTH_INVALID: 'Month must be between 1 and 12',
    DAY_INVALID: 'Day must be between 1 and 31',
  },

  // Accreditation & Compliance Tab
  ACCREDITATION: {
    ACCREDITATION_MAX_LENGTH: 'Accreditation cannot exceed 2000 characters',
  },

  // Analytics & Access Control Tab
  ANALYTICS: {
    RATING_INVALID: 'Rating must be between 0 and 5',
    RATING_DECIMAL_INVALID: 'Rating can have at most 2 decimal places',
    RATING_COUNT_INVALID: 'Rating count must be a positive number',
    ACTIVE_LEARNERS_INVALID: 'Active learners must be a positive number',
    CPD_POINTS_INVALID: 'CPD points must be a positive number',
    CONTACT_PROGRAMS_REQUIRED: 'Please select contact program option',
    KYC_REQUIRED_FIELD: 'Please select KYC requirement',
    PREFERRED_COURSE_REQUIRED: 'Please select preferred course option',
    INDEX_TAG_REQUIRED: 'Please select index tag option',
    NO_PRICE_REQUIRED: 'Please select pricing option',
  },

  // Pricing Tab
  PRICING: {
    PRICE_REQUIRED: 'Price is required',
    PRICE_INVALID: 'Price must be a valid number',
    PRICE_NEGATIVE: 'Price cannot be negative',
    FUTURE_PRICE_INVALID: 'Future price must be a valid number',
    FUTURE_PRICE_NEGATIVE: 'Future price cannot be negative',
    FUTURE_PRICE_DATE_INVALID: 'Future price effective date must be a valid date',
    EXTENDED_PRICE_INVALID: 'Extended validity price must be a valid number',
    EXTENDED_PRICE_NEGATIVE: 'Extended validity price cannot be negative',
    MAJOR_UPDATE_PRICE_INVALID: 'Major update price must be a valid number',
    MAJOR_UPDATE_PRICE_NEGATIVE: 'Major update price cannot be negative',
  },

  // SEO Tab
  SEO: {
    SEO_TITLE_MAX_LENGTH: 'SEO title cannot exceed 255 characters',
    SEO_DESCRIPTION_MAX_LENGTH: 'SEO description cannot exceed 500 characters',
    SEO_URL_INVALID: 'SEO URL format is invalid (use lowercase letters, numbers, and hyphens only)',
    SEO_URL_MAX_LENGTH: 'SEO URL cannot exceed 255 characters',
    SEM_URL_INVALID: 'SEM URL format is invalid (use lowercase letters, numbers, and hyphens only)',
    SEM_URL_MAX_LENGTH: 'SEM URL cannot exceed 255 characters',
  },

  // Patron Tab
  PATRON: {
    NAME_REQUIRED: 'Patron name is required',
    NAME_MIN_LENGTH: 'Patron name must be at least 2 characters',
    NAME_MAX_LENGTH: 'Patron name cannot exceed 255 characters',
    DESIGNATION_REQUIRED: 'Designation is required',
    DESIGNATION_MIN_LENGTH: 'Designation must be at least 2 characters',
    DESIGNATION_MAX_LENGTH: 'Designation cannot exceed 255 characters',
    IMAGE_REQUIRED: 'Image URL is required',
    IMAGE_INVALID_FORMAT: 'Image must be a valid image URL',
    IMAGE_MAX_LENGTH: 'Image URL cannot exceed 500 characters',
  },

  // Common Messages
  COMMON: {
    REQUIRED: (field: string) => `${field} is required`,
    MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
    MAX_LENGTH: (field: string, max: number) => `${field} cannot exceed ${max} characters`,
    INVALID_FORMAT: (field: string) => `${field} format is invalid`,
    INVALID_NUMBER: (field: string) => `${field} must be a valid number`,
    POSITIVE_NUMBER: (field: string) => `${field} must be a positive number`,
    INVALID_DATE: (field: string) => `${field} must be a valid date`,
    INVALID_URL: (field: string) => `${field} must be a valid URL`,
  },
};
