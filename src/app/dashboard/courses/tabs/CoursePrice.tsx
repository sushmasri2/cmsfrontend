'use client';

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { CoursePricing as PricingType } from "@/types/course-pricing";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "../shared/ValidatedInput";
import { useCourseUpdate } from "../hooks/useCourseUpdate";
import { useUnifiedValidation } from "../hooks/useUnifiedValidation";
import {getCoursePricing} from "@/lib/courseprice-api"

interface CoursePricingProps {
  courseData: Course;
}

export default function CoursePricing({ courseData }: CoursePricingProps) {
  const [pricingINR, setPricingINR] = useState<PricingType | null>(null);
  const [pricingUSD, setPricingUSD] = useState<PricingType | null>(null);
  const [formDataINR, setFormDataINR] = useState<Partial<PricingType>>({});
  const [formDataUSD, setFormDataUSD] = useState<Partial<PricingType>>({});

  const { mutate: updateCourse, isPending } = useCourseUpdate();
  const { validateTab, getFieldError, validateSingleField } = useUnifiedValidation();

  useEffect(() => {
    if (courseData?.uuid) {
      getCoursePricing(courseData.uuid).then(data => {
        const inr = data.find((p: PricingType) => p.currency === "INR") || null;
        const usd = data.find((p: PricingType) => p.currency === "USD") || null;
        
        setPricingINR(inr);
        setPricingUSD(usd);
        setFormDataINR(inr || {});
        setFormDataUSD(usd || {});
      });
    }
  }, [courseData?.uuid]);

  const handleINRChange = (field: keyof PricingType, value: string) => {
    setFormDataINR(prev => ({ ...prev, [field]: value }));
    validateSingleField(field, value);
  };

  const handleUSDChange = (field: keyof PricingType, value: string) => {
    setFormDataUSD(prev => ({ ...prev, [field]: value }));
    validateSingleField(field, value);
  };

  const handleSave = () => {
    if (!courseData?.uuid) return;

    const allData = { ...formDataINR, ...formDataUSD };
    const validation = validateTab.validatePricing(allData);

    if (!validation.isValid) return;

    updateCourse({
      courseUuid: courseData.uuid,
      data: { ...formDataINR, ...formDataUSD },
    });
  };

  const formatDate = (iso?: string | null): string => {
    if (!iso) return "";
    if (iso.includes("T")) return iso.split("T")[0];
    try {
      const d = new Date(iso);
      return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  if (courseData?.no_price === 1) {
    return (
      <div className="p-8 text-center text-gray-600">
        <p>This is a free course. No pricing information needed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INR Pricing */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Indian Rupees (₹)</h2>
          <div className="space-y-4">
            <ValidatedInput
              label="Current Price"
              type="number"
              value={formDataINR?.price?.toString() || ""}
              onChange={(e) => handleINRChange('price', e.target.value)}
              error={getFieldError('price')}
              placeholder="Enter price in INR"
            />
            <ValidatedInput
              label="Future Price"
              type="number"
              value={formDataINR?.future_price?.toString() || ""}
              onChange={(e) => handleINRChange('future_price', e.target.value)}
              error={getFieldError('future_price')}
              placeholder="Enter future price"
            />
            <ValidatedInput
              label="Future Price Effective Date"
              type="date"
              value={formatDate(formDataINR?.future_price_effect_from as string)}
              onChange={(e) => handleINRChange('future_price_effect_from', e.target.value)}
              error={getFieldError('future_price_effect_from')}
            />
            <ValidatedInput
              label="Extended Validity Price"
              type="number"
              value={formDataINR?.extended_validity_price?.toString() || ""}
              onChange={(e) => handleINRChange('extended_validity_price', e.target.value)}
              error={getFieldError('extended_validity_price')}
            />
            <ValidatedInput
              label="Major Update Price"
              type="number"
              value={formDataINR?.major_update_price?.toString() || ""}
              onChange={(e) => handleINRChange('major_update_price', e.target.value)}
              error={getFieldError('major_update_price')}
            />
          </div>
        </div>

        {/* USD Pricing */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">International ($)</h2>
          <div className="space-y-4">
            <ValidatedInput
              label="Current Price"
              type="number"
              value={formDataUSD?.price?.toString() || ""}
              onChange={(e) => handleUSDChange('price', e.target.value)}
              error={getFieldError('price')}
              placeholder="Enter price in USD"
            />
            <ValidatedInput
              label="Future Price"
              type="number"
              value={formDataUSD?.future_price?.toString() || ""}
              onChange={(e) => handleUSDChange('future_price', e.target.value)}
              error={getFieldError('future_price')}
              placeholder="Enter future price"
            />
            <ValidatedInput
              label="Future Price Effective Date"
              type="date"
              value={formatDate(formDataUSD?.future_price_effect_from as string)}
              onChange={(e) => handleUSDChange('future_price_effect_from', e.target.value)}
              error={getFieldError('future_price_effect_from')}
            />
            <ValidatedInput
              label="Extended Validity Price"
              type="number"
              value={formDataUSD?.extended_validity_price?.toString() || ""}
              onChange={(e) => handleUSDChange('extended_validity_price', e.target.value)}
              error={getFieldError('extended_validity_price')}
            />
            <ValidatedInput
              label="Major Update Price"
              type="number"
              value={formDataUSD?.major_update_price?.toString() || ""}
              onChange={(e) => handleUSDChange('major_update_price', e.target.value)}
              error={getFieldError('major_update_price')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {
          setFormDataINR(pricingINR || {});
          setFormDataUSD(pricingUSD || {});
        }}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Pricing'}
        </Button>
      </div>
    </div>
  );
}
