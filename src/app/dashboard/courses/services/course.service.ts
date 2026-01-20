import { UpdateCourse } from '@/lib/courses-api';
import {createCourseSettings, updateCourseSettings, getCourseSettings} from '@/lib/coursesetting-api';
import { separateFieldsByEntity } from '../config/field-mapping';
import { convertFormDataToApiTypes } from '../utils/typeConversion'

class CourseService {
  /**
   * Main update method - routes data to appropriate APIs
   */
  async updateCourse(courseUuid: string, data: Record<string, unknown>) {
    // Convert types before separating
    const convertedData = convertFormDataToApiTypes(data);
    
    // Separate fields by entity
    const { courseFields, settingsFields, pricingFields } = 
      separateFieldsByEntity(convertedData);

    const promises: Promise<unknown>[] = [];

    // Update course table if needed
    if (Object.keys(courseFields).length > 0) {
      promises.push(UpdateCourse(courseUuid, courseFields));
    }

    // Update settings table if needed
    if (Object.keys(settingsFields).length > 0) {
      promises.push(this.updateSettings(courseUuid, settingsFields));
    }

    // Update pricing if needed
    if (Object.keys(pricingFields).length > 0) {
      promises.push(this.updatePricing(courseUuid, pricingFields));
    }

    return Promise.all(promises);
  }

  /**
   * Updates or creates course settings
   */
  private async updateSettings(courseUuid: string, data: Record<string, unknown>) {
    try {
      const existingSettings = await getCourseSettings(courseUuid);
      
      if (existingSettings && existingSettings.uuid) {
        return updateCourseSettings(existingSettings.uuid, data);
      } else {
        return createCourseSettings(courseUuid, data);
      }
    } catch (error) {
      // If settings don't exist, create them
      console.error('Settings not found, creating new ones:', error);
      return createCourseSettings(courseUuid, data);
    }
  }

  /**
   * Updates course pricing
   */
  private async updatePricing(courseUuid: string, data: Record<string, unknown>) {
    // Implementation depends on your pricing API
    // This is a placeholder
    console.log('Updating pricing:', courseUuid, data);
    return Promise.resolve();
  }
}

export const courseService = new CourseService();