'use client';

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCourseUpdate } from "../hooks/useCourseUpdate";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";
import { useAccordionData } from "../hooks/useAccordionData";
import CourseInformation from "../sections/CourseInformation";
import VisualAssets from "../sections/VisualAssets";
import CourseContent from "../sections/CourseContent";
import CourseAdministration from "../sections/CourseAdministration";
import AccreditationCompliance from "../sections/AccreditationCompliance";
import AnalyticsAccessControl from "../sections/AnalyticsAccessControl";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseSettingsProps {
  courseData: Course;
}

const ACCORDION_SECTIONS = [
  { id: "course-information", label: "Course Information", Component: CourseInformation },
  { id: "visual-assets-media", label: "Visual Assets & Media", Component: VisualAssets },
  { id: "course-content-support", label: "Course Content & Support", Component: CourseContent },
  { id: "course-administration", label: "Course Administration", Component: CourseAdministration },
  { id: "accreditation-compliance", label: "Accreditation & Compliance", Component: AccreditationCompliance },
  { id: "analytics-access-control", label: "Analytics & Access Control", Component: AnalyticsAccessControl },
];

export default function CourseSettings({ courseData }: CourseSettingsProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const { mutate: updateCourse, isPending } = useCourseUpdate();
  const { validateTab, errors, clearErrors } = useUnifiedValidation();
  const { loadSectionData, isLoaded, isLoading } = useAccordionData(courseData.uuid);

  useEffect(() => {
    if (courseData) {
      setFormData({ ...courseData });
    }
  }, [courseData]);

  const handleAccordionChange = (newOpenItems: string[]) => {
    setOpenItems(newOpenItems);
    newOpenItems.forEach(sectionId => {
      if (!isLoaded(sectionId)) {
        loadSectionData(sectionId);
      }
    });
  };

  const toggleAll = () => {
    if (openItems.length === ACCORDION_SECTIONS.length) {
      setOpenItems([]);
    } else {
      const allIds = ACCORDION_SECTIONS.map(s => s.id);
      setOpenItems(allIds);
      allIds.forEach(id => {
        if (!isLoaded(id)) {
          loadSectionData(id);
        }
      });
    }
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!courseData?.uuid) return;

    // Validate entire form
    const validation = validateTab.validateCourseSettings(formData);
    
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors);
      return;
    }

    updateCourse({
      courseUuid: courseData.uuid,
      data: formData,
    });
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 justify-end">
        <Button onClick={toggleAll} variant="outline">
          {openItems.length === ACCORDION_SECTIONS.length ? "Collapse All" : "Expand All"}
        </Button>
      </div>

      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={handleAccordionChange}
        className="w-full space-y-3"
      >
        {ACCORDION_SECTIONS.map(({ id, label, Component }) => (
          <AccordionItem key={id} value={id} className="border rounded-lg">
            <AccordionTrigger className="bg-gray-50 px-5 py-3 hover:bg-gray-100">
              <h3 className="text-lg font-semibold">{label}</h3>
            </AccordionTrigger>
            <AccordionContent className="p-5">
              {isLoading(id) ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Component
                  courseData={courseData}
                  formData={formData}
                  onInputChange={handleInputChange}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {errors.map((error, idx) => (
              <li key={idx}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={clearErrors}>
          Cancel
        </Button>
        <Button variant="default" onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}