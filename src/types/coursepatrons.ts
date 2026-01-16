export interface CoursePatron extends Record<string, unknown> {
    id: number;
    uuid: string;
    course_id: number;
    image: string;
    name: string;
    designation: string;
    created_at: string;
    updated_at: string;
    course: {
        uuid: string;
        course_name: string;
        title: string;
    };
    languages: unknown[];
}

export interface CoursePatronsResponse {
    status: string;
    data: {
        course_uuid: string;
        course_name: string;
        patrons: CoursePatron[];
    };
}

export interface CreatePatronData extends UpdatePatronData {
    course_uuid: string
}
export interface UpdatePatronData {
    name: string;
    designation: string;
    image: string;
}


export interface PatronApiResponse {
    status: string; 
    message: string;
    data?: CoursePatron;
}
