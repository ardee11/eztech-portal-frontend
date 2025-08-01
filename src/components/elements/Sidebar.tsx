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

              <li className="hs-accordion" id="account-accordion">
                <button type="button" className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 hover:cursor-pointer" aria-expanded="true" aria-controls="account-accordion-child">
                  <svg 
                    className="shrink-0 size-4 mt-1 text-gray-800 dark:text-neutral-200" 
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
                    <path d="m7 11 2-2-2-2"/>
                    <path d="M11 13h4"/>
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  </svg>
                  System Setup

                  <svg className="hs-accordion-active:block ms-auto hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>

                  <svg className="hs-accordion-active:hidden ms-auto block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
                </button>

                <div id="account-accordion-child" className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="account-accordion">
                  <ul className="ps-6 pt-1 space-y-1">
                    {userRole && hasAccess(userRole, "admin") && (
                      <li>
                        <NavLink
                          to="/admin"
                          className={({ isActive }) =>
                            isActive ? "bg-white/10 text-blue-400" : "text-white"
                          }
                        >
                          <div className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg hover:bg-white/10">
                            <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/></svg>
                            Access Management
                          </div>
                        </NavLink>
                      </li>
                    )}

                    {/*
                    <li>
                      <a className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10" href="#">
                        Link 3
                      </a>
                    </li> */}

                  </ul>
                </div>
              </li>
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
