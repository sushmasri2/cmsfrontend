// src/app/dashboard/courses/hooks/useCourseUpdate.ts
import { useState } from 'react';
import { courseService } from '../services/course.service';
import { validateFields } from '../services/validation.service';
import { showToast } from '@/lib/toast';

interface UpdateParams {
  courseUuid: string;
  data: Record<string, unknown>;
  invalidateKeys?: string[][];
}

interface UseCourseUpdateReturn {
  mutate: (params: UpdateParams) => Promise<void>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export function useCourseUpdate(): UseCourseUpdateReturn {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async ({ courseUuid, data }: UpdateParams) => {
    setIsPending(true);
    setIsError(false);
    setError(null);

    try {
      // Validate before sending
      const validation = validateFields(data);
      
      if (!validation.isValid) {
        throw new Error('Validation failed');
      }

      // Update via service
      await courseService.updateCourse(courseUuid, data);
      
      showToast('Changes saved successfully', 'success');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Update failed');
      setError(error);
      setIsError(true);
      showToast('Failed to save changes', 'error');
      console.error('Update error:', error);
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutate,
    isPending,
    isError,
    error,
  };
}