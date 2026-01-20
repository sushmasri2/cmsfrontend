export const FIELD_TO_API_MAP = {
  // Fields that belong to the main 'courses' table
  COURSE_FIELDS: [
    'id',
    'uuid',
    'course_name',
    'title',
    'course_card_title',
    'one_line_description',
    'short_description',
    'description',
    'duration',
    'category_id',
    'course_type_id',
    'status',
    'version',
    'no_price',
    'seo_title',
    'seo_description',
    'seo_url',
    'sem_url',
    'rating',
    'rating_count',
    'active_learners',
    'cpd_points',
    'kite_id',
    'course_zoho_id',
    'created_at',
    'updated_at',
  ] as const,

  // Fields that belong to the 'course_settings' table
  SETTINGS_FIELDS: [
    'banner',
    'overview',
    'duration_years',
    'duration_months',
    'duration_days',
    'schedule',
    'end_date',
    'course_start_date',
    'y_month',
    'y_day',
    'm_month',
    'm_day',
    'w_week',
    'w_days',
    'd_days',
    'accreditation',
    'extendedvalidity_years',
    'extendedvalidity_months',
    'extendedvalidity_days',
    'brochure',
    'financial_aid',
    'is_preferred_course',
    'what_you_will_learn',
    'course_demo_url',
    'course_demo_mobile_url',
    'children_course',
    'is_kyc_required',
    'banner_alt_tag',
    'enable_contact_programs',
    'enable_index_tag',
    'thumbnail_mobile',
    'thumbnail_web',
    'partner_coursecode',
    'disclosure',
    'summary',
    'speciality_type',
    'pedagogy',
    'alumni_work',
    'samplecertificate',
  ] as const,

  // Fields that belong to the 'course_pricing' table
  PRICING_FIELDS: [
    'price',
    'future_price',
    'future_price_effect_from',
    'extended_validity_price',
    'major_update_price',
    'currency',
  ] as const,
};

/**
 * Separates form data into appropriate API entities
 */
export function separateFieldsByEntity(data: Record<string, unknown>) {
  const courseFields: Record<string, unknown> = {};
  const settingsFields: Record<string, unknown> = {};
  const pricingFields: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (FIELD_TO_API_MAP.COURSE_FIELDS.includes(key as never)) {
      courseFields[key] = value;
    } else if (FIELD_TO_API_MAP.SETTINGS_FIELDS.includes(key as never)) {
      settingsFields[key] = value;
    } else if (FIELD_TO_API_MAP.PRICING_FIELDS.includes(key as never)) {
      pricingFields[key] = value;
    }
  });

  return { courseFields, settingsFields, pricingFields };
}