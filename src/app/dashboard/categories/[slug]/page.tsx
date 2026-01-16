"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams, usePathname } from "next/navigation";
import { getCategoryByUuid, getAllCourseByUuidPaginated, getCoursesCategory } from "@/lib/coursecategory-api";
import { CourseCategory, PaginatedResponse } from "@/types/coursecategory";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Image from "next/image";
import Pagination from "@/components/ui/pagination2";


// Type for course data - could be string ID or object
type CourseData = string | { id: string; title?: string; description?: string;[key: string]: unknown };

function CategoryCoursesContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const slug = params.slug as string;

    const [category, setCategory] = useState<CourseCategory | null>(null);
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(() => {
        const pageParam = searchParams.get('page');
        return pageParam ? parseInt(pageParam, 10) : 1;
    });
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const [pagination, setPagination] = useState<PaginatedResponse<CourseData>['pagination'] | null>(null);

    // Sync URL params with component state
    useEffect(() => {
        const pageParam = searchParams.get('page');
        const urlPage = pageParam ? parseInt(pageParam, 10) : 1;
        if (urlPage !== currentPage) {
            setCurrentPage(urlPage);
        }
    }, [searchParams, currentPage]);

    const handlePageChange = (url: string, page: number) => {
        setIsLoadingPage(true);
        setCurrentPage(page);
        
        // Update URL with new page parameter
        const params = new URLSearchParams(searchParams.toString());
        if (page === 1) {
            params.delete('page');
        } else {
            params.set('page', page.toString());
        }
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.push(newUrl);
    };

    useEffect(() => {
        const fetchCategoryAndCourses = async () => {
            try {
                if (currentPage === 1) {
                    setLoading(true);
                } else {
                    setIsLoadingPage(true);
                }
                setError(null);

                // First, get all categories to find the one with the matching slug
                const allCategories = await getCoursesCategory();
                const foundCategory = allCategories.find(cat => cat.slug === slug);

                if (!foundCategory) {
                    setError(`Category with slug "${slug}" not found`);
                    return;
                }

                // Get full category details by UUID
                const categoryDetails = await getCategoryByUuid(foundCategory.uuid);
                setCategory(categoryDetails);

                // Get paginated courses for this category using UUID
                const paginatedResponse = await getAllCourseByUuidPaginated(foundCategory.uuid, currentPage);
                
                // Handle the paginated response
                setCourses(paginatedResponse.data as CourseData[]);
                setPagination(paginatedResponse.pagination);

            } catch (err) {
                console.error('Error fetching category and courses:', err);
                setError(err instanceof Error ? err.message : 'Failed to load category data');
            } finally {
                setLoading(false);
                setIsLoadingPage(false);
            }
        };

        if (slug) {
            fetchCategoryAndCourses();
        }
    }, [slug, currentPage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-center animate-pulse">
                            <LoadingSpinner size="lg" text="Loading category and courses..." />
                            <p className="mt-4 text-slate-600 font-medium">Fetching course details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Category Not Found</h2>
                        <p className="text-slate-600 mb-6">{error || "The requested category could not be found."}</p>
                        <Button
                            onClick={() => router.push('/dashboard/categories')}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Categories
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/dashboard/categories')}
                        className="mb-4 text-slate-600 hover:text-slate-800 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Categories
                    </Button>

                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-4 shadow-md border border-white/20">
                        <div className="flex items-center gap-6">
                            {/* Category Image */}
                            <div
                                className="w-24 h-24 rounded-2xl p-2 flex items-center justify-center"
                                style={{ backgroundColor: category.background_color_code || '#f8fafc' }}
                            >
                                {category.image ? (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        width={60}
                                        height={60}
                                        className="object-contain"
                                    />
                                ) : (
                                    <BookOpen className="w-8 h-8 text-slate-600" />
                                )}
                            </div>

                            {/* Category Info */}
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-slate-800 mb-2">{category.name}</h1>
                                {category.description && (
                                    <p className="text-slate-600 mb-4">{category.description}</p>
                                )}

                                {/* Stats */}
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <BookOpen className="w-5 h-5" />
                                        <span className="font-medium">
                                            {pagination ? `${pagination.total} Total Courses` : `${courses.length} Courses`}
                                        </span>
                                    </div>
                                    {category.position && (
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <span className="font-medium">Position: {category.position}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Courses</h2>

                    {isLoadingPage ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="text-center animate-pulse">
                                <LoadingSpinner size="md" text="Loading courses..." />
                            </div>
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course, index) => {
                                // Handle both string and object types
                                const courseId = typeof course === 'string' ? course : course.id || `course-${index}`;
                                const courseTitle = typeof course === 'object' && course.title ? course.title : `Course ${index + 1}`;

                                return (
                                    <div
                                        key={`course-${index}-${courseId}`}
                                        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100"
                                    >
                                        <div className="flex gap-3">
                                            <div>
                                                <h3 className="font-semibold text-slate-800">{courseTitle}</h3>
                                                {typeof course === 'object' && course.description && (
                                                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">{course.description}</p>
                                                )}
                                                <Button
                                                    size="sm"
                                                    className="flex-end"
                                                    variant="primaryBtn"
                                                    onClick={() => router.push(`/dashboard/courses/coursestructure/?id=${courseId}`)}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Courses Yet</h3>
                            <p className="text-slate-600 mb-6">This category doesn&apos;t have any courses assigned yet.</p>
                            <Button
                                variant="outline"
                                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                onClick={() => router.push('/dashboard/courses/coursestructure')}
                            >
                                Add First Course
                            </Button>
                        </div>
                    )}
                </div>
                {/* Pagination Component */}
                {pagination && pagination.totalPages > 1 && (
                    <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}

export default function CategoryCoursesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-center animate-pulse">
                            <LoadingSpinner size="lg" text="Loading category..." />
                        </div>
                    </div>
                </div>
            </div>
        }>
            <CategoryCoursesContent />
        </Suspense>
    );
}