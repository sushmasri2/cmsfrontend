import { useQuery } from '@tanstack/react-query';
import { GetCourseById } from '@/lib/courses-api';

export function useCourseData(courseId: number | null) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => {
      if (!courseId) throw new Error('Course ID is required');
      return GetCourseById(courseId);
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}