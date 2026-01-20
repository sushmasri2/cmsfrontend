import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSpecialities } from '@/lib/specialities-api';
import { getCourseInstructors } from '@/lib/instructor-api';
import { getAccreditationPartners } from '@/lib/accreditation-partners-api';
import { getClinicalObservershipPartners } from '@/lib/clinical_observership_partners';
import { getEligibilities } from '@/lib/eligibility-api';

// Map sections to their required data
const SECTION_DATA_CONFIG: Record<string, {
  queryKeys: string[];
  fetchFn: (courseUuid: string) => Promise<unknown>;
}> = {
  'course-information': {
    queryKeys: ['categories', 'course-types'],
    fetchFn: async () => {
      // These are already fetched globally, no additional fetch needed
      return Promise.resolve();
    },
  },
  
  'visual-assets-media': {
    queryKeys: [],
    fetchFn: async () => Promise.resolve(),
  },
  
  'course-content-support': {
    queryKeys: [],
    fetchFn: async () => Promise.resolve(),
  },
  
  'course-administration': {
    queryKeys: ['instructors'],
    fetchFn: async () => {
      return getCourseInstructors();
    },
  },
  
  'accreditation-compliance': {
    queryKeys: ['specialities', 'accreditation-partners', 'clinical-partners', 'eligibilities'],
    fetchFn: async () => {
      return Promise.all([
        getSpecialities(),
        getAccreditationPartners(),
        getClinicalObservershipPartners(),
        getEligibilities(),
      ]);
    },
  },
  
  'analytics-access-control': {
    queryKeys: [],
    fetchFn: async () => Promise.resolve(),
  },
};

export function useAccordionData(courseUuid: string) {
  const queryClient = useQueryClient();
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set());
  const [loadingSection, setLoadingSection] = useState<string | null>(null);

  const loadSectionData = useCallback(async (sectionId: string) => {
    // Skip if already loaded
    if (loadedSections.has(sectionId)) {
      return;
    }

    const config = SECTION_DATA_CONFIG[sectionId];
    if (!config) return;

    setLoadingSection(sectionId);

    try {
      // Fetch data for this section
      await queryClient.fetchQuery({
        queryKey: ['accordion-section', sectionId, courseUuid],
        queryFn: () => config.fetchFn(courseUuid),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });

      setLoadedSections(prev => new Set([...prev, sectionId]));
    } catch (error) {
      console.error(`Failed to load section ${sectionId}:`, error);
    } finally {
      setLoadingSection(null);
    }
  }, [courseUuid, loadedSections, queryClient]);

  return {
    loadSectionData,
    loadedSections,
    loadingSection,
    isLoaded: (sectionId: string) => loadedSections.has(sectionId),
    isLoading: (sectionId: string) => loadingSection === sectionId,
  };
}