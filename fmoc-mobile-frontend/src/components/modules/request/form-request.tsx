"use client";

import CameraCapture from "@/components/cam/camera-capture";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import Input from "../../ui/input";


const categories = { BBMMobil: 0, BBMMotor: 1, Parkir: 2, Toll: 3 } as const;
type CategoryType = keyof typeof categories;
const initialFormData = {
  wo: "",
  userId: "",
  nominal: "",
  description: "",
  imgData: null as string | null,
  latitude: null as number | null,
  longitude: null as number | null,
  category: "BBMMobil" as CategoryType,
  transactionDate: "",
};

function formatRupiah(value: string): string {
  const number = parseInt(value.replace(/\D/g, ""), 10);
  if (isNaN(number)) return "";
  // const adjusted = number / 10; // bagi 10
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(number);
}

export default function FormRequest() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [previewInvoice, setPreviewInvoice] = useState<string | null>(null);
  const [imgKey, setImgKey] = useState<number>(Date.now());
  const [showCamera, setShowCamera] = useState(false);
  const router = useRouter();
  // Load saved formData on mount
  useEffect(() => {
    const saved = localStorage.getItem("formData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        if (parsed.imgData) setPreviewInvoice(parsed.imgData);
      } catch {
        console.error("Failed to parse saved formData");
      }
    }
  }, []);

  // Clear saved formData when route changes
  useEffect(() => {
    localStorage.removeItem("formData");
    setFormData(initialFormData);
    setPreviewInvoice(null);
  }, [pathname]);

  // Persist formData
  const saveForm = (data: typeof formData) => {
    localStorage.setItem("formData", JSON.stringify(data));
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    
    const { name, value } = e.target;
    let cleanedValue = "";
    if (name === "nominal") {
      cleanedValue = value.replace(/[^0-9.]/g, "");
      }
      
    const updated = {
      ...formData,
      [name]: name === "nominal" ? cleanedValue : value,
    };
    
    setFormData(updated);
    saveForm(updated);
  };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = {
      ...formData,
      [name]: name === "nominal" ? formatRupiah(value): value,
    };
    setFormData(updated);
    saveForm(updated);
  };

  const handleFocus = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
      let cleanedValue = "";
      if (name === "nominal") {
        cleanedValue = value.replace(/[^0-9.]/g, "");
        }
        
      const updated = {
        ...formData,
        [name]: name === "nominal" ? cleanedValue.slice(0,-2) : value,
      };
      
      setFormData(updated);
      saveForm(updated);
  };

  // Camera capture callback
  const handleCaptureComplete = (captureData: { imageData: string; lat: number | null; lon: number | null }) => {
    const { imageData, lat, lon } = captureData;
    const updated = {
      ...formData,
      imgData: imageData,
      latitude: lat,
      longitude: lon,
    };
    setFormData(updated);
    setPreviewInvoice(imageData);
    saveForm(updated);
    setImgKey(Date.now());
  };

  const formatDate = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours(),
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.imgData) {
      toast.error("Upload bukti invoice sebelum dikirimkan.");
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.UUID;
      const beforeComma = formData.nominal.split(',')[0];
      const cleanedNominal = beforeComma.replace(/[^0-9]/g, "");
      const body = {
        wo: formData.wo,
        userId,
        nominal: cleanedNominal,
        description: formData.description,
        imgData: formData.imgData,
        latitude: formData.latitude,
        longitude: formData.longitude,
        category: categories[formData.category],
        transactionDate: formatDate(new Date(formData.transactionDate)),
        submissionDate: formatDate(new Date()),
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/request/manage/add`,
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Pengajuan dana berhasil diajukan.");
      localStorage.removeItem("formData");
      setFormData(initialFormData);
      setPreviewInvoice(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      const data = axiosError.response?.data as { message: string };
      const errorMessage = data?.message || "Unknown error";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      // route to home with next
      router.push("/home");
    }
  };

  return (
    <div className="p-7 relative">
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full h-full">
            <CameraCapture
              onCaptureComplete={handleCaptureComplete}
              onClose={() => setShowCamera(false)}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* WO */}
        <div className="flex flex-col">
          <p className="text-xs sm:text-sm mt-1 font-semibold">
            WO<span className="text-danger">*</span>
          </p>
          <Input name="wo" value={formData.wo} onChange={handleChange} required />
        </div>

        {/* Nominal */}
        <div className="flex flex-col">
          <p className="text-xs sm:text-sm mt-1 font-semibold">
            Nominal<span className="text-danger">*</span>
          </p>
          <Input name="nominal" value={formData.nominal} type="text"
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus} 
          required />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <p className="text-xs sm:text-sm mt-1 font-semibold">
            Kategori<span className="text-danger">*</span>
          </p>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded-md p-2 bg-accent-base"
          >
            {Object.entries(categories).map(([cat, v]) => (
              <option key={v} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Bukti Invoice */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm mt-1 font-semibold">
              Bukti Pengajuan Dana<span className="text-danger">*</span>
            </p>
            <Button className="text-xs sm:text-sm mt-1" type="button" variant="primary" onClick={() => setShowCamera(true)}>
                Foto
            </Button>
          </div>
          <div className="bg-accent-base mt-2  rounded flex justify-center shadow overflow-hidden">
            {previewInvoice ? (
                <img
                key={imgKey}
                src={`data:image/jpeg;base64,${previewInvoice}`}// assuming href URL, not base64
                alt="Image Data"
                className="w-full h-[200px] object-cover"
                />
       
            ) : (
              <div className="w-[240px] h-[80px] flex items-center justify-center text-gray-400">
                Belum Ada Bukti Pengajuan
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <Button className="text-xs sm:text-sm mt-1" type="submit" variant="primary" disabled={loading}>
            {loading ? "Mengajukan..." : "Ajukan Dana"}
          </Button>
        </div>
      </form>
    </div>
  );
}
