'use client';

import { Course } from '@/types/course';
import { Button } from '@/components/ui/button';
import { MonitorStop, TabletSmartphone } from 'lucide-react';

interface CourseHeaderProps {
  courseData: Course;
}

export default function CourseHeader({ courseData }: CourseHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="text-white">
          <h1 className="text-2xl font-bold">{courseData.course_name || 'New Course'}</h1>
          <p className="text-indigo-100 text-sm mt-1">
            {courseData.category_name} • {courseData.type_name}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="glass" title="Preview on Desktop">
            <MonitorStop className="w-4 h-4 mr-2" />
            Desktop Preview
          </Button>
          <Button variant="glass" title="Preview on Mobile">
            <TabletSmartphone className="w-4 h-4 mr-2" />
            Mobile Preview
          </Button>
        </div>
      </div>
    </div>
  );
}