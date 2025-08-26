import AccountsDB from "./AccountsDB";
import DBSearch from "./DBSearch";
import DBInfo from "./DBInfo";
import { useRef, useState } from "react";
import { useSalesAccounts } from "../../hooks/useSalesDB";
import { ClipLoader } from "react-spinners";

export default function SalesDB() {
  const { loading } = useSalesAccounts();
  const companyListRef = useRef<HTMLDivElement>(null);
  const [selectedManagerFilter, setSelectedManagerFilter] = useState<string | null>(null);

  return (
    <div className="max-w-full px-6 py-4 mx-auto">
      {!loading ? (
        <div className="flex flex-row gap-4 items-stretch">
          <div className="flex-1 min-w-0 h-[85vh] border border-gray-300 shadow-md rounded-xl overflow-hidden bg-white">
            <AccountsDB 
              selectedManagerFilter={selectedManagerFilter} 
              setSelectedManagerFilter={setSelectedManagerFilter}
              companyListRef={companyListRef}
            />
          </div>

          <div className="flex-1 min-w-0 h-[85vh] flex flex-col gap-4">
            <div className="flex-1 bg-white border border-gray-300 shadow-md rounded-xl overflow-hidden">
              <DBSearch /> 
            </div>

            <div className="flex-1 flex flex-col border border-gray-300 shadow-md bg-white rounded-xl overflow-hidden">
              <DBInfo
                selectedManagerFilter={selectedManagerFilter}
                setSelectedManagerFilter={setSelectedManagerFilter}
                companyListRef={companyListRef}
              />
            </div>
          </div>
        </div>
      ):(
        <div className="flex flex-col items-center justify-center h-[85vh]">
          <ClipLoader color="#3498db" size={42} />
          <p className="text-gray-400 text-xs mt-2">Loading data...</p>
        </div>
      )}
    </div>
  );
}