import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { useSalesAccounts } from "../../hooks/useSalesDB";
import AddCompanyModal from "../../components/modal/SalesDB/AddCompanyModal";
import EditCompanyModal from "../../components/modal/SalesDB/EditCompanyModal";
import DeleteCompanyModal from "../../components/modal/SalesDB/DeleteCompanyModal";
import { formatTimestampToFullDate } from "../../utils/DateFormat";
import { ClipLoader } from "react-spinners";

interface AccountsDBProps {
  selectedManagerFilter: string | null;
  setSelectedManagerFilter: (manager: string | null) => void;
  companyListRef: React.RefObject<HTMLDivElement | null>;
}

const REMARK_OPTIONS = ["Active", "Potential", "Inactive", "Open", "Government"];

const AccountsDB: React.FC<AccountsDBProps> = ({
  selectedManagerFilter,
  setSelectedManagerFilter,
  companyListRef,
}) => {
  const [reloadFlag, setReloadFlag] = useState(false);
  const { data, loading, error } = useSalesAccounts(reloadFlag);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRemarkFilter, setSelectedRemarkFilter] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);

  const { userRole, userName } = useAuth();

  const privilegedRoles = ["Admin", "Super Admin", "Sales Manager"];
  const hasAccess = Array.isArray(userRole)
    ? userRole.some((role) => privilegedRoles.includes(role))
    : privilegedRoles.includes(userRole || "");

  const filteredCompanyNames = data
    .filter((company) => {
      const matchesSearch = company.comp_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRemark = selectedRemarkFilter ? company.remarks === selectedRemarkFilter : true;
      const matchesManager = selectedManagerFilter ? company.acc_manager === selectedManagerFilter : true;
      return matchesSearch && matchesRemark && matchesManager;
    })
    .sort((a, b) => a.comp_name.trim().toLowerCase().localeCompare(b.comp_name.trim().toLowerCase()))
    .map((company) => ({
      name: company.comp_name,
      remarks: company.remarks,
      id: company.comp_id,
    }));

  const handleSelectCompany = (comp_id: number) => {
    const company = data.find((c) => c.comp_id === comp_id);
    if (company) {
      setSelectedCompany(company);
    }
  };

  const handleBackToList = () => {
    setSelectedCompany(null);
  };

  const canEditSelectedCompany = () => {
    if (!selectedCompany || !userName) return false;
    return hasAccess || selectedCompany.acc_manager === userName;
  };

  const canDeleteData = () => {
    return hasAccess;
  };

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
    if (selectedCompany) {
      const updated = data.find((c) => c.comp_id === selectedCompany.comp_id);
      if (updated) {
        setSelectedCompany(updated);
      }
    }
  }, [data]);

  useEffect(() => {
    setSelectedCompany(null);
  }, [selectedManagerFilter]);

  return (
    <>
      <div className="h-[85vh] p-6">
        {/* Header Controls */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 items-center">
            {selectedCompany && (
              <div
                onClick={handleBackToList}
                className="cursor-pointer hover:bg-gray-100 rounded-full p-2"
              >
                <svg
                  className="w-4 h-4 3xl:w-5 3xl:h-5 text-gray-800"
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
            )}
            <div className="text-lg 3xl:text-xl font-semibold items-center flex">
              {selectedCompany
                ? "Company Details"
                : selectedManagerFilter
                ? `${selectedManagerFilter.trim().split(" ")[0]}'s Managed Accounts`
                : hasAccess
                ? "Managed Accounts"
                : "My Managed Accounts"}
            </div>

            {!selectedCompany && (
              <div className="relative">
                <label htmlFor="remark-filter" className="sr-only">
                  Remark Filter
                </label>
                <select
                  id="remark-filter"
                  value={selectedRemarkFilter || ""}
                  onChange={(e) => setSelectedRemarkFilter(e.target.value || null)}
                  className="py-1 px-2 pe-8 appearance-none block border border-gray-500 rounded-lg text-xs 3xl:text-sm hover:cursor-pointer"
                >
                  <option value="">All</option>
                  {REMARK_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700">
                  <svg
                    className="w-4 h-3 3xl:h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}

            {(selectedManagerFilter || selectedRemarkFilter) && !selectedCompany && (
              <button
                onClick={() => {
                  setSelectedManagerFilter(null);
                  setSelectedRemarkFilter(null);
                  companyListRef.current?.scrollTo({ top: 0 });
                }}
                className="text-xs 3xl:text-sm ml-1 px-3 py-1 text-blue-600 border rounded-lg hover:bg-blue-500/10 hover:cursor-pointer transition"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {selectedCompany && canEditSelectedCompany() && (
              <button
                className="text-blue-600 border px-4 py-1 rounded-lg text-xs 3xl:text-sm hover:cursor-pointer hover:bg-blue-50 transition"
                onClick={() => {
                  setEditingCompanyId(selectedCompany.comp_id);
                  setIsEditCompanyModalOpen(true);
                }}
              >
                Edit
              </button>
            )}
            {selectedCompany && canDeleteData() && (
              <button
                className="text-red-600 border px-4 py-1 rounded-lg text-xs 3xl:text-sm hover:cursor-pointer hover:bg-red-50 transition"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </button>
            )}
            {!selectedCompany && (
              <button
                onClick={() => setIsAddCompanyModalOpen(true)}
                className="py-2 px-3 inline-flex items-center gap-x-1 rounded-lg text-teal-800 bg-teal-200 hover:cursor-pointer hover:bg-teal-300 transition"
              >
                <svg
                  className="shrink-0 size-3.5 3xl:size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {!selectedCompany && (
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
              <svg
                className="shrink-0 size-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              name="search"
              type="text"
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-4 w-full border py-1.5 ps-10 pe-16 block border-gray-600 rounded-lg text-sm 3xl:text-base"
              placeholder="Search"
            />
          </div>
        )}

        {/* Main Content */}
        {!selectedCompany ? (
          loading ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <ClipLoader color="#14b8a6" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <p className="text-red-500 text-sm 3xl:text-base font-semibold">Error: {error}</p>
              <p className="text-gray-500 text-sm 3xl:text-base mt-2">Contact your IT administrator.</p>
            </div>
          ) : filteredCompanyNames.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <p className="text-gray-500 text-sm 3xl:text-base">No companies to show</p>
            </div>
          ) : (
            <div ref={companyListRef} className="h-[80%] overflow-y-auto mt-4">
              <ul className="divide-y divide-gray-200">
                {filteredCompanyNames.map(({ name, remarks, id }) => (
                  <li
                    key={id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectCompany(id)}
                    onKeyDown={(e) => e.key === "Enter" && handleSelectCompany(id)}
                    className="text-sm 3xl:text-base p-4 hover:bg-gray-100 hover:cursor-pointer hover:rounded-lg transition flex justify-between items-center"
                  >
                    <span className="truncate">{name}</span>
                    <span
                      className={`px-3 py-0.5 rounded-full w-22 text-center text-white text-xs 3xl:text-sm whitespace-nowrap ${getRemarkColorClass(
                        remarks
                      )}`}
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
            {(() => {
              const {
                comp_name,
                created_at,
                acc_manager,
                comp_person,
                comp_number,
                comp_email,
                remarks,
                comp_address,
              } = selectedCompany;

              return (
                <>
                  <p>
                    <span className="font-medium">Company Name:</span> {comp_name}
                  </p>
                  <p>
                    <span className="font-medium">Date Added:</span> {formatTimestampToFullDate(created_at)}
                  </p>
                  <p>
                    <span className="font-medium">Account Manager:</span> {acc_manager}
                  </p>
                  <p>
                    <span className="font-medium">Contact Person:</span> {comp_person || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Contact Number:</span> {comp_number || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {comp_email || "N/A"}
                  </p>
                  <p className="font-medium">
                    Remarks:
                    <span
                      className={`font-normal ml-2 px-4 py-0.5 rounded-full w-22 text-center text-white text-xs 3xl:text-sm whitespace-nowrap ${getRemarkColorClass(
                        remarks
                      )}`}
                    >
                      {remarks || "N/A"}
                    </span>
                  </p>
                  <p className="font-medium truncate mt-4">Company Address:</p>
                  <p className="ml-3">{comp_address || "N/A"}</p>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCompanyModal
        isOpen={isAddCompanyModalOpen}
        onClose={() => setIsAddCompanyModalOpen(false)}
        onSuccess={() => setReloadFlag((flag) => !flag)}
      />

      <EditCompanyModal
        isOpen={isEditCompanyModalOpen}
        onClose={() => {
          setIsEditCompanyModalOpen(false);
          setEditingCompanyId(null);
        }}
        companyId={editingCompanyId || 0}
        onSuccess={() => setReloadFlag((flag) => !flag)}
      />

      <DeleteCompanyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onCompanyDelete={() => {
          setReloadFlag((flag) => !flag);
          setSelectedCompany(null);
        }}
        companyId={selectedCompany?.comp_id || 0}
        companyName={selectedCompany?.comp_name || ""}
      />
    </>
  );
};

export default AccountsDB;