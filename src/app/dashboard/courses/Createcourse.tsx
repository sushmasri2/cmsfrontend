"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import styles from './createcourse.module.css';
import { MonitorStop, TabletSmartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Course } from "@/types/course";
import { GetCourseById } from "@/lib/courses-api";
import { useApiCache } from "@/hooks/use-api-cache";
import { setGlobalCacheInstance } from "@/lib/cache-utils";
import { useI18n } from "@/hooks/useI18n";

// Import tab content components
import CourseStructure from "./coursestructure";
import CourseSettings from "./coursesettings";
import CoursePrice from "./courseprice";
import Seo from "./courseseo";
import RecommendedCourses from "./recommendedcourses";
import Patrons from "./coursepatrons";
import Logs from "./courselogs";
import FAQs from "./coursefaqs";
import SampleCertificate from "./samplecertificate";

const validTabs = ["coursestructure", "coursesettings", "courseprice", "seo","faqs", "samplecertificate", "recommendedcourses", "patrons", "logs"];

export default function CreateCourse() {
  const router = useRouter();
  const pathname = usePathname();
  const cacheInstance = useApiCache();
  const { cachedApiCall, invalidateCache } = cacheInstance;

  // Set global cache instance for API functions to use
  setGlobalCacheInstance(cacheInstance);

  // Extract tab from path: /dashboard/courses/[tab]
  const pathSegments = pathname.split("/");
  const tabSegment = pathSegments[pathSegments.length - 1] || "courseStructure";
  const [activeTab, setActiveTab] = useState(tabSegment);

  const [courseData, setCourseData] = useState<Course | null>(null);
  const [lastCourseId, setLastCourseId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const courseId = Number(searchParams.get("id") ?? 0);
  const { t } = useI18n();

  const tabList = [
    { value: "coursestructure", label: t("courses.courseStructure"), Component: CourseStructure, path: "coursestructure" },
    { value: "coursesettings", label: t("courses.courseSettings"), Component: CourseSettings, path: "coursesettings" },
    { value: "courseprice", label: t("courses.coursePrice"), Component: CoursePrice, path: "courseprice" },
    { value: "seo", label: t("courses.seo"), Component: Seo, path: "seo" },
    { value: "faqs", label: t("courses.faqs"), Component: FAQs, path: "faqs" },
    { value: "samplecertificate", label: t("courses.sampleCertificate"), Component: SampleCertificate, path: "samplecertificate" },
    { value: "recommendedcourses", label: t("courses.recommendedCourses"), Component: RecommendedCourses, path: "recommendedcourses" },
    { value: "patrons", label: t("courses.patrons"), Component: Patrons, path: "patrons" },
    { value: "logs", label: t("courses.logs"), Component: Logs, path: "logs" },
  ];

  useEffect(() => {
    setActiveTab(tabSegment);

    if (!validTabs.includes(tabSegment) && pathname.includes('/dashboard/courses/')) {
      const redirectUrl = courseId
        ? `/dashboard/courses/coursestructure?id=${courseId}`
        : '/dashboard/courses/coursestructure';
      router.replace(redirectUrl);
    }
    // validTabs is defined outside the component and doesn't change, so it can be safely omitted
  }, [tabSegment, pathname, router, courseId]);

  useEffect(() => {
    if (!courseId) {
      console.error("No courseId provided");
      setCourseData(null);
      setLastCourseId(null);
      return;
    }


    const fetchCourseData = async () => {
      try {
        // If this is a different course ID than the last one, it might be a newly created course
        // Force invalidate cache for this specific course to ensure fresh data
        if (lastCourseId !== courseId) {
          invalidateCache(`course-${courseId}`);
          invalidateCache('courses'); // Also invalidate courses list cache
        }

        // Use the new GetCourseById function that handles UUID/ID fallback internally
        const course = await cachedApiCall(() => GetCourseById(courseId), { 
          cacheKey: `course-${courseId}`,
          ttl: 5000 // Shorter TTL for individual courses to ensure fresh data
        });
        
        if (course) {
          setCourseData(course);
          setLastCourseId(courseId);
        } else {
          console.error("Course not found");
          setCourseData(null);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseData(null);
      }
    };

    fetchCourseData();
  }, [courseId, cachedApiCall, invalidateCache, lastCourseId]);
  const handleTabChange = (value: string) => {
    let newUrl;
    if (courseId) {
      // Support both formats
      newUrl = `/dashboard/courses/${value}?id=${courseId}`;
    } else {
      newUrl = `/dashboard/courses/${value}`;
    }
    router.push(newUrl);
    setActiveTab(value);
  };

  // if (loading) {
  //   return <div>Loading course data...</div>;
  // }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>{courseData?.course_name || t("courses.newCourse")}</h1>
        </div>
        <div className={styles.courseSectionButtons} >
          <Button variant='glass' title={t("courses.previewOnDesktop")}><MonitorStop /></Button>
          <Button variant='glass' title={t("courses.previewOnMobile")}><TabletSmartphone /></Button>
        </div>
      </div>
      <div className={styles.row}>
        <Tabs value={activeTab} onValueChange={handleTabChange} className={styles.tabs}>
          <TabsList className={styles.tabsList}>
            {tabList.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabList.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className={styles.tabContent}>
                <tab.Component courseData={courseData} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}