import { NavLink } from "react-router-dom";
import logo from '../../assets/ez-logo.png';
import { useAuth } from "../../contexts/authContext";
import { useSignOut } from "../../hooks/useSignOut";
import { hasAccess } from "../../utils/permissions";

export default function Sidebar() {
  const { userRole } = useAuth();
  const handleSignOut = useSignOut();

  return (
    <div
      id="hs-application-sidebar"
      className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform 
      w-65 h-full hidden fixed inset-y-0 start-0 z-60 bg-gray-900 border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0"
      data-hs-overlay-backdrop-template="<div className='hs-overlay-backdrop fixed inset-0 bg-gray-900/50'></div>"
      role="dialog"
      tabIndex={-1}
      aria-label="Sidebar"
    >
      <div className="flex flex-col h-full max-h-full relative">
        {/* Logo */}
        <div className="px-6 pt-4 flex items-center flex-shrink-0">
          <img src={logo} className="w-28 h-auto" alt="Logo" />
        </div>

        <div className="flex-1 overflow-y-auto px-3 mt-4">
          <nav className="w-full flex flex-col">
            <ul className="flex flex-col space-y-1">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "bg-white/10 text-blue-400" : "text-white"
                  }
                  end
                >
                  <div className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-white/10">
                    <svg
                      className="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Dashboard
                  </div>
                </NavLink>
              </li>

              {userRole && hasAccess(userRole, "inventory") && (
                <li>
                  <NavLink
                    to="/inventory"
                    className={({ isActive }) =>
                      isActive ? "bg-white/10 text-blue-400" : "text-white"
                    }
                  >
                    <div className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-white/10">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      Inventory
                    </div>
                  </NavLink>
                </li>
              )}

              {userRole && hasAccess(userRole, "sales") && (
                <li>
                  <NavLink
                    to="/sales-database"
                    className={({ isActive }) =>
                      isActive ? "bg-white/10 text-blue-400" : "text-white"
                    }
                  >
                    <div className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-white/10">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                        <path d="M3 5v14a9 3 0 0 0 18 0V5" />
                        <path d="M3 12a9 3 0 0 0 18 0" />
                      </svg>
                      Sales Database
                    </div>
                  </NavLink>
                </li>
              )}

              {userRole && hasAccess(userRole, "admin") && (
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive ? "bg-white/10 text-blue-400" : "text-white"
                    }
                  >
                    <div className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-white/10">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      Access Control
                    </div>
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="flex-shrink-0 border-t border-gray-800 p-4">
          <button
            className="w-full text-left text-sm text-red-400 hover:text-red-600 hover:cursor-pointer flex items-center gap-x-2"
            onClick={handleSignOut}
          >
            <svg
              className="shrink-0 size-4.5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
              <path d="M20 12H9" />
              <path d="M16 8l4 4-4 4" />
            </svg>
              Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
