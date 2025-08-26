import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { useSalesAccounts } from "../../hooks/useSalesDB";
import AddCompanyModal from "../../components/modal/SalesDB/AddCompanyModal";
import EditCompanyModal from "../../components/modal/SalesDB/EditCompanyModal";
import { formatTimestampToFullDate } from "../../utils/DateFormat";
import DeleteCompanyModal from "../../components/modal/SalesDB/DeleteCompanyModal";

interface AccountsDBProps {
  selectedManagerFilter: string | null;
  setSelectedManagerFilter: (manager: string | null) => void;
}

const AccountsDB: React.FC<AccountsDBProps> = ({ selectedManagerFilter, setSelectedManagerFilter }) => {
  const [reloadFlag, setReloadFlag] = useState(false);
  const { data, loading, error } = useSalesAccounts(reloadFlag);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRemarkFilter, setSelectedRemarkFilter] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const companyListRef = useRef<HTMLDivElement>(null);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);

  const { userRole, userName } = useAuth();
  const privilegedRoles = ["Admin", "Super Admin", "Sales Manager"];

  const hasAccess = Array.isArray(userRole)
    ? userRole.some(role => privilegedRoles.includes(role))
    : privilegedRoles.includes(userRole || "");

  // Filtering and searching
  const filteredCompanyNames = data
    .filter(company => {
      const matchesSearch = company.comp_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRemark = selectedRemarkFilter ? company.remarks === selectedRemarkFilter : true;
      const matchesManager = selectedManagerFilter ? company.acc_manager === selectedManagerFilter : true;
      return matchesSearch && matchesRemark && matchesManager;
    })
    .map((company) => ({
      name: company.comp_name,
      remarks: company.remarks,
      id: company.comp_id
    }));

  const handleSelectCompany = (comp_id: number) => {
    const company = data.find(c => c.comp_id === comp_id);
    if (company) {
      setSelectedCompany(company);
    }
  };

  const handleBackToList = () => {
    setSelectedCompany(null);
  };

  const canEditSelectedCompany = () => {
    if (!selectedCompany || !userName) return false;

    if (hasAccess) {
      return true;
    }
    return selectedCompany.acc_manager === userName;
  };

  const canDeleteData = () => {
    if (hasAccess) {
      return true;
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      const updated = data.find(c => c.comp_id === selectedCompany.comp_id);
      if (updated) {
        setSelectedCompany(updated);
      }
    }
  }, [data]);

  const getRemarkColorClass = (remark: string) => {
    switch (remark) {
      case "Active":
        return "bg-green-500";
      case "Potential":
        return "bg-yellow-400";
      case "Inactive":
        return "bg-gray-400";
      case "Open":
        return "bg-green-300";
      case "Government":
        return "bg-purple-500";
      default:
        return "bg-gray-300";
    }
  };

  useEffect(() => {
    setSelectedCompany(null);
  }, [selectedManagerFilter]);

  return (
    <>
      <div className="h-[85vh] p-6">
        <div className="flex justify-between items-center">

          <div className="flex space-x-2 items-center">
            <div
              onClick={handleBackToList}
              className={`cursor-pointer hover:bg-gray-100 rounded-full p-2 ${selectedCompany ? "block" : "hidden"}`}
            >
              <svg className="w-4 h-4 3xl:w-5 3xl:h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 5H1m0 0 4 4M1 5l4-4"/>
              </svg>
            </div>
            <div className="text-lg 3xl:text-xl font-semibold items-center flex">
              {selectedCompany ? "Company Details" : 
              selectedManagerFilter ? `${selectedManagerFilter.trim().split(" ")[0]}'s Managed Accounts` :
              hasAccess ? "Managed Accounts" : "My Managed Accounts"}
            </div>
            
            {/*remark filter */}
            {!selectedCompany && (
              <div className="relative">
                <label htmlFor="remark-filter" className="sr-only">Remark Filter</label>
                <select
                  id="remark-filter"
                  value={selectedRemarkFilter || ""}
                  onChange={(e) => setSelectedRemarkFilter(e.target.value || null)}
                  className="py-1 px-2 pe-3 block w-full appearance-none border border-gray-500 rounded-lg text-xs 3xl:text-sm hover:cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Potential">Potential</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Open">Open</option>
                  <option value="Government">Government</option>
                </select>

                <div className="mb-1 pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700">
                  <svg className="w-4 h-3 3xl:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
            
            {/*clear filter button */}
            {(selectedManagerFilter || selectedRemarkFilter) && !selectedCompany && (
              <button
                onClick={() => {
                  setSelectedManagerFilter(null);
                  setSelectedRemarkFilter(null);
                  if (companyListRef.current) {
                    companyListRef.current.scrollTop = 0;
                  }
                }}                        
                className="text-xs 3xl:text-sm ml-1 px-3 py-1 text-blue-600 text-xs border rounded-lg hover:bg-blue-500/10 hover:cursor-pointer transition duration-150"
              >
                Clear Filter
              </button>
            )} 
          </div>

          {/* Add and edit company button */}
          <div className="flex items-center space-x-2">
            {selectedCompany && canEditSelectedCompany() && (
              <div 
                className="text-blue-600 border px-4 py-1 rounded-lg text-xs 3xl:text-sm hover:bg-blue-50 hover:cursor-pointer transition duration-150"
                onClick={() => {
                  setEditingCompanyId(selectedCompany.comp_id);
                  setIsEditCompanyModalOpen(true);
                }}                        
              >
                Edit
              </div>
            )}

            {selectedCompany && canDeleteData() && (
              <div
                className="text-red-600 border px-4 py-1 rounded-lg text-xs 3xl:text-sm hover:bg-red-50 hover:cursor-pointer transition duration-150"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </div>
            )}
          </div>
          
          {!selectedCompany && (
            <button 
              onClick={() => setIsAddCompanyModalOpen(true)}
              className="py-2 px-3 inline-flex items-center gap-x-1 rounded-lg text-teal-800 bg-teal-200 hover:bg-teal-300 hover:cursor-pointer transition"
            >
              <svg className="shrink-0 size-3.5 3xl:size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M12 5v14M5 12h14" /></svg>
            </button>
          )}
        </div>
        
        {!selectedCompany && (
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
              <svg className="shrink-0 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              name="search"
              type="text"
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-4 w-full border py-1.5 ps-10 pe-16 block border-gray-600 rounded-lg text-sm 3xl:text-base" placeholder="Search" 
            />
          </div>
        )}

        {!selectedCompany ? (
          filteredCompanyNames.length === 0 || error ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              {!loading && error ? (
                <>
                  <p className="text-red-500 text-sm 3xl:text-base font-semibold">Error: {error}</p>
                  <p className="text-gray-500 text-sm 3xl:text-base mt-2">Contact your IT administrator.</p>
                </>
              ) : (
                <p className="text-gray-500 text-sm 3xl:text-base">No companies to show</p>
              )}
            </div>
          ) : (
            <div ref={companyListRef} className="h-[80%] overflow-y-auto mt-4">
              <ul className="divide-y divide-gray-200">
                {filteredCompanyNames.map(({ name, remarks, id }) => (
                  <li
                    key={id}
                    onClick={() => handleSelectCompany(id)}
                    className="text-sm 3xl:text-base p-4 hover:bg-gray-100 hover:cursor-pointer hover:rounded-lg transition flex justify-between items-center"
                  >
                    <span className="truncate">{name}</span>
                    <span
                      className={`px-3 py-0.5 rounded-full w-22 text-center text-white text-xs 3xl:text-sm whitespace-nowrap ${getRemarkColorClass(remarks)}`}
                    >
                      {remarks || "N/A"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        ) : (
          <div className="text-sm 3xl:text-base space-y-2 px-4 mt-8">
            <p><span className="font-medium">Company Name:</span> {selectedCompany["comp_name"]}</p>
            <p><span className="font-medium">Date Added:</span> {formatTimestampToFullDate(selectedCompany["created_at"])}</p>
            <p><span className="font-medium">Account Manager:</span> {selectedCompany["acc_manager"]}</p>
            <p><span className="font-medium">Contact Person:</span> {selectedCompany["comp_person"] || "N/A"}</p>
            <p><span className="font-medium">Contact Number:</span> {selectedCompany["comp_number"] || "N/A"}</p>
            <p><span className="font-medium">Email:</span> {selectedCompany["comp_email"] || "N/A"}</p>
            <p className="font-medium">Remarks:<span className={`font-normal ml-2 px-4 py-0.5 rounded-full w-22 text-center text-white text-xs 3xl:text-sm whitespace-nowrap ${getRemarkColorClass(selectedCompany["remarks"])}`}>
              {selectedCompany["remarks"] || "N/A"}
            </span></p>
            <p className="font-medium truncate mt-4">Company Address:</p>
            <p className="ml-3">{selectedCompany["comp_address"] || "N/A"}</p>
          </div>
        )}
      </div>

      <AddCompanyModal
        isOpen={isAddCompanyModalOpen}
        onClose={() => setIsAddCompanyModalOpen(false)}
        onSuccess={() => setReloadFlag(flag => !flag)}
      />

      <EditCompanyModal
        isOpen={isEditCompanyModalOpen}
        onClose={() => {
          setIsEditCompanyModalOpen(false);
          setEditingCompanyId(null);
        }}
        companyId={editingCompanyId || 0}
        onSuccess={() => setReloadFlag(flag => !flag)}
      />

      <DeleteCompanyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onCompanyDelete={() => {
          setReloadFlag(flag => !flag)
          setSelectedCompany(null);
        }}
        companyId={selectedCompany?.comp_id || 0}
        companyName={selectedCompany?.comp_name || ""}
      />
    </>
  )
}

export default AccountsDB