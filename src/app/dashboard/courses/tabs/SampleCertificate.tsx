'use client';

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { CourseSetting } from "@/types/coursesetting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select2 from "@/components/ui/Select2";
import { Plus, Minus } from "lucide-react";
import { getCourseSettings, updateCourseSettings } from "@/lib/coursesetting-api";
import { showToast } from "@/lib/toast";
import { console } from "inspector";

interface CourseCertificatesProps {
  courseData: Course;
}

interface CertificateItem {
  key: string;
  url: string;
}

export default function CourseCertificates({ courseData }: CourseCertificatesProps) {
  const [certificates, setCertificates] = useState<CertificateItem[]>([{ key: "", url: "" }]);
  const [courseSettings, setCourseSettings] = useState<CourseSetting | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const maxLimit = 4;

  const certificateOptions = [
    { label: 'Certificate', value: 'certificate_url' },
    { label: 'CPD Frontend', value: 'cpd_url' },
    { label: 'CPD Backend', value: 'cpdback_url' },
    { label: 'Other', value: 'other' },
  ];

  useEffect(() => {
    if (courseData?.uuid) {
      getCourseSettings(courseData.uuid).then(setCourseSettings);
    }
  }, [courseData?.uuid]);

  useEffect(() => {
    if (courseSettings?.samplecertificate?.length) {
      const items: CertificateItem[] = courseSettings.samplecertificate.flatMap((item: any) => {
        const result: CertificateItem[] = [];
        if (item.certificate_url) result.push({ key: 'certificate_url', url: item.certificate_url });
        if (item.cpd_url) result.push({ key: 'cpd_url', url: item.cpd_url });
        if (item.cpdback_url) result.push({ key: 'cpdback_url', url: item.cpdback_url });
        if (!item.certificate_url && !item.cpd_url && !item.cpdback_url) {
          result.push({ key: 'other', url: "" });
        }
        return result;
      });
      setCertificates(items.length ? items : [{ key: "", url: "" }]);
    }
  }, [courseSettings]);

  const handleAdd = () => {
    if (certificates.length < maxLimit) {
      setCertificates([...certificates, { key: "", url: "" }]);
    }
  };

  const handleRemove = (index: number) => {
    if (certificates.length > 1) {
      const updated = [...certificates];
      updated.splice(index, 1);
      setCertificates(updated);
    }
  };

  const handleUpdate = async () => {
    if (!courseSettings || !courseData) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mergedCertificate: any = {
      certificate_url: null,
      cpd_url: null,
      cpdback_url: null,
      other: null,
    };

    certificates.forEach(item => {
      if (item.url && item.url.trim()) {
        mergedCertificate[item.key] = item.url;
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanedCertificate: any = {};
    Object.entries(mergedCertificate).forEach(([key, value]) => {
      if (value) cleanedCertificate[key] = value;
    });

    const updatedSettings = {
      course_uuid: courseData.uuid,
      samplecertificate: [cleanedCertificate]
    };

    try {
      const result = await updateCourseSettings(courseSettings.uuid, updatedSettings);
      setCourseSettings(result);
      showToast("Sample certificates updated successfully", "success");
    } catch (error) {
      console.log("Failed to update certificates", error);
    }
  };

  return (
    <div className="space-y-4">
      {certificates.map((item, index) => (
        <div
          key={index}
          className="flex gap-3 items-center p-3 rounded-md bg-gray-50 border"
          draggable
          onDragStart={() => setDraggedIndex(index)}
          onDragEnd={() => setDraggedIndex(null)}
        >
          <Select2
            options={certificateOptions}
            className="w-64"
            placeholder="Select Certificate Type"
            value={item.key}
            onChange={(value) => {
              const updated = [...certificates];
              updated[index].key = value as string;
              setCertificates(updated);
            }}
          />
          <Input
            type="text"
            placeholder="Enter Certificate URL"
            value={item.url}
            onChange={(e) => {
              const updated = [...certificates];
              updated[index].url = e.target.value;
              setCertificates(updated);
            }}
            className="flex-1"
          />
          {index === certificates.length - 1 && certificates.length < maxLimit && (
            <Button size="icon" variant="outline" onClick={handleAdd}>
              <Plus className="w-4 h-4 text-green-600" />
            </Button>
          )}
          {certificates.length > 1 && (
            <Button size="icon" variant="outline" onClick={() => handleRemove(index)}>
              <Minus className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      ))}

      <div className="text-sm text-gray-500">
        {certificates.length >= maxLimit
          ? `You have reached the maximum limit of ${maxLimit} sample certificates.`
          : `You can add ${maxLimit - certificates.length} more certificate${maxLimit - certificates.length !== 1 ? 's' : ''}.`}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleUpdate}>
          Update Certificates
        </Button>
      </div>
    </div>
  );
}