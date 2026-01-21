'use client';

import { Course } from "@/types/course";

interface CourseLogsProps {
  courseData: Course;
}

export default function CourseLogs({ courseData }: CourseLogsProps) {
    console.log(courseData)
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Course Activity Logs</h2>
      <p className="text-gray-500">Activity logs will be displayed here</p>
    </div>
  );
}
