"use client";

import Select2 from "@/components/ui/Select2";
import { Course } from "@/types/course";
import { CourseSettingsPartialFormData } from "@/types/course-settings-form";
import { CourseSettingsData, CourseSettingsActions } from "../hooks/useCourseSettingsData";
import { ValidatedTextarea } from "../shared/ValidatedTextarea";

interface AccreditationComplianceProps {
    courseData?: Course | null;
    formData: CourseSettingsPartialFormData;
    data: CourseSettingsData;
    actions: CourseSettingsActions;
    onInputChange: (field: keyof CourseSettingsPartialFormData, value: string | number | boolean | string[]) => void;
}

export default function AccreditationCompliance({
    data,
    actions,
    onInputChange,
    formData
}: AccreditationComplianceProps) {
    const {
        courseSettings, courses,
        specialities,
        accreditationOptions,
        clinicalObservershipOptions,
        selectedAccreditationPartners,
        selectedIntendedAudiences,
        selectedClinicalObservershipPartners
    } = data;

    const {
        setSelectedIntendedAudiences,
        setSelectedAccreditationPartners,
        setSelectedClinicalObservershipPartners,
        validation: validationActions
    } = actions;

    return (
        <div className="px-5 py-3">
            <div>
                <ValidatedTextarea
                    label="Accreditation"
                    className="mb-4 px-3 py-2"
                    value={typeof formData?.accreditation === "string" ? formData.accreditation : (courseSettings?.accreditation || "")}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const value = e.target.value;
                        onInputChange('accreditation', value);
                        validationActions.validateSingleField('accreditation', value);
                    }}
                    error={validationActions.getFieldError('accreditation')}
                    placeholder="Enter Accreditation"
                    rows={3}
                />
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <label className="text-lg font-medium m-2">Accreditation Partners</label>
                    <Select2
                        options={accreditationOptions}
                        multiple={true}
                        value={selectedAccreditationPartners}
                        onChange={(val: string | string[]) => {
                            if (Array.isArray(val)) {
                                setSelectedAccreditationPartners(val);
                                onInputChange('accreditation_partners', val);
                            }
                        }}
                        placeholder="Select Accreditation Partners"
                        style={{ padding: '0.6rem' }}
                    />
                </div>
                <div>
                    <label className="text-lg font-medium m-2">Clinical Observership Partners</label>
                    <Select2
                        options={clinicalObservershipOptions}
                        multiple={true}
                        value={selectedClinicalObservershipPartners}
                        onChange={(val: string | string[]) => {
                            if (Array.isArray(val)) {
                                setSelectedClinicalObservershipPartners(val);
                                onInputChange('clinical_observership_partners', val);
                            }
                        }}
                        placeholder="Select Clinical Observership Partners"
                        style={{ padding: '0.6rem' }}
                    />
                </div>
                <div>
                    <label className="text-lg font-medium m-2">Intended Audience</label>
                    <Select2
                        options={[
                            ...specialities.map(specialty => ({
                                label: specialty.name,
                                value: specialty.id.toString()
                            }))
                        ]}
                        value={selectedIntendedAudiences}
                        onChange={(val: string | number | (string | number)[]) => {
                            if (Array.isArray(val)) {
                                // Ensure all values are strings
                                const stringVals = val.map(v => v.toString());
                                setSelectedIntendedAudiences(stringVals);
                                onInputChange('intended_audiences', stringVals);
                            }
                        }}
                        multiple={true}
                        placeholder="Select Intended Audience"
                        style={{ padding: '0.6rem' }}
                    />
                </div>
                <div>
                    <label className="text-lg font-medium m-2">Child Course</label>
                    <Select2
                        options={[
                            { label: 'Select Child Course', value: '' },
                            ...courses
                                .filter(c => !formData || c.uuid !== formData.uuid)
                                .map(c => ({
                                    label: c.course_name || c.title || `Course #${c.id}`,
                                    value: c.uuid || String(c.id)
                                }))
                        ]}
                        value={
                            // First try to get from formData.children_course, then fall back to courseSettings.children_course
                            (() => {
                                const selectedChild = typeof formData.children_course === 'string' ? formData.children_course :
                                    (courseSettings && typeof courseSettings.children_course === 'string' ? courseSettings.children_course : '');
                                return selectedChild;
                            })()
                        }
                        onChange={(val: string | string[]) => {
                            if (typeof val === 'string') {
                                onInputChange('children_course', val);
                            }
                        }}
                        placeholder="Select Child Course"
                        style={{ padding: '0.6rem' }}
                    />
                </div>
                <div>
                    <label className="text-lg font-medium m-2">Course Eligibility</label>
                    <Select2
                        options={data.eligibilities.length > 0 ?
                            data.eligibilities.map(eligibility => ({
                                label: eligibility.name,
                                value: eligibility.uuid.toString()
                            }))
                            : []
                        }
                        value={data.selectedEligibilities}
                        onChange={(val: string | string[]) => {
                            if (Array.isArray(val)) {
                                actions.setSelectedEligibilities(val);
                                onInputChange('eligibility_ids', val);
                            }
                        }}
                        multiple={true}
                        placeholder="Select Eligibilities"
                        style={{ padding: '0.6rem' }}
                    />
                </div>
            </div>
        </div>
    );
}