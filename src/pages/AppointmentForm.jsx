import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "../components/ui/use-toast";
import { apiRequest } from "../components/CustomComponents/apiRequest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  MapPin,
  Phone,
  CalendarPlus,
  ClipboardPlus,
  Stethoscope,
  BadgeCheck,
  UserPlus,
} from "lucide-react";
import companyLogo from "../assets/logo_png.png";

const AppointmentForm = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    leadName: "",
    leadAge: "",
    leadGenderId: "",
    leadContactNo: "",
    confirmContact: "",
    leadAddress: "",
    leadMedicalHistory: "",
    referredByText: "",
  });

  const genderList = [
    { id: "6909f332cc5e03ca60c1eef3", genderName: "Male" },
    { id: "690ad5adf3fbf3eb0a5e498b", genderName: "Female" },
    { id: "690d788eaf1192eb5b523d6e", genderName: "Other" },
  ];
  const [referenceList, setReferenceList] = useState([]);
  const [link, setLink] = useState(window.location.href);
  const [sixdigit, setSixDigit] = useState("");
  useEffect(() => {
    getReferences();
  }, []);
  const getReferences = async () => {
    try {
      const res = await apiRequest("References/getALLReferences", {
        method: "POST",
        body: JSON.stringify({}),
      });

      setReferenceList(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching references:", error);
    }
  };
  const findMatchingReference = (inputText) => {
    if (!inputText?.trim()) return null;

    const normalizedInput = inputText.trim().toLowerCase();
    const inputWords = normalizedInput.split(/\s+/);

    return referenceList.find((ref) => {
      const dbName = ref.sourceName?.trim().toLowerCase();
      if (!dbName) return false;

      const dbWords = dbName.split(/\s+/);

      return (
        dbWords.every((word) => inputWords.includes(word)) ||
        inputWords.some((word) => dbWords.includes(word))
      );
    });
  };
  useEffect(() => {
    const digit = link.split("?");
    setSixDigit(digit[1] || "");
  }, [link]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!formData.leadName.trim()) {
      toast({
        title: "Alert",
        description: "Please enter patient name",
        variant: "destructive",
        className: "bg-red-600 text-white border-red-600",
      });
      return false;
    }

    if (!formData.leadAge) {
      toast({
        title: "Alert",
        description: "Please enter age",
        variant: "destructive",
        className: "bg-red-600 text-white border-red-600",
      });
      return false;
    }

    if (Number(formData.leadAge) <= 0) {
      toast({
        title: "Alert",
        description: "Please enter a valid age",
        variant: "destructive",
        className: "bg-red-600 text-white border-red-600",
      });
      return false;
    }

    if (!formData.leadContactNo) {
      toast({
        title: "Alert",
        description: "Please enter contact number",
        variant: "destructive",
        className: "bg-red-600 text-white border-red-600",
      });
      return false;
    }

    if (!/^\d{10}$/.test(formData.leadContactNo)) {
      toast({
        title: "Alert",
        description: "Contact number must be 10 digits",
        variant: "destructive",
        className: "bg-red-600 text-white border-red-600",
      });
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(formData.leadContactNo)) {
      toast({
        title: "Invalid number",
        description: "Enter a valid Indian mobile number",
        variant: "destructive",
        className: "bg-red-600 text-white border-red-600",
      });
      return false;
    }

    if (!formData.leadGenderId) {
      toast({
        title: "Alert",
        description: "Please select gender",
        variant: "destructive",
        className: "bg-red-600 text-white border-red-600",
      });
      return false;
    }

    if (!formData.leadAddress.trim()) {
      toast({
        title: "Alert",
        description: "Please enter location",
        variant: "destructive",
        className: "bg-red-600 text-white border-red-600",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const matchedReference = findMatchingReference(formData.referredByText);

    const payload = {
      leadName: formData.leadName.trim(),
      leadAge: Number(formData.leadAge),
      leadGenderId: formData.leadGenderId,
      leadContactNo: formData.leadContactNo,
      leadAddress: formData.leadAddress.trim(),
      leadMedicalHistory: formData.leadMedicalHistory.trim(),
      LeadStatusId: "691c06c97abd26fd38437215",
      isQualified: false,
      isExternal: true,
      cbDate: "",
      sixdigit: sixdigit,

      // if reference matched, send only reference
      ReferenceId: matchedReference?._id || null,
      sourceName:
        matchedReference?.sourceName || formData.referredByText.trim(),
    };

    // send Online source only when reference is NOT available
    if (!matchedReference) {
      payload.leadSourceId = "690d7691af1192eb5b523d63";
      payload.leadSourceName = "Online";
    }

    try {
      setLoading(true);

      const response = await apiRequest("Lead/createLead", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (
        response?.success === false &&
        response?.message === "EXISTING_NUMBER"
      ) {
        toast({
          title: "Alert",
          description: "This contact number already exists.",
          variant: "destructive",
        });
        return;
      }

      if (response?.success === false) {
        toast({
          title: "Alert",
          description: response?.message || "Failed to book appointment.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Appointment booked successfully.",
      });

      setFormData({
        leadName: "",
        leadAge: "",
        leadGenderId: "",
        leadContactNo: "",
        confirmContact: "",
        leadAddress: "",
        leadMedicalHistory: "",
        referredByText: "",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log(sixdigit, "SIXDIGIT");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#eff6ff_35%,_#f8fafc_78%)] px-4 py-6 sm:px-5 md:px-6 md:py-10">
      <div className="mx-auto max-w-4xl">
        <Card className="overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[32px] border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)] md:shadow-[0_25px_80px_rgba(15,23,42,0.10)]">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400" />

          <div className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50 px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex justify-center md:justify-start">
                  <div className="rounded-full bg-blue-50 px-4 py-2 text-center text-xs font-semibold text-blue-700 shadow-sm sm:px-5 sm:text-sm">
                    We Treat You At Home, At Your Comfort
                  </div>
                </div>

                <div className="flex justify-center md:justify-end">
                  <div className="rounded-full bg-blue-50 px-4 py-2 text-center text-xs font-semibold text-blue-700 shadow-sm sm:px-5 sm:text-sm">
                    We Are Changing Lives
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-[20px] border border-blue-100 bg-white shadow-md sm:h-24 sm:w-24 sm:rounded-[24px]">
                  <img
                    src={companyLogo}
                    alt="Neo Desk Logo"
                    className="h-[72px] w-[72px] object-contain sm:h-[100px] sm:w-[100px]"
                  />
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-blue-900 sm:text-3xl md:text-4xl">
                  Appointment Form
                </h1>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Fill the details below to book an appointment
                </p>
              </div>
            </div>
          </div>

          <CardContent className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:rounded-3xl sm:p-5 md:p-6">
                <div className="mb-5 flex items-start gap-3 sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 sm:h-11 sm:w-11">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Patient Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Enter the patient's basic details
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-slate-700">
                      Patient Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="leadName"
                      value={formData.leadName}
                      onChange={handleChange}
                      placeholder="Enter patient name"
                      className="h-11 rounded-2xl border-slate-300 bg-white shadow-sm sm:h-12 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium text-slate-700">
                      Age <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="leadAge"
                      value={formData.leadAge}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length > 2) return;
                        setFormData((prev) => ({
                          ...prev,
                          leadAge: value,
                        }));
                      }}
                      placeholder="Enter age"
                      className="h-11 rounded-2xl border-slate-300 bg-white shadow-sm sm:h-12 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5 md:p-6">
                <div className="mb-5 flex items-start gap-3 sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 sm:h-11 sm:w-11">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Contact Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Add contact and location details
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-slate-700">
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex overflow-hidden rounded-2xl shadow-sm">
                      <span className="flex h-11 items-center border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-700 sm:h-12 sm:px-4">
                        <Phone className="mr-2 h-4 w-4 text-blue-600" />
                        +91
                      </span>
                      <Input
                        name="leadContactNo"
                        value={formData.leadContactNo}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          setFormData((prev) => ({
                            ...prev,
                            leadContactNo: value,
                          }));
                        }}
                        placeholder="Enter mobile number"
                        className="h-11 rounded-none rounded-r-2xl border-slate-300 bg-white sm:h-12 focus-visible:ring-2 focus-visible:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium text-slate-700">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.leadGenderId}
                      onValueChange={(v) =>
                        handleSelectChange("leadGenderId", v)
                      }
                    >
                      <SelectTrigger className="h-11 rounded-2xl border-slate-300 bg-white px-4 shadow-sm sm:h-12 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        sideOffset={8}
                        className="z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
                      >
                        {genderList.map((g) => (
                          <SelectItem
                            key={g.id}
                            value={g.id}
                            className="cursor-pointer rounded-xl px-3 py-2 text-sm outline-none focus:bg-blue-50 focus:text-blue-700"
                          >
                            <div className="flex items-center gap-2">
                              <BadgeCheck className="h-4 w-4 text-blue-500" />
                              {g.genderName}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-5">
                  <Label className="mb-2 block text-sm font-medium text-slate-700">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      name="leadAddress"
                      value={formData.leadAddress}
                      onChange={handleChange}
                      placeholder="Enter location"
                      className="h-11 rounded-2xl border-slate-300 bg-white pl-11 shadow-sm sm:h-12 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:rounded-3xl sm:p-5 md:p-6">
                <div className="mb-5 flex items-start gap-3 sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 sm:h-11 sm:w-11">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Medical Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Add condition and referral information
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-slate-700">
                      Condition / Medical History
                    </Label>
                    <textarea
                      name="leadMedicalHistory"
                      value={formData.leadMedicalHistory}
                      onChange={handleChange}
                      placeholder="Enter patient condition or medical history"
                      className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-300 bg-white p-4 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500 sm:min-h-[130px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm font-medium text-slate-700">
                      Referred By
                    </Label>
                    <Input
                      name="referredByText"
                      value={formData.referredByText}
                      onChange={handleChange}
                      placeholder="Enter referrer name if available"
                      className="h-11 rounded-2xl border-slate-300 bg-white shadow-sm sm:h-12 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              <Button
                type="submit"
                className="h-11 w-full rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-sm font-semibold text-white shadow-lg transition hover:from-blue-800 hover:via-blue-700 hover:to-sky-600 sm:h-12 sm:text-base"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentForm;
