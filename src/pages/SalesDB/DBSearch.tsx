import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import ezlogo from "../../assets/ez-logo.png";

interface SearchResult {
  comp_name: string;
  acc_manager: string;
  comp_person?: string;
  comp_number?: string;
  comp_email?: string;
  comp_address: string;
  remarks?: string;
}

interface Props {}

const DBSearch: React.FC<Props> = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      setSearchError("Authentication token missing.");
      return;
    }
  
    try {
      setLoadingData(true);
      setSearchError(null);
  
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(searchInput)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const json = await res.json();
  
      if (!res.ok) {
        setSearchError(json.message || "Search failed.");
        return;
      }
  
      if (json.status === "exact" || json.status === "single") {
        setSearchResult(json.data);
      } else if (json.status === "multiple") {
        setSearchError("Multiple matches found. Please refine your search.");
      } else if (json.status === "none") {
        setSearchError("No matching companies found.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("An error occurred while searching.");
    } finally {
      setLoadingData(false);
    }
  };

  const getRemarkColorClass = (remark?: string | "Invalid") => {
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

  return (
    <>
      {/* DATABASE SEARCH */}
      <div className={`relative overflow-hidden h-full ${!searchResult ? "flex items-center justify-center" : ""}`}>
        <div className="w-full">

          {loadingData ? (
            <div className="flex items-center justify-center h-full">
              <ClipLoader color="#3498db" size={24} />
              <p className="text-gray-500 text-sm ml-2">Searching in database...</p>
            </div>
          ) : searchResult ? (
            <div className="text-left p-6">
              <button
                onClick={() => {
                  setSearchResult(null);
                  setSearchInput("");
                }}
                className="text-blue-600 hover:underline text-xs hover:cursor-pointer"
              >
                ← Back to Search
              </button>
              <div className="ml-3 mt-4">
                <p className="text-sm mb-1 font-semibold">Company Name: 
                  <span className="ml-2 font-normal">{searchResult.comp_name}</span>
                  <span className={`ml-2 font-normal rounded-xl px-3 py-0.5 text-xs text-white ${getRemarkColorClass(searchResult.remarks)}`}>{searchResult.remarks}</span>
                </p>
                <p className="text-sm mb-1 font-semibold">
                  {searchResult.remarks === "Open" ? "Previous Account Manager:" : "Account Manager:"}
                  <span className="ml-2 font-normal">{searchResult.acc_manager}</span>
                </p>
                {searchResult.remarks === "Open" && (
                  <>
                  <p className="text-sm mb-1 font-semibold">Contact Person: 
                    <span className="ml-2 font-normal">{searchResult.comp_person ? searchResult.comp_person : "N/A"}</span>
                  </p>
                  <p className="text-sm mb-1 font-semibold">Contact Number: 
                    <span className="ml-2 font-normal">{searchResult.comp_number ? searchResult.comp_number : "N/A" }</span>
                  </p>
                  <p className="text-sm mb-1 font-semibold">Email Address: 
                    <span className="ml-2 font-normal">{searchResult.comp_email ? searchResult.comp_email : "N/A" }</span>
                  </p>
                  </>
                )}
                <p className="text-sm mb-2 font-semibold mt-3">Company Address:</p>
                <p className="text-sm ml-2 truncate">{searchResult.comp_address ? searchResult.comp_address : "N/A"}</p>
              </div>
            </div>        
          ) : (
            <form className="max-w-md mx-auto py-8 px-4" onSubmit={handleSubmit}>
              <img 
                src={ezlogo} 
                width={210}
                className="mx-auto relative"
              />

              <div className="relative w-full mt-6">
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                  <svg className="shrink-0 size-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>

                <input 
                  name="search" 
                  type="text"
                  value={searchInput}
                  autoComplete="off"
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full border py-2 ps-10 pe-16 block bg-white border-gray-500 rounded-full text-xs" 
                  placeholder="Search for company/organization name" 
                />
              </div> 
              
              {searchError && (
                <p className="text-red-500 text-center text-xs mt-3">{searchError}</p>
              )}
            </form>
            )}
        </div>
      </div>
    </>
  )
}

export default DBSearch