export interface ClinicalObservershipPartner {
  id: string;
  uuid: string;
  name: string;
  image_url: string;
  position: number;
  created_at: string;
  updated_at: string;
}   

export interface ClinicalObservershipResponse {
  data: ClinicalObservershipPartner[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface CourseClinicalObservershipPartnerItem {
  id: number;
  course_id: number;
  clinical_observership_partner_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  ClinicalObservershipPartner: {
    id: number;
    uuid: string;
    name: string;
    image_url: string;
    position: number;
  };
}