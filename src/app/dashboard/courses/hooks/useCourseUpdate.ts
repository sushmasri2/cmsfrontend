import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/course.service';
import { validateFields } from '../services/validation.service';
import { showToast } from '@/lib/toast';

interface UpdateParams {
  courseUuid: string;
  data: Record<string, unknown>;
  invalidateKeys?: string[][];
}

export function useCourseUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseUuid, data }: UpdateParams) => {
      // Validate before sending
      const validation = validateFields(data);
      
      if (!validation.isValid) {
        throw new Error('Validation failed');
      }

      // Update via service
      return courseService.updateCourse(courseUuid, data);
    },

    // Optimistic update - UI updates immediately
    onMutate: async ({ courseUuid, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['course', courseUuid] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(['course', courseUuid]);

      // Optimistically update cache
      queryClient.setQueryData(['course', courseUuid], (old: unknown) => {
        // Ensure 'old' is an object before spreading
        return { ...(old as object), ...data };
      });


      return { previousData };
    },

    // Rollback on error
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ['course', variables.courseUuid],
          context.previousData
        );
      }
      
      showToast('Failed to save changes', 'error');
      console.error('Update error:', error);
    },

    // Refetch on success
    onSuccess: (_, variables) => {
      showToast('Changes saved successfully', 'success');
      
      // Invalidate course data
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseUuid] });
      
      // Invalidate specific sections if provided
      if (variables.invalidateKeys) {
        variables.invalidateKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
  });
}