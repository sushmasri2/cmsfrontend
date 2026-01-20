export function convertFormDataToApiTypes(data: Record<string, unknown>): Record<string, unknown> {
  const converted: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    // Handle empty strings
    if (value === '' || value === null || value === undefined) {
      converted[key] = value;
      return;
    }

    // Convert based on field type patterns
    if (key.includes('_id') && typeof value === 'string') {
      // IDs should be numbers
      const num = Number(value);
      converted[key] = isNaN(num) ? value : num;
    } else if (
      key.includes('is_') ||
      key.includes('enable_') ||
      key === 'no_price' ||
      key === 'status'
    ) {
      // Boolean fields
      if (typeof value === 'string') {
        converted[key] = value === '1' || value.toLowerCase() === 'true';
      } else {
        converted[key] = Boolean(value);
      }
    } else if (
      key.includes('price') ||
      key.includes('rating') ||
      key.includes('count') ||
      key.includes('learners') ||
      key.includes('points') ||
      key.includes('duration_') ||
      key.includes('_month') ||
      key.includes('_day') ||
      key.includes('_week') ||
      key.includes('_year')
    ) {
      // Numeric fields
      const num = Number(value);
      converted[key] = isNaN(num) ? undefined : num;
    } else {
      // Keep as is
      converted[key] = value;
    }
  });

  return converted;
}
