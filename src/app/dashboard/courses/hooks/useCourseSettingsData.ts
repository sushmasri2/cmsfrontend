import { useState, useEffect, useCallback } from 'react';
import { getCourses, UpdateCourse } from "@/lib/courses-api";
import { getCourseInstructors, getCourseInstructorLinks,bulkLinkInstructorsToCourse } from "@/lib/instructor-api";
import { getSpecialities, getCourseIntendedAudiences } from "@/lib/specialities-api";
import { getAccreditationPartners, getCourseAccreditationPartners,bulkCourseAccreditationPartners } from '@/lib/accreditation-partners-api';
import { getClinicalObservershipPartners, getCourseClinicalObservershipPartners,bulkCourseClinicalObservershipPartners } from '@/lib/clinical_observership_partners';
import { getCourseKeywords } from "@/lib/keywords-api";
import { getCourseSettings } from "@/lib/coursesetting-api";
import { createCourseSettings, updateCourseSettings } from "@/lib/coursesetting-api";
import { validateCourseData } from "../utils/validation";
import { convertCourseDataTypes, convertCourseSettingsTypes, logTypeConversion } from "../utils/typeConversion";
import { Course } from "@/types/course";
import { CourseCategory } from "@/types/coursecategory";
import { CourseType } from "@/types/coursetype";
import { Eligibility } from "@/types/eligibility";
import { Instructor } from "@/types/instructor";
import { Specialty } from "@/types/specialities";
import type { CourseSetting } from "@/types/coursesetting";
import { AccreditationPartner } from '@/types/accreditation-partners';
import { ClinicalObservershipPartner } from '@/types/clinical_observership_partners';
import { useFormValidation, ValidationState, ValidationActions } from './useFormValidation';

import { getCoursesCategory } from "@/lib/coursecategory-api";
import { getCoursesType } from "@/lib/coursetype-api";
import { getEligibilities, getCourseEligibilities,bulkCourseEligibility } from "@/lib/eligibility-api";


export interface CourseSettingsData {
    // Static data
    categories: CourseCategory[];
    courseTypes: CourseType[];
    eligibilities: Eligibility[];
    courses: Course[];
    instructors: Instructor[];
    specialities: Specialty[];
    accreditationOptions: { label: string; value: string }[];
    clinicalObservershipOptions: { label: string; value: string }[];

    // Course-specific data
    courseSettings: CourseSetting | null;
    selectedEligibilities: string[];
    keywords: string;
    selectedInstructors: string[];
    selectedIntendedAudiences: string[];
    selectedAccreditationPartners: string[];
    selectedClinicalObservershipPartners: string[];

    // Selected values
    selectedCategory: string;
    selectedCourseType: string;

    // Loading states
    isLoading: boolean;
    error: string | null;

    // Validation state
    validation: ValidationState;
}

export interface CourseSettingsActions {
    setSelectedCategory: (category: string) => void;
    setSelectedCourseType: (courseType: string) => void;
    setSelectedEligibilities: (eligibilities: string[]) => void;
    setKeywords: (keywords: string) => void;
    setSelectedInstructors: (instructors: string[]) => void;
    setSelectedIntendedAudiences: (audiences: string[]) => void;
    setSelectedAccreditationPartners: (partners: string[]) => void;
    setSelectedClinicalObservershipPartners: (partners: string[]) => void;
    setCourseSettings: (settings: CourseSetting | null) => void;

    // Validation actions
    validation: ValidationActions;

    // Update course handler
    updateCourse: (courseData: Partial<Course>, formData: Record<string, unknown>) => Promise<void>;
}

// Helper function to determine which fields belong to courseData vs courseSettings
function separateFields(formData: Record<string, unknown>) {
    // Course fields from the validation rules
    const courseFields = [
        'course_name', 'title', 'course_card_title', 'one_line_description', 'short_description', 
        'description', 'category_id', 'course_type_id',
        'seo_title', 'seo_description', 'seo_url', 'sem_url', 'cpd_points', 'active_learners', 
        'rating_count', 'rating', 'duration', 'kite_id', 'course_zoho_id', 'no_price'
    ];

    // Course settings fields from the validation rules
    const courseSettingFields = [
        'banner', 'overview', 'duration_years', 'duration_months', 'duration_days',
        'y_month', 'y_day', 'm_month', 'm_day', 'w_week', 'w_days', 'd_days',
        'schedule', 'end_date', 'course_start_date', 'accreditation',
        'extendedvalidity_years', 'extendedvalidity_months', 'extendedvalidity_days',
        'brochure', 'financial_aid', 'is_preferred_course', 'what_you_will_learn',
        'course_demo_url', 'course_demo_mobile_url', 'is_kyc_required', 'banner_alt_tag',
        'enable_contact_programs', 'enable_index_tag', 'thumbnail_mobile', 'thumbnail_web',
        'partner_coursecode', 'disclosure', 'summary', 'speciality_type', 'children_course'
    ];

    const courseDataFields: Record<string, unknown> = {};
    const courseSettingsFields: Record<string, unknown> = {};

    Object.entries(formData).forEach(([key, value]) => {
        if (courseFields.includes(key)) {
            courseDataFields[key] = value;
        } else if (courseSettingFields.includes(key)) {
            courseSettingsFields[key] = value;
        }
    });

    // Apply type conversion to each separated field group
    const convertedCourseDataFields = convertCourseDataTypes(courseDataFields);
    const convertedCourseSettingsFields = convertCourseSettingsTypes(courseSettingsFields);

    // Log type conversions for debugging in development
    if (process.env.NODE_ENV === 'development') {
        Object.entries(courseDataFields).forEach(([key, originalValue]) => {
            const convertedValue = convertedCourseDataFields[key];
            if (originalValue !== convertedValue) {
                logTypeConversion(key, originalValue, convertedValue, 'course field');
            }
        });

        Object.entries(courseSettingsFields).forEach(([key, originalValue]) => {
            const convertedValue = convertedCourseSettingsFields[key];
            if (originalValue !== convertedValue) {
                logTypeConversion(key, originalValue, convertedValue, 'course setting field');
            }
        });
    }

    return { 
        courseDataFields: convertedCourseDataFields, 
        courseSettingsFields: convertedCourseSettingsFields 
    };
}

export function useCourseSettingsData(courseData?: Course | null): [CourseSettingsData, CourseSettingsActions] {
    // Static data states
    const [categories, setCategories] = useState<CourseCategory[]>([]);
    const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
    const [eligibilities, setEligibilities] = useState<Eligibility[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [specialities, setSpecialities] = useState<Specialty[]>([]);
    const [accreditationOptions, setAccreditationOptions] = useState<{ label: string; value: string }[]>([]);
    const [clinicalObservershipOptions, setClinicalObservershipOptions] = useState<{ label: string; value: string }[]>([]);

    // Course-specific data states
    const [courseSettings, setCourseSettings] = useState<CourseSetting | null>(null);
    const [selectedEligibilities, setSelectedEligibilities] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<string>("");
    const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
    const [selectedIntendedAudiences, setSelectedIntendedAudiences] = useState<string[]>([]);
    const [selectedAccreditationPartners, setSelectedAccreditationPartners] = useState<string[]>([]);
    const [selectedClinicalObservershipPartners, setSelectedClinicalObservershipPartners] = useState<string[]>([]);

    // Selection states
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCourseType, setSelectedCourseType] = useState("");

    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Validation hook
    const [validationState, validationActions] = useFormValidation();

    const resetSelections = useCallback(() => {
        setSelectedCategory("");
        setSelectedCourseType("");
        setSelectedEligibilities([]);
        setKeywords("");
        setSelectedInstructors([]);
        setSelectedIntendedAudiences([]);
        setSelectedAccreditationPartners([]);
        setSelectedClinicalObservershipPartners([]);
    }, []);

    const fetchCourseSpecificData = useCallback(async (courseUuid: string) => {
        try {
            // Fetch course eligibilities
            const courseEligibilities = await getCourseEligibilities(courseUuid);
            if (Array.isArray(courseEligibilities)) {
                setSelectedEligibilities(courseEligibilities.map(e => e.uuid.toString()));
            } else {
                console.warn("Course eligibilities response is not an array:", courseEligibilities);
                setSelectedEligibilities([]);
            }

            // Fetch keywords
            const keywordList = await getCourseKeywords(courseUuid);
            if (Array.isArray(keywordList)) {
                setKeywords(keywordList
                    .map(k => k?.keyword_text || '')
                    .filter(text => text.length > 0)
                    .join(", ")
                );
            } else {
                console.warn("Course keywords response is not an array:", keywordList);
                setKeywords("");
            }

            // Fetch course settings
            const settings = await getCourseSettings(courseUuid);
            setCourseSettings(settings);

            // Fetch instructor links
            try {
                const instructorLinks = await getCourseInstructorLinks(courseUuid);
                if (Array.isArray(instructorLinks)) {
                    const instructorUuids = instructorLinks
                        .filter(link => link.CourseInstructor && link.CourseInstructor.uuid)
                        .map(link => link.CourseInstructor!.uuid);
                    setSelectedInstructors(instructorUuids);
                } else {
                    console.warn("Course instructor links response is not an array:", instructorLinks);
                    setSelectedInstructors([]);
                }
            } catch (err) {
                console.error("Error fetching course instructor links:", err);
                setSelectedInstructors([]);
            }

            // Fetch intended audiences
            try {
                const intendedAudiencesResponse = await getCourseIntendedAudiences(courseUuid);
                if (intendedAudiencesResponse.status === "success" && intendedAudiencesResponse.data?.intendedAudiences) {
                    const audienceIds = intendedAudiencesResponse.data.intendedAudiences.map((audience: { specialities_id: number }) =>
                        audience.specialities_id.toString()
                    );
                    setSelectedIntendedAudiences(audienceIds);
                }
            } catch (err) {
                console.error("Error fetching course intended audiences:", err);
                setSelectedIntendedAudiences([]);
            }


            // Fetch accreditation partners
            try {
                const courseAccreditationPartners = await getCourseAccreditationPartners(courseUuid);
                if (Array.isArray(courseAccreditationPartners)) {
                    const partnerUuids = courseAccreditationPartners.map(partner => partner.uuid);
                    setSelectedAccreditationPartners(partnerUuids);
                } else {
                    console.warn("Course accreditation partners response is not an array:", courseAccreditationPartners);
                    setSelectedAccreditationPartners([]);
                }
            } catch (err) {
                console.error("Error fetching course accreditation partners:", err);
                setSelectedAccreditationPartners([]);
            }

            // Fetch clinical observership partners
            try {
                const courseClinicalObservershipPartners = await getCourseClinicalObservershipPartners(courseUuid);
                if (Array.isArray(courseClinicalObservershipPartners)) {
                    const partnerUuids = courseClinicalObservershipPartners.map(partner => partner.uuid);
                    setSelectedClinicalObservershipPartners(partnerUuids);
                }   
                else {
                    console.warn("Course clinical observership partners response is not an array:", courseClinicalObservershipPartners);
                    setSelectedClinicalObservershipPartners([]);
                }
            }   
            catch (err) {
                console.error("Error fetching course-specific data:", err);
                setSelectedClinicalObservershipPartners([]);
            }
        } catch (err) {
            console.error("Error fetching course-specific data:", err);
            resetSelections();
        }
    }, [resetSelections]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch all static data
                const [
                    categoriesData,
                    courseTypesData,
                    eligibilitiesData,
                    coursesData,
                    instructorsData,
                    specialitiesData,
                    accreditationPartnersData,
                    clinicalObservershipData
                ] = await Promise.all([
                    getCoursesCategory(),
                    getCoursesType(),
                    getEligibilities(),
                    getCourses().catch((err: Error) => {
                        console.warn("Failed to fetch courses:", err);
                        return [] as Course[];
                    }),
                    getCourseInstructors().catch((err: Error) => {
                        console.warn("Failed to fetch instructors:", err);
                        return [] as Instructor[];
                    }),
                    getSpecialities().catch((err: Error) => {
                        console.warn("Failed to fetch specialities:", err);
                        return [] as Specialty[];
                    }),
                    getAccreditationPartners().catch((err: Error) => {
                        console.warn("Failed to fetch accreditation partners:", err);
                        return [];
                    }),
                    getClinicalObservershipPartners().catch((err: Error) => {
                        console.warn("Failed to fetch clinical observership partners:", err);
                        return [];
                    })
                ]);

                // Set static data
                setCategories(categoriesData);
                setCourseTypes(courseTypesData);
                setEligibilities(eligibilitiesData);
                setCourses(Array.isArray(coursesData) ? coursesData : []);
                setInstructors(Array.isArray(instructorsData) ? instructorsData : []);
                setSpecialities(Array.isArray(specialitiesData) ? specialitiesData : []);

                // Set accreditation options
                const accreditationPatternsList = [
                    { label: 'Select Accreditation Partners', value: '' },
                    ...accreditationPartnersData.map((partner: AccreditationPartner) => ({
                        label: partner.name,
                        value: partner.uuid ? String(partner.uuid) : partner.name
                    }))
                ];
                setAccreditationOptions(accreditationPatternsList);

                const clinicalObservershipList = [
                    { label: 'Select Clinical Observership Partners', value: '' },
                    ...clinicalObservershipData.map((partner: ClinicalObservershipPartner) => ({
                        label: partner.name,
                        value: partner.uuid ? String(partner.uuid) : partner.name
                    }))
                ];
                setClinicalObservershipOptions(clinicalObservershipList);

                // Handle course-specific data if editing
                if (courseData) {
                    // Set category and course type selections
                    const category = categoriesData.find(
                        (c: CourseCategory) => c.id === Number(courseData.category_id)
                    );
                    if (category) setSelectedCategory(category.name);

                    const courseType = courseTypesData.find(
                        (ct: CourseType) => ct.id === Number(courseData.course_type_id)
                    );
                    if (courseType) setSelectedCourseType(courseType.name);

                    // Fetch course-specific data if UUID exists
                    if (courseData.uuid) {
                        await fetchCourseSpecificData(courseData.uuid);
                    }
                } else {
                    // Reset selections for new course
                    resetSelections();
                }
            } catch (err) {
                console.error("Error fetching initial data:", err);
                setError("Failed to load course data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [courseData, fetchCourseSpecificData, resetSelections]);

    // Main update course handler
    const updateCourse = useCallback(async (originalCourseData: Partial<Course>, formData: Record<string, unknown>) => {
        if (!originalCourseData?.uuid) {
            throw new Error('Course UUID is required for update');
        }

        // Separate fields into courseData and courseSettings
        const { courseDataFields, courseSettingsFields } = separateFields(formData);


        // Check if fields have actually changed
        const hasCourseDataChanges = Object.keys(courseDataFields).some(key => 
            courseDataFields[key] !== originalCourseData[key as keyof Course]
        );
        
        const hasCourseSettingsChanges = Object.keys(courseSettingsFields).length > 0;

        // Validate based on what's changing
        let validationResult = { isValid: true, errors: [] as import("../utils/validation").ValidationError[] };
        
        if (hasCourseDataChanges || hasCourseSettingsChanges) {
            validationResult = validateCourseData(
                hasCourseDataChanges ? courseDataFields as Partial<Course> : {},
                hasCourseSettingsChanges ? courseSettingsFields as Partial<CourseSetting> : {}
            );
        }

        if (!validationResult.isValid) {
            console.error("Validation failed:", validationResult.errors);
            throw new Error(`Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
        }

        // Execute API calls based on what changed
        const promises: Promise<unknown>[] = [];

        // 1. Update course data if needed
        if (hasCourseDataChanges && Object.keys(courseDataFields).length > 0) {
            promises.push(UpdateCourse(originalCourseData.uuid!, courseDataFields as Partial<Course>));
        }

        // 2. Create or update course settings if needed
        if (hasCourseSettingsChanges && Object.keys(courseSettingsFields).length > 0) {
            // Decide based on whether course settings exist or not
            if (courseSettings) {
                // Course settings exist, so UPDATE
                promises.push(updateCourseSettings(courseSettings.uuid, courseSettingsFields as Partial<CourseSetting>));
            } else {
                // No course settings exist, so CREATE
                promises.push(createCourseSettings(originalCourseData.uuid!, courseSettingsFields as Partial<CourseSetting>));
            }
        }
        // 3. Update eligibilities if changed
        if (selectedEligibilities.length > 0) {
            promises.push(bulkCourseEligibility(originalCourseData.uuid!, selectedEligibilities));
        }
        // 4. Update instructor links if changed
        if (selectedInstructors.length > 0) {
            promises.push(bulkLinkInstructorsToCourse(originalCourseData.uuid!, selectedInstructors));
        }
        // 5. Update accreditation partners if changed
        if (selectedAccreditationPartners.length > 0) {
            promises.push(bulkCourseAccreditationPartners(originalCourseData.uuid!, selectedAccreditationPartners));
        }   
        // 6. Update clinical observership partners if changed
        if (selectedClinicalObservershipPartners.length > 0) {
            promises.push(bulkCourseClinicalObservershipPartners(originalCourseData.uuid!, selectedClinicalObservershipPartners));
        }

    }, [courseSettings, selectedEligibilities, selectedInstructors, selectedAccreditationPartners,selectedClinicalObservershipPartners]);

    const data: CourseSettingsData = {
        categories,
        courseTypes,
        eligibilities,
        courses,
        instructors,
        specialities,
        accreditationOptions,
        clinicalObservershipOptions,
        courseSettings,
        selectedEligibilities,
        keywords,
        selectedInstructors,
        selectedIntendedAudiences,
        selectedAccreditationPartners,
        selectedClinicalObservershipPartners,
        selectedCategory,
        selectedCourseType,
        isLoading,
        error,
        validation: validationState,
    };

    const actions: CourseSettingsActions = {
        setSelectedCategory,
        setSelectedCourseType,
        setSelectedEligibilities,
        setKeywords,
        setSelectedInstructors,
        setSelectedIntendedAudiences,
        setSelectedAccreditationPartners,
        setSelectedClinicalObservershipPartners,
        setCourseSettings,
        validation: validationActions,
        updateCourse,
    };

    return [data, actions];
}