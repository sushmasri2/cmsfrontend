import { CoursePatronsResponse, PatronApiResponse, CreatePatronData,UpdatePatronData } from "@/types/coursepatrons";
import { fetchWithHeaders } from "./api-client";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_COURSE || '';

export async function getCoursesPatrons(courseUuid: string): Promise<CoursePatronsResponse | null> {
    try {
        const fullUrl = `${baseUrl}/api/course-patrons/${courseUuid}/`;

        const response = await fetchWithHeaders(fullUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json() as CoursePatronsResponse;

        if (result.status === "success" && result.data) {
            return result;
        } else {
            throw new Error("Unexpected response structure");
        }

    } catch (error) {
        console.error("Error fetching course patrons:", error);
        throw error;
    }
}

export async function createPatron(patronData: CreatePatronData): Promise<PatronApiResponse> {
    try {
        const fullUrl = `${baseUrl}/api/course-patrons/`;

        const response = await fetchWithHeaders(fullUrl, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patronData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json() as PatronApiResponse;
        return result;

    } catch (error) {
        console.error("Error creating patron:", error);
        throw error;
    }
}

// FIXED: Removed extra wrapper and simplified interface
export async function updatePatron(
    patronUuid: string, 
    patronData: Omit<UpdatePatronData, 'course_uuid'>
): Promise<PatronApiResponse> {
    try {
        const fullUrl = `${baseUrl}/api/course-patrons/${patronUuid}/`;

        const response = await fetchWithHeaders(fullUrl, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patronData), // FIXED: No wrapper
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json() as PatronApiResponse;
        return result;

    } catch (error) {
        console.error("Error updating patron:", error);
        throw error;
    }
}

// FIXED: Corrected signature to only need patronUuid
export async function deletePatron(patronUuid: string): Promise<PatronApiResponse> {
    try {
        const fullUrl = `${baseUrl}/api/course-patrons/${patronUuid}/`;

        const response = await fetchWithHeaders(fullUrl, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json() as PatronApiResponse;
        return result;

    } catch (error) {
        console.error("Error deleting patron:", error);
        throw error;
    }
}