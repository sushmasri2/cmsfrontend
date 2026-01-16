import {ClinicalObservershipPartner, CourseClinicalObservershipPartnerItem} from '../types/clinical_observership_partners';
import { fetchWithHeaders } from './api-client';

 const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_COURSE || ''; 

export async function getClinicalObservershipPartners(): Promise<ClinicalObservershipPartner[]> {
  try {
   
    if (!baseUrl) {
      throw new Error('API base URL is not defined');
    }

    let allPartners: ClinicalObservershipPartner[] = [];
    let page = 1;
    let hasMore = true;
    const pageSize = 100; // Adjust as needed for your API

    while (hasMore) {
      const fullUrl = `${baseUrl}/api/clinical-observership-partners?page=${page}&limit=${pageSize}`;
      const response = await fetchWithHeaders(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success !== undefined && !result.success) {
        throw new Error(result.message || 'Unknown API error');
      }

      let partners: ClinicalObservershipPartner[] = [];
      if (result.data) {
        partners = result.data;
      } else if (Array.isArray(result)) {
        partners = result;
      } else {
        throw new Error('Unexpected response structure');
      }

      allPartners = allPartners.concat(partners);

      // If less than pageSize returned, assume last page
      if (partners.length < pageSize) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allPartners;
  } catch (error) {
    console.error('Error fetching clinical observership partners:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the API');
    }
    throw error;
  }
}
export async function getCourseClinicalObservershipPartners(courseUuid: string): Promise<ClinicalObservershipPartner  []> {
  try {
    if (!baseUrl) {
      throw new Error('API base URL is not defined');
    }

    const fullUrl = `${baseUrl}/api/courses/${courseUuid}/clinical-observership-partners`;
    const response = await fetchWithHeaders(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response:', errorText);
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    // Handle the actual API response structure
    if (result.status === "success" && result.data && Array.isArray(result.data)) {
      const partners: ClinicalObservershipPartner[] = result.data
        .filter((item: CourseClinicalObservershipPartnerItem) => item.ClinicalObservershipPartner)
        .map((item: CourseClinicalObservershipPartnerItem) => ({
          id: item.ClinicalObservershipPartner.id.toString(),
          uuid: item.ClinicalObservershipPartner.uuid,
          name: item.ClinicalObservershipPartner.name,
          image_url: item.ClinicalObservershipPartner.image_url,
          position: item.ClinicalObservershipPartner.position,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
      
      return partners;
    } else {
      console.warn('Unexpected course clinical observership partners response structure:', result);
      return [];
    }

  } catch (error) {
    console.error('Error fetching course clinical observership partners:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the API');
    }
    throw error;
  }
}

export async function bulkCourseClinicalObservershipPartners(courseUuid: string, partneruuids: string[]): Promise<void> {
  try {
    if (!baseUrl) {
      throw new Error('API base URL is not defined');
    } 
    const fullUrl = `${baseUrl}/api/courses/${courseUuid}/clinical-observership-partners/bulk`;
    const response = await fetchWithHeaders(fullUrl, {
      method: 'PUT',
      headers: {  
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clinical_observership_partner_uuids: partneruuids }),
    }); 
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response:', errorText);  
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    // Optionally handle response if needed
  } catch (error) {
    console.error('Error bulk updating course clinical observership partners:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the API');
    }
    throw error;
  }
}