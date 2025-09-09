import { useState } from "react";
import { useAuth } from "../../../contexts/authContext";
import { useSalesAccounts } from "../../../hooks/useSalesDB";
import { showToast } from "../../../utils/toastUtils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddCompanyModal({ isOpen, onSuccess, onClose }: Props) {
  const { data, loading, addCompany } = useSalesAccounts();
  const { user } = useAuth();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    contactNumber: "",
    emailAddress: "",
    companyAddress: "",
    remarks: "Potential",
  });

  const isFormValid = () => {
    return formData.companyName.trim() !== "" && 
           formData.companyAddress.trim() !== "" && 
           formData.contactPerson.trim() !== "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      contactPerson: "",
      contactNumber: "",
      emailAddress: "",
      companyAddress: "",
      remarks: "Potential",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    if (loading || !data) {
      showToast("Database is still loading.", "error");
      setLoadingSubmit(false);
      return;
    }

    const companyData = {
      comp_name: formData.companyName,
      acc_manager: user?.name || user?.email || "",
      comp_person: formData.contactPerson,
      comp_email: formData.emailAddress,
      comp_number: formData.contactNumber,
      comp_address: formData.companyAddress,
      remarks: formData.remarks,
    };

    try {
      await addCompany(companyData);
      showToast("Company details added successfully!", "success");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error.status === 409) {
        showToast(error.message, "error");
      } else {
        showToast("There was an error adding company details. Please try again.", "error");
      }
    } finally {
      handleClose();
      setLoadingSubmit(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white animate-expand-card rounded-lg px-8 py-6 max-w-3xl 3xl:max-w-4xl max-h-110 3xl:max-h-116 flex flex-col">
        <div className="delay-show flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg 3xl:text-xl font-bold text-gray-900">Add Company Details</h3>

            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 hover:cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form id="addCompany" onSubmit={handleSubmit} className="px-6 flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label htmlFor="companyName" className="block text-xs 3xl:text-sm font-medium mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="py-2 px-3 block w-full border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Company Name"
                  required
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="companyAddress" className="block text-xs 3xl:text-sm font-medium mb-2">
                  Company Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyAddress"
                  name="no-companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  autoComplete="new-company-address"
                  className="py-2 px-3 block w-full border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Company Address"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactPerson" className="block text-xs 3xl:text-sm font-medium mb-2">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="no-contact-person"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="py-2 px-3 block w-full border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Contact Person"
                  required
                  autoComplete="new-contact-person"
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-xs 3xl:text-sm font-medium mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="no-contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="py-2 px-3 block w-full border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Contact Number"
                  autoComplete="new-contact-number"
                />
              </div>

              <div>
                <label htmlFor="emailAddress" className="block text-xs 3xl:text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  className="py-2 px-3 block w-full border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Email Address"
                  autoComplete="new-email-address"
                />
              </div>

              <div>
                <label htmlFor="remarks" className="block text-xs 3xl:text-sm font-medium mb-2">
                  Remarks
                </label>
                <div className="relative">
                  <select
                    id="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="py-2 px-3 pe-9 block w-full appearance-none border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500 hover:cursor-pointer"
                  >
                    <option value="Potential">Potential</option>
                    <option value="Active">Active</option>
                    <option value="Open">Open</option>
                    <option value="Government">Government</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-auto">
              <button
                type="submit"
                disabled={loadingSubmit || !isFormValid()}
                className="px-12 py-2 text-xs 3xl:text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 hover:cursor-pointer"
              >
                {loadingSubmit ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={loadingSubmit}
                className="px-10 py-2 text-xs 3xl:text-sm font-medium text-gray-700 border border-gray-500 bg-white rounded-md hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
