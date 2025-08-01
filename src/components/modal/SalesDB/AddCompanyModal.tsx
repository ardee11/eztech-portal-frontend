import { useState } from "react";
import { useAuth } from "../../../contexts/authContext";
import { useSalesAccounts } from "../../../hooks/useSalesDB";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddCompanyModal({ isOpen, onClose, onSuccess }: Props) {
  const { data, loading } = useSalesAccounts();
  const { user } = useAuth();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    contactNumber: "",
    emailAddress: "",
    companyAddress: "",
    remarks: "Potential",
  });

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
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    if (loading || !data) {
      setError("Company database is still loading. Please wait.");
      setLoadingSubmit(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/sales-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comp_name: formData.companyName,
          acc_manager: user?.name || user?.email || "",
          comp_person: formData.contactPerson,
          comp_email: formData.emailAddress,
          comp_number: formData.contactNumber,
          comp_address: formData.companyAddress,
          remarks: formData.remarks,
        }),
      });

      if (response.status === 409) {
        setError("This company already exists in the database.");
        setLoadingSubmit(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      // Success - reset form and close modal
      resetForm();
      onClose();
      onSuccess?.(); // Call success callback if provided
    } catch (error) {
      setError("There was an error submitting the form. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white animate-expand-card rounded-lg p-6 max-w-2xl max-h-100 flex flex-col">
        <div className="delay-show flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Add Company Details</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 hover:cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className="block text-xs font-medium mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="py-2 px-3 block w-full border border-gray-300 rounded-md text-xs focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Company Name"
                  required
                />
              </div>

              <div>
                <label htmlFor="companyAddress" className="block text-xs font-medium mb-2">
                  Company Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className="py-2 px-3 block w-full border border-gray-300 rounded-md text-xs focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Company Address"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactPerson" className="block text-xs font-medium mb-2">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="py-2 px-3 block w-full border border-gray-300 rounded-md text-xs focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Contact Person"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-xs font-medium mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="py-2 px-3 block w-full border border-gray-300 rounded-md text-xs focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Contact Number"
                />
              </div>

              <div>
                <label htmlFor="emailAddress" className="block text-xs font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  className="py-2 px-3 block w-full border border-gray-300 rounded-md text-xs focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <label htmlFor="remarks" className="block text-xs font-medium mb-2">
                  Remarks
                </label>
                <div className="relative">
                  <select
                    id="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="py-2 px-3 pe-9 block w-full appearance-none border border-gray-300 rounded-md text-xs focus:border-blue-500 focus:ring-blue-500"
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

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center space-x-14 pt-4 mt-auto">
              <button
                type="submit"
                disabled={loadingSubmit}
                className="px-10 py-2 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 hover:cursor-pointer disabled:opacity-50"
              >
                {loadingSubmit ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={loadingSubmit}
                className="px-10 py-2 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:cursor-pointer disabled:opacity-50"
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
