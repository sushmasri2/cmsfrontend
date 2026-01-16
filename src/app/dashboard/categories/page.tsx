"use client";
import { getCoursesCategoryPaginated, deleteCategory } from "@/lib/coursecategory-api";
import { useEffect, useState, useMemo, useRef, Suspense } from "react";
import { CourseCategory, PaginatedResponse } from "@/types/coursecategory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Search, X, Eye } from "lucide-react";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination2";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { showToast } from '@/lib/toast';
import { useApiCache } from "@/hooks/use-api-cache";
import { setGlobalCacheInstance } from "@/lib/cache-utils";


function CategoriesContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Set up cache instance for automatic cache invalidation
    const cacheInstance = useApiCache();
    setGlobalCacheInstance(cacheInstance);
    const [categories, setCategories] = useState<CourseCategory[]>([]);
    const [sortByOption, setSortByOption] = useState("Newest");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(() => {
        const pageParam = searchParams.get('page');
        return pageParam ? parseInt(pageParam, 10) : 1;
    });
    const [pagination, setPagination] = useState<PaginatedResponse<CourseCategory>['pagination'] | null>(null);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<CourseCategory | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const isUserNavigation = useRef(false);

    const sortBy = [
        { label: "Newest", value: "newest" },
        { label: "Oldest", value: "oldest" },
        { label: "A-Z", value: "a-z" },
        { label: "Z-A", value: "z-a" },
    ];

    // For now, we'll display the paginated data as-is
    // In a full implementation, you might want to send sort and search parameters to the API
    const displayCategories = useMemo(() => {
        let result = [...categories];

        // Client-side search filter (only applied to current page data)
        if (searchQuery) {
            result = result.filter((c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Client-side sorting (only applied to current page data)
        if (sortByOption === "A-Z") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortByOption === "Z-A") {
            result.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortByOption === "Newest") {
            result.sort((a, b) => (b.created_at && a.created_at ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : 0));
        } else if (sortByOption === "Oldest") {
            result.sort((a, b) => (a.created_at && b.created_at ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : 0));
        }

        return result;
    }, [categories, sortByOption, searchQuery]);

    // Sync URL params with component state (only for browser navigation, not user clicks)
    useEffect(() => {
        if (!isUserNavigation.current) {
            const pageParam = searchParams.get('page');
            const urlPage = pageParam ? parseInt(pageParam, 10) : 1;
            if (urlPage !== currentPage) {
                setCurrentPage(urlPage);
            }
        }
        isUserNavigation.current = false;
    }, [searchParams, currentPage]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await getCoursesCategoryPaginated(currentPage,pagination?.limit || 10);
                setCategories(response.data);
                setPagination(response.pagination);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [currentPage, pagination?.limit]);

    const handlePageChange = (url: string, page: number) => {
        isUserNavigation.current = true;
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

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearch = () => {
        isUserNavigation.current = true;
        setSearchQuery(searchInput);
        // Reset to first page when searching
        setCurrentPage(1);
        // Remove page parameter from URL when resetting to page 1
        const params = new URLSearchParams(searchParams.toString());
        params.delete('page');
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.push(newUrl);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleReset = () => {
        isUserNavigation.current = true;
        setSearchInput("");
        setSearchQuery("");
        // Reset to first page when clearing search
        setCurrentPage(1);
        // Remove page parameter from URL when resetting to page 1
        const params = new URLSearchParams(searchParams.toString());
        params.delete('page');
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.push(newUrl);
    };

    const handleEdit = (categoryId: number) => {
        router.push(`/dashboard/categories/categoryCreateUpdate?id=${categoryId}`);
    };

    const handleDeleteClick = (category: CourseCategory) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;

        try {
            setIsDeleting(true);

            // Call the delete API using the category's UUID
            await deleteCategory(categoryToDelete.uuid);

            // Remove the deleted category from the state
            setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));

            // Close modal and reset state
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);

            showToast(`Category "${categoryToDelete.name}" deleted successfully`, 'info');
        } catch (error) {
            console.error('Error deleting category:', error);
            // Handle error - you might want to show a toast notification here
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            showToast(`Failed to delete category: ${errorMessage}`, 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="relative w-2/4">
                    <Input
                        type="text"
                        placeholder="Search categories..."
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        onKeyPress={handleKeyPress}
                        className={searchInput ? "pr-20" : "pr-12"}
                    />
                    {searchInput && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="absolute right-10 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                            title="Clear search"
                        >
                            <X size={16} />
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleSearch}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                        title="Search"
                    >
                        <Search size={16} />
                    </Button>
                </div>
                {sortBy.map((sortby) => (
                    <Button key={sortby.value} variant={sortByOption === sortby.label ? 'primaryBtn' : 'outline'} className="flex-[3] gap-2 rounded-lg border-gray-300 text-left justify-between" onClick={() => setSortByOption(sortby.label)}>
                        {sortby.label}
                    </Button>
                ))}
                <Button variant="primaryBtn" onClick={() => router.push('/dashboard/categories/categoryCreateUpdate')}>Add Course Category</Button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <LoadingSpinner size="lg" text="Loading categories..." />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayCategories.map((category, index) => {
                        // Determine category type for stylin
                        return (
                            <div
                                key={category.id}
                                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                                data-category={category.name.toLowerCase()}
                            >
                                {/* Image Section */}
                                <div 
                                    className="p-10 flex items-center justify-center min-h-[200px] relative overflow-hidden"
                                    style={{ backgroundColor: category.background_color_code || '#f8fafc' }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                                    <Image
                                        src={failedImages.has(category.image || '') || !category.image ? '/placeholder-image.svg' : category.image}
                                        alt={category.name || 'Category image'}
                                        width={140}
                                        height={140}
                                        unoptimized
                                        className="object-contain relative z-10 filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                                        onError={() => {
                                            if (category.image && !failedImages.has(category.image)) {
                                                setFailedImages(prev => new Set([...prev, category.image]));
                                            }
                                        }}
                                        priority={index < 3}
                                    />
                                </div>

                                {/* Content Section */}
                                <div className="p-5">
                                    <div className="mb-5">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{category.name}</h3>
                                        {category.position && (
                                            <div className="inline-flex items-center gap-2 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-4 py-1 rounded-full text-sm font-semibold">
                                                Position: {category.position}
                                            </div>
                                        )}
                                    </div>
                                    {category.description && (
                                        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
                                            {category.description}
                                        </p>
                                    )}              
                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Button
                                            variant="primaryBtn"
                                            size="sm"
                                            onClick={() => router.push(`/dashboard/categories/${category.slug}`)}
                                            className="flex-1 border-0 rounded-lg py-3 px-4 flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Courses and Details
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(category.id)}
                                            className="w-10 h-10 p-0 bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-600 hover:text-white hover:border-sky-600 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteClick(category)}
                                            className="w-10 h-10 p-0 bg-red-50 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Search Results Info */}
            {searchQuery && (
                <div className="mt-4 mb-2 text-sm text-gray-600">
                    Found {displayCategories.length} result{displayCategories.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                </div>
            )}

            {/* Pagination Component */}
            {pagination && pagination.totalPages > 1 && !searchQuery && (
                <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                type="confirmation"
                variant="delete"
                title="Delete Category"
                message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                loading={isDeleting}
                destructive={true}
            />

        </>
    );
}

export default function Categories() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-[300px]"><LoadingSpinner size="lg" text="Loading categories..." /></div>}>
            <CategoriesContent />
        </Suspense>
    );
}