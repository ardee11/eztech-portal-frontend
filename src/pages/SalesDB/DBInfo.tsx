import { useAuth } from "../../contexts/authContext";
import { useSalesAccounts } from "../../hooks/useSalesDB";
import { useMemo } from "react";

interface DBInfoProps {
  selectedManagerFilter: string | null;
  setSelectedManagerFilter: (manager: string | null) => void;
  companyListRef: React.RefObject<HTMLDivElement | null>;
}

const DBInfo: React.FC<DBInfoProps> = ({
  selectedManagerFilter,
  setSelectedManagerFilter,
  companyListRef
}) => {
  const { user } = useAuth();
  const { data } = useSalesAccounts();

  const canViewAllDataRoles = ["Admin", "Super Admin", "Sales Manager"];

  const isPrivilegedUser = Array.isArray(user?.role)
    ? user.role.some(role => canViewAllDataRoles.includes(role))
    : canViewAllDataRoles.includes(user?.role || "");

  const sortedManagers = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(company => {
      const manager = company.acc_manager;
      counts[manager] = (counts[manager] || 0) + 1;
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [data]);

  const filteredCompanyNames = useMemo(() => {
    return data.filter(company => company.acc_manager === user?.name);
  }, [data, user?.name]);

  const remarkSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    filteredCompanyNames.forEach(company => {
      const remark = company.remarks || "Unknown";
      summary[remark] = (summary[remark] || 0) + 1;
    });
    return summary;
  }, [filteredCompanyNames]);

  return (
    <div className="p-5">
      {isPrivilegedUser ? (
        <>
          <h2 className="font-semibold mb-2 text-md 3xl:text-lg">Account Managers</h2>
          <div className="h-[32vh] overflow-y-auto rounded-xl">
            {sortedManagers.length > 0 ? (
              <ul className="space-y-1">
                {sortedManagers.map(([manager, count]) => (
                  <li
                    key={manager}
                    className={`text-xs 3xl:text-sm px-3 py-2.5 transition flex items-center
                      hover:bg-blue-100/50 hover:font-semibold hover:cursor-pointer hover:rounded-lg
                      ${selectedManagerFilter === manager ? "bg-blue-100/50 font-semibold rounded-lg" : ""}`}
                    onClick={() => {
                      setSelectedManagerFilter(manager);
                      companyListRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <p>{manager}
                      <span className="ml-1">({count})</span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No data available</p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="font-semibold mb-4 text-md 3xl:text-lg">Account Manager Information</h2>
          <div className="h-[32vh] overflow-y-auto px-3">
            <p className="text-sm 3xl:text-md text-gray-800 mb-2">
              Total Companies Handling:{" "}
              <span className="font-medium text-gray-700">{filteredCompanyNames.length}</span>
            </p>
            {Object.entries(remarkSummary).map(([remark, count]) => (
              <p key={remark} className="text-sm 3xl:text-md text-gray-800 ml-3 mt-1">
                {remark}: <span className="font-medium text-gray-700">{count}</span>
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DBInfo;
