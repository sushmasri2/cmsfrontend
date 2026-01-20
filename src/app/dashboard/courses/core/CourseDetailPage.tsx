'use client';

import { useSearchParams } from 'next/navigation';
import { useCourseData } from '../hooks/useCourseData';
import { PageLoading } from '@/components/ui/loading-spinner';
import CourseHeader from './CourseHeader';
import CourseTabWrapper from './CourseTabWrapper';


export default function CourseDetailPage() {
  const searchParams = useSearchParams();
  const courseId = Number(searchParams.get('id'));

  const { data: courseData, isLoading, error } = useCourseData(courseId);

  if (isLoading) {
    return <PageLoading message="Loading course details..." />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Failed to load course details</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CourseHeader courseData={courseData} />
      <CourseTabWrapper courseData={courseData} />
    </div>
  );
}