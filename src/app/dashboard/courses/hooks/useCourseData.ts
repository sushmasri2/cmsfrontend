// src/app/dashboard/courses/hooks/useCourseData.ts
import { useState, useEffect } from 'react';
import { GetCourseById } from '@/lib/courses-api';
import { Course } from '@/types/course';

interface UseCourseDataReturn {
  data: Course | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCourseData(courseId: number | null): UseCourseDataReturn {
  const [data, setData] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourse = async () => {
    if (!courseId) {
      setData(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const course = await GetCourseById(courseId);
      setData(course);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch course');
      setError(error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchCourse,
  };
}