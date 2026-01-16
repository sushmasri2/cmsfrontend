export interface Eligibility {
  id: string;
  uuid: string;
  name: string;
  description: string;
  course_id: string;
  eligibility_criteria: string;
  created_at: string;
  updated_at: string;
  // added fields used by UI and API
  position?: number | string;
  status?: number | boolean;
}   


export interface CourseEligibilityResponse {
  status: string;
  data: {
    course_uuid: string;
    eligibilities: {
      id: number;
      eligibility_uuid: string;
      eligibility_name: string;
      eligibility_status: number;
      created_at: string;
      updated_at: string;
    }[];
  };
}

// Request payload for creating a single eligibility
export interface CreateEligibilityPayload {
  name: string;
  position?: number;
  status?: boolean;
  // uuid may be sent when updating
  uuid?: string | null;
}
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}