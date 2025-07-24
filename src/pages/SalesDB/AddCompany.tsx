import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { useSalesAccounts } from "../../hooks/useSalesDB";

export default function AddCompany() {
  const navigate = useNavigate();
  const { data, loading } = useSalesAccounts();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
  
    if (loading || !data) {
      alert("Company database is still loading. Please wait.");
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
        alert("This company already exists in the database.");
        setLoadingSubmit(false);
        return;
      }
  
      if (!response.ok) {
        throw new Error("Failed to submit");
      }
  
      alert("Company details added successfully!");
      setFormData({
        companyName: "",
        contactPerson: "",
        contactNumber: "",
        emailAddress: "",
        companyAddress: "",
        remarks: "Potential",
      });
    } catch (error) {
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };  
  
  return (
    <div className="max-w-[85rem] px-6 py-3">
      <div className="flex items-center mb-4 space-x-2">
        <div
          onClick={() => navigate(-1)}
          className="cursor-pointer hover:bg-gray-100 rounded-full p-2 hidden sm:hidden lg:block"
        >
          <svg className="w-5 h-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 5H1m0 0 4 4M1 5l4-4" />
          </svg>
        </div>
        <p className="text-lg font-semibold">Add Company Details</p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-400 rounded-lg bg-white p-10 mx-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Company Name"
              required
            />
          </div>

          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium mb-2">
              Company Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Company Address"
              required
            />
          </div>

          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium mb-2">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Contact Person"
              required
            />
          </div>

          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium mb-2">
              Contact Number
            </label>
            <input
              type="text"
              id="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Contact Number"
            />
          </div>

          <div>
            <label htmlFor="emailAddress" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Email Address"
            />
          </div>

          <div>
            <label htmlFor="remarks" className="block text-sm font-medium mb-2">
              Remarks
            </label>
            <div className="relative">
              <select
                id="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="py-3 px-4 pe-9 block w-full appearance-none border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
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

        <div className="mt-8 flex justify-center sm:justify-end">
          <button
            type="submit"
            disabled={loadingSubmit}
            className="inline-flex items-center justify-center px-12 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:cursor-pointer hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
          >
            {loadingSubmit ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
