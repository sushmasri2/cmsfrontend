'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Course } from '@/types/course';

// Import tab components
import CourseStructure from '../tabs/CourseStructure';
import CourseSettings from '../tabs/CourseSettings';
import CoursePricing from '../tabs/CoursePrice';
import CourseSEO from '../tabs/CourseSeo';
import CourseFAQs from '../tabs/CourseFaqs';
import CourseCertificates from '../tabs/SampleCertificate';
import CourseRecommendations from '../tabs/RecommendedCourses';
import CoursePatrons from '../tabs/CoursePatrons';
import CourseLogs from '../tabs/CourseLogs';

interface CourseTabWrapperProps {
  courseData: Course;
}

const TAB_CONFIG = [
  { value: 'coursestructure', label: 'Course Structure', Component: CourseStructure },
  { value: 'coursesettings', label: 'Course Settings', Component: CourseSettings },
  { value: 'courseprice', label: 'Course Price', Component: CoursePricing },
  { value: 'seo', label: 'SEO', Component: CourseSEO },
  { value: 'faqs', label: 'FAQs', Component: CourseFAQs },
  { value: 'samplecertificate', label: 'Sample Certificate', Component: CourseCertificates },
  { value: 'recommendedcourses', label: 'Recommended Courses', Component: CourseRecommendations },
  { value: 'patrons', label: 'Patrons', Component: CoursePatrons },
  { value: 'logs', label: 'Logs', Component: CourseLogs },
];

const VALID_TABS = TAB_CONFIG.map(t => t.value);

export default function CourseTabWrapper({ courseData }: CourseTabWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const pathSegments = pathname.split('/');
  const tabSegment = pathSegments[pathSegments.length - 1] || 'coursestructure';
  const [activeTab, setActiveTab] = useState(tabSegment);

  useEffect(() => {
    setActiveTab(tabSegment);

    if (!VALID_TABS.includes(tabSegment) && pathname.includes('/dashboard/courses/')) {
      const redirectUrl = courseData?.id
        ? `/dashboard/courses/coursestructure?id=${courseData.id}`
        : '/dashboard/courses/coursestructure';
      router.replace(redirectUrl);
    }
  }, [tabSegment, pathname, router, courseData?.id]);

  const handleTabChange = (value: string) => {
    const newUrl = courseData?.id
      ? `/dashboard/courses/${value}?id=${courseData.id}`
      : `/dashboard/courses/${value}`;
    
    router.push(newUrl);
    setActiveTab(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full flex overflow-x-auto bg-gray-50 border-b">
          {TAB_CONFIG.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="whitespace-nowrap"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_CONFIG.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="p-6">
            <tab.Component courseData={courseData} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}