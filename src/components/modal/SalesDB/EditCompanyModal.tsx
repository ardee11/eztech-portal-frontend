import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/authContext";
import { useSalesAccounts, SalesAccount } from "../../../hooks/useSalesDB";
import { useAccountManagers } from "../../../hooks/useAdmin";
import { showToast } from "../../../utils/toastUtils";
import InputDropdown from "../../elements/InputDropdown";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  companyId: number;
};

export default function EditCompanyModal({ isOpen, companyId, onSuccess, onClose }: Props) {
  const { userRole } = useAuth();
  const { accountManagers } = useAccountManagers();
  const { data, loading, updateSalesAccount } = useSalesAccounts();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<SalesAccount | null>(null);
  const allowedRoles = ["Admin", "Sales Manager", "Super Admin"];
  
  const canEditAccountManager = userRole?.some(role => allowedRoles.includes(role)) ?? false;

  const [formData, setFormData] = useState({
    comp_name: "",
    comp_person: "",
    comp_number: "",
    comp_email: "",
    acc_manager: "",
    comp_address: "",
    remarks: "Open",
  });

  const isFormValid = () => {
    return formData.comp_name.trim() !== "" && 
           formData.comp_address.trim() !== "" && 
           formData.comp_person.trim() !== "";
  };

  useEffect(() => {
    if (!loading && data && companyId && isOpen) {
      const match = data.find((account) => account.comp_id === companyId);
  
      if (match) {
        setSelectedCompany(match);
        setFormData({
          comp_name: match.comp_name,
          comp_person: match.comp_person,
          comp_number: match.comp_number,
          comp_email: match.comp_email,
          acc_manager: match.acc_manager,
          comp_address: match.comp_address,
          remarks: match.remarks,
        });
      }
    }
  }, [loading, data, companyId, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isFormDataUnchanged = () => {
    if (!selectedCompany) return true;

    return (
      formData.comp_name === selectedCompany.comp_name &&
      formData.comp_person === selectedCompany.comp_person &&
      formData.comp_number === selectedCompany.comp_number &&
      formData.comp_email === selectedCompany.comp_email &&
      formData.acc_manager === selectedCompany.acc_manager &&
      formData.comp_address === selectedCompany.comp_address &&
      formData.remarks === selectedCompany.remarks
    );
  };

  const resetForm = () => {
    setFormData({
      comp_name: "",
      comp_person: "",
      comp_number: "",
      comp_email: "",
      acc_manager: "",
      comp_address: "",
      remarks: "Open",
    });
    setSelectedCompany(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    if (!selectedCompany) {
      setLoadingSubmit(false);
      return;
    }

    if (isFormDataUnchanged()) {
      setLoadingSubmit(false);
      return;
    }

    const payload: Partial<SalesAccount> = {};
    if (formData.comp_name !== selectedCompany.comp_name) {
      payload.comp_name = formData.comp_name;
    }
    if (formData.comp_person !== selectedCompany.comp_person) {
      payload.comp_person = formData.comp_person;
    }
    if (formData.comp_number !== selectedCompany.comp_number) {
      payload.comp_number = formData.comp_number;
    }
    if (formData.comp_email !== selectedCompany.comp_email) {
      payload.comp_email = formData.comp_email;
    }
    if (formData.acc_manager !== selectedCompany.acc_manager) {
      payload.acc_manager = formData.acc_manager;
    }
    if (formData.comp_address !== selectedCompany.comp_address) {
      payload.comp_address = formData.comp_address;
    }
    if (formData.remarks !== selectedCompany.remarks) {
      payload.remarks = formData.remarks;
    }

    try {
      await updateSalesAccount(selectedCompany.comp_id, payload);
      if (onSuccess) onSuccess();
      showToast("Company details updated successfully!", "success");
    } catch (error) {
      showToast("There was an error updating the company details. Please try again.", "error");
    } finally {
      resetForm();
      onClose();
      setLoadingSubmit(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center">
      <div className="bg-white animate-expand-card rounded-lg px-8 py-6 max-w-3xl 3xl:max-w-4xl max-h-116 3xl:max-h-130 flex flex-col">
        <div className="delay-show flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg 3xl:text-xl font-bold text-gray-900">Edit Company Details</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 hover:cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-xs text-gray-800 mt-2">Loading data...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 flex flex-col h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {canEditAccountManager && (
                  <div>
                    <label htmlFor="acc_manager" className="block text-xs 3xl:text-sm font-medium mb-2">
                      Account Manager
                    </label>
                    <div className="relative">
                      <InputDropdown
                        value={formData.acc_manager}
                        onChange={(val) => setFormData((prev) => ({ ...prev, acc_manager: val ?? "" }))}
                        options={accountManagers}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="comp_name" className="block text-xs 3xl:text-sm font-medium mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="comp_name"
                    value={formData.comp_name}
                    onChange={handleChange}
                    className="py-2 px-3 block w-full border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Company Name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="comp_address" className="block text-xs 3xl:text-sm font-medium mb-2">
                    Company Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="comp_address"
                    value={formData.comp_address}
                    onChange={handleChange}
                    className="py-2 px-3 block w-full border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Company Address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="comp_person" className="block text-xs 3xl:text-sm font-medium mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="comp_person"
                    value={formData.comp_person}
                    onChange={handleChange}
                    className="py-2 px-3 block w-full border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Contact Person"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="comp_number" className="block text-xs 3xl:text-sm font-medium mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    id="comp_number"
                    value={formData.comp_number}
                    onChange={handleChange}
                    className="py-2 px-3 block w-full border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Contact Number"
                  />
                </div>

                <div>
                  <label htmlFor="comp_email" className="block text-xs 3xl:text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="comp_email"
                    value={formData.comp_email}
                    onChange={handleChange}
                    className="py-2 px-3 block w-full border border-gray-500 rounded-md text-xs 3xl:text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Email Address"
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
                      <option value="Open">Open</option>
                      <option value="Potential">Potential</option>
                      <option value="Active">Active</option>
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

              <div className="flex justify-center space-x-14 mt-auto">
                <button
                  type="submit"
                  disabled={loadingSubmit || !isFormValid() || isFormDataUnchanged()}
                  className="px-12 py-2 text-xs 3xl:text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 hover:cursor-pointer"
                >
                  {loadingSubmit ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loadingSubmit}
                  className="px-10 py-2 text-xs 3xl:text-sm font-medium text-gray-700 border border-gray-400 rounded-md hover:bg-gray-100 hover:cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 