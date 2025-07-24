import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../contexts/authContext";
import { useSalesAccounts, SalesAccount } from "../../hooks/useSalesDB";

export default function EditCompany() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const companyId = Number(new URLSearchParams(location.search).get("id"));
  
  const canEditAccountManager = ["Admin", "Sales Manager", "Super Admin"].includes(userRole || "");

  const [accountManagerOptions, setAccountManagerOptions] = useState<string[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<SalesAccount | null>(null);

  const [formData, setFormData] = useState({
    comp_name: "",
    comp_person: "",
    comp_number: "",
    comp_email: "",
    acc_manager: "",
    comp_address: "",
    remarks: "Open",
  });

  const { data, loading } = useSalesAccounts();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authorization token missing.");
      return;
    }
    async function fetchAccountManagers() {
      try {
        const res = await fetch("http://localhost:5000/api/account-managers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });
        if (!res.ok) throw new Error("Failed to fetch account managers");
        const managers: string[] = await res.json();
        setAccountManagerOptions(managers);
      } catch (error) {
        console.error("Error fetching account managers:", error);
        setAccountManagerOptions([]);
      }
    }
    fetchAccountManagers();
  }, []);

  useEffect(() => {
    if (!loading && data && companyId !== null) {
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
      } else {
        console.warn("Company not found. Redirecting...");
        navigate("/sales-database");
      }
    }
  }, [loading, data, companyId, navigate]);
  

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompany) {
      alert("No selected company.");
      return;
    }

    if (isFormDataUnchanged()) {
      alert("No changes detected.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authorization token missing.");
      return;
    }

    setLoadingSubmit(true);

    try {
      const res = await fetch(`http://localhost:5000/api/sales-accounts/${selectedCompany.comp_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update company");

      alert("Company updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error submitting:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="max-w-[85rem] px-6 py-3">
      {!loading ? (
        <>
          <div className="flex items-center mb-4 space-x-2">
            <div
              onClick={() => navigate(-1)}
              className="cursor-pointer hover:bg-gray-100 rounded-full p-2 hidden sm:hidden lg:block"
            >
              <svg
                className="w-5 h-5 text-gray-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold">Edit Company Details</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border border-gray-400 rounded-lg bg-white p-10 mx-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
              {canEditAccountManager && (
                <div>
                  <label htmlFor="acc_manager" className="block text-sm font-medium mb-2">
                    Account Manager
                  </label>
                  <div className="relative">
                    <select
                      id="acc_manager"
                      value={formData.acc_manager}
                      onChange={handleChange}
                      required
                      className="py-3 px-4 pe-9 block w-full appearance-none border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 hover:cursor-pointer"
                    >
                      {accountManagerOptions.map((manager) => (
                        <option key={manager} value={manager}>
                          {manager}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="comp_name"
                  className="block text-sm font-medium mb-2"
                >
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="comp_name"
                  value={formData.comp_name}
                  onChange={handleChange}
                  className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Company Name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="comp_address"
                  className="block text-sm font-medium mb-2"
                >
                  Company Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="comp_address"
                  value={formData.comp_address}
                  onChange={handleChange}
                  className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Company Address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="comp_person"
                  className="block text-sm font-medium mb-2"
                >
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="comp_person"
                  value={formData.comp_person}
                  onChange={handleChange}
                  className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Contact Person"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="comp_number"
                  className="block text-sm font-medium mb-2"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="comp_number"
                  value={formData.comp_number}
                  onChange={handleChange}
                  className="py-3 px-4 block w-full border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Contact Number"
                />
              </div>

              <div>
                <label
                  htmlFor="comp_email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="comp_email"
                  value={formData.comp_email}
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
                    className="py-3 px-4 pe-9 block w-full appearance-none border border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 hover:cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="Potential">Potential</option>
                    <option value="Active">Active</option>
                    <option value="Government">Government</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
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
        </>     
      ):(
        <div className="h-[85vh] flex items-center justify-center px-4">
          <div className="p-6 text-center">
            <ClipLoader color="#3498db" size={36} />
            <p className="text-xs text-gray-800 mt-2">Loading data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
