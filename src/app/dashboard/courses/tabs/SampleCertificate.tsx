"use client";

import React, { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CourseSetting } from "@/types/coursesetting";
import { getCourseSettings, updateCourseSettings } from "@/lib/coursesetting-api";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import Select2 from "@/components/ui/Select2";
import { showToast } from "@/lib/toast";

interface CourseSampleCertificateProps {
    courseData?: Course | null;
}

interface CertificateItem {
    key: string;
    url: string;
}

export default function SampleCertificate(props: CourseSampleCertificateProps) {
    const [certificates, setCertificates] = useState<CertificateItem[]>([
        { key: "", url: "" }
    ]);
    const maxLimit = 4;
    const [courseSettings, setCourseSettings] = useState<CourseSetting | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const certificateOptions = [
        { label: 'Certificate', value: 'certificate_url' },
        { label: 'CPD Frontend', value: 'cpd_url' },
        { label: 'CPD Backend', value: 'cpdback_url' },
        { label: 'Other', value: 'other' },
    ];

    useEffect(() => {
        if (props.courseData?.uuid) {
            getCourseSettings(props.courseData.uuid).then(setCourseSettings);
        }
    }, [props.courseData?.uuid]);

    useEffect(() => {
        if (courseSettings?.samplecertificate?.length) {
            const items: CertificateItem[] = courseSettings.samplecertificate.flatMap((item) => {
                const result: CertificateItem[] = [];

                if (item.certificate_url && item.certificate_url.trim() !== "") {
                    result.push({ key: 'certificate_url', url: item.certificate_url });
                }
                if (item.cpd_url && item.cpd_url.trim() !== "") {
                    result.push({ key: 'cpd_url', url: item.cpd_url });
                }
                if (item.cpdback_url && item.cpdback_url.trim() !== "") {
                    result.push({ key: 'cpdback_url', url: item.cpdback_url });
                }
                if ((!item.certificate_url && !item.cpd_url && !item.cpdback_url)) {
                    result.push({ key: 'other', url: "" });
                }
                return result;
            });

            setCertificates(items.length ? items : [{ key: "", url: "" }]);
        }
    }, [courseSettings]);

    const handleAdd = () => {
        setCertificates([...certificates, { key: "", url: "" }]);
    };

    const handleRemove = (index: number) => {
        const updated = [...certificates];
        updated.splice(index, 1);
        setCertificates(updated);
    };

    const handleKeyChange = (index: number, value: string | string[]) => {
        const updated = [...certificates];
        updated[index].key = Array.isArray(value) ? value[0] || "" : value;
        setCertificates(updated);
    };

    const handleUrlChange = (index: number, value: string) => {
        const updated = [...certificates];
        updated[index].url = value;
        setCertificates(updated);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const updated = [...certificates];
        const draggedItem = updated[draggedIndex];
        updated.splice(draggedIndex, 1);
        updated.splice(index, 0, draggedItem);

        setDraggedIndex(index);
        setCertificates(updated);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };
    const handleUpdate = async () => {
        if (!courseSettings || !props.courseData) return;
        // Build object with all four keys, only set non-empty values, others as null
        const mergedCertificate: {
            certificate_url: string | null;
            cpd_url: string | null;
            cpdback_url: string | null;
            other: string | null;
        } = {
            certificate_url: null,
            cpd_url: null,
            cpdback_url: null,
            other: null,
        };

        certificates.forEach(item => {
            if (item.key === 'certificate_url' && item.url && item.url.trim() !== "") {
                mergedCertificate.certificate_url = item.url;
            }
            if (item.key === 'cpd_url' && item.url && item.url.trim() !== "") {
                mergedCertificate.cpd_url = item.url;
            }
            if (item.key === 'cpdback_url' && item.url && item.url.trim() !== "") {
                mergedCertificate.cpdback_url = item.url;
            }
            if (item.key === 'other' && item.url && item.url.trim() !== "") {
                mergedCertificate.other = item.url;
            }
        });

        // Set unused keys to undefined, then remove them in JSON.stringify
        const cleanedCertificate: {
            certificate_url?: string;
            cpd_url?: string;
            cpdback_url?: string;
            other?: string;
        } = {};
        if (mergedCertificate.certificate_url) cleanedCertificate.certificate_url = mergedCertificate.certificate_url;
        if (mergedCertificate.cpd_url) cleanedCertificate.cpd_url = mergedCertificate.cpd_url;
        if (mergedCertificate.cpdback_url) cleanedCertificate.cpdback_url = mergedCertificate.cpdback_url;
        if (mergedCertificate.other) cleanedCertificate.other = mergedCertificate.other;

        const updatedSettings = {
            course_uuid: props.courseData.uuid,
            samplecertificate: [cleanedCertificate]
        };

        // Custom replacer to remove undefined keys
        const replacer = (key: string, value: unknown) => (value === undefined ? undefined : value);
        const payload = JSON.parse(JSON.stringify(updatedSettings, replacer));

        const result = await updateCourseSettings(courseSettings.uuid, payload);
        setCourseSettings(result);
        showToast("Sample Certificate updated successfully", "success");

    }
    return (
        <>
            <div className="flex flex-col gap-4">
                {certificates.map((item, index) => (
                    <div
                        key={index}
                        className="flex gap-5 items-center p-2 rounded-md bg-white cursor-move"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        <Select2
                            options={certificateOptions}
                            className="w-64"
                            placeholder="Select Certificate Type"
                            value={item.key}
                            onChange={(value) => handleKeyChange(index, value)}
                        />
                        <Input
                            type="text"
                            placeholder="Enter URL of the Sample Certificate"
                            value={item.url}
                            className="border-0"
                            onChange={(e) => handleUrlChange(index, e.target.value)}
                        />
                        {index === certificates.length - 1 && certificates.length < maxLimit && (
                            <Plus
                                color="green"
                                className="border rounded-lg cursor-pointer"
                                onClick={handleAdd}
                            />
                        )}
                        {certificates.length > 1 && (
                            <Minus
                                color="red"
                                className="border rounded-lg cursor-pointer"
                                onClick={() => handleRemove(index)}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-2 text-sm text-gray-500">
                {certificates.length >= maxLimit
                    ? `You have reached the maximum limit of adding ${maxLimit} sample certificates.`
                    : `You can add ${maxLimit - certificates.length} more sample certificate${maxLimit - certificates.length !== 1 ? 's' : ''}.`}
            </div>
            <div className="flex justify-end mt-4">
                <Button variant="primaryBtn" onClick={handleUpdate}>Update</Button>
            </div>
        </>
    );
}