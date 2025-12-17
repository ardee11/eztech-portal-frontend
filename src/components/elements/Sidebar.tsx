import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useSignOut } from "../../hooks/useSignOut";
import { hasAnyAccess } from "../../utils/permissions";
import { useLayout } from "../../contexts/layoutContext";

import logo from '../../assets/ez-logo.png';
import logoMini from '../../assets/ez-logo-mini.png';

export default function Sidebar() {
  const { userRole } = useAuth();
  const { isSidebarMinimized, setIsSidebarMinimized } = useLayout();
  const handleSignOut = useSignOut();
  
  if (!isSidebarMinimized) {
    //FULL SIDEBAR
    return (
      <div
        id="hs-application-sidebar"
        className="w-65 hs-overlay h-full hidden fixed inset-y-0 start-0 z-60 bg-gray-900 border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0"
        data-hs-overlay-backdrop-template="<div className='hs-overlay-backdrop fixed inset-0 bg-gray-900/50'></div>"
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full max-h-full relative">
          {/* Logo */}
          <div className="px-6 pt-6 flex items-center flex-shrink-0">
            <img src={logo} className="w-35 h-auto" alt="Logo" />
          </div>

          <div className="flex-1 overflow-y-auto mt-5">
            <nav className="w-full flex flex-col">
              <ul className="flex flex-col space-y-1">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive 
                        ? "text-blue-400 shadow-lg" 
                        : "text-slate-300 hover:text-white" 
                    }
                    end
                  >
                    {({ isActive }) => (
                      <div className={`${isActive ? "bg-blue-400/10 rounded-lg mx-2": ""}`}>
                        <div className={`${isActive ? "" : "hover:bg-white/5"} flex items-center gap-x-3 py-2.5 3xl:py-3 px-6 text-sm rounded-r-lg transition-all duration-200 group`}>
                          <div className="transition-all duration-200">
                            <svg
                              className="shrink-0 size-3.5 3xl:size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                              <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                          </div>
                          <span className="font-medium">Dashboard</span>
                        </div>
                      </div>
                    )}
                  </NavLink>
                </li>

                {userRole && hasAnyAccess(userRole, "inventory") && (
                  <li>
                    <NavLink
                      to="/inventory"
                      className={({ isActive }) =>
                        isActive 
                          ? "text-blue-400 shadow-lg" 
                          : "text-slate-300 hover:text-white"
                      }
                    >
                      {({ isActive }) => (
                        <div className={`${isActive ? "bg-blue-300/10 rounded-lg mx-2": ""}`}>
                            <div className={`${isActive ? "" : "hover:bg-white/5"} flex items-center gap-x-3 py-2.5 3xl:py-3 px-6 text-sm rounded-r-lg transition-all duration-200 group`}>                            <div className="transition-all duration-200">
                              <svg
                                className="shrink-0 size-3.5 3xl:size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                              </svg>
                            </div>
                            <span className="font-medium">Inventory</span>
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </li>
                )}

                {userRole && hasAnyAccess(userRole, "sales") && (
                  <li>
                    <NavLink
                      to="/sales-database"
                      className={({ isActive }) =>
                        isActive 
                          ? "text-blue-400 shadow-lg" 
                          : "text-slate-300 hover:text-white"
                      }
                    >
                      {({ isActive }) => (
                        <div className={`${isActive ? "bg-blue-300/10 rounded-lg mx-2": ""}`}>
                          <div className={`${isActive ? "" : "hover:bg-white/5"} flex items-center gap-x-3 py-2.5 3xl:py-3 px-6 text-sm rounded-r-lg transition-all duration-200 group`}>
                            <div className="transition-all duration-200">
                              <svg
                                className="shrink-0 size-3.5 3xl:size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <ellipse cx="12" cy="5" rx="9" ry="3" />
                                <path d="M3 5v14a9 3 0 0 0 18 0V5" />
                                <path d="M3 12a9 3 0 0 0 18 0" />
                              </svg>
                            </div>
                            <span className="font-medium">Sales Database</span>
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </li>
                )}

                {userRole && hasAnyAccess(userRole, "super admin") && (
                  <li>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        isActive 
                          ? "text-blue-400 shadow-lg" 
                          : "text-slate-300 hover:text-white"
                      }
                    >
                      {({ isActive }) => (
                        <div className={`${isActive ? "bg-blue-300/10 rounded-lg mx-2": ""}`}> 
                          <div className={`${isActive ? "" : "hover:bg-white/5"} flex items-center gap-x-3 py-2.5 3xl:py-3 px-6 text-sm rounded-r-lg transition-all duration-200 group`}>
                            <div className="transition-all duration-200">
                              <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/></svg>
                            </div>
                            <span className="font-medium">Access Management</span>
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </li>
                )}

                {/* Feedback Button - New Section */}
                <li>
                  <button 
                    onClick={() => window.open('https://forms.gle/t59TuUdtkMcTdvsJ9', '_blank')} 
                    className="w-full text-left text-sm text-slate-300 flex items-center gap-x-2 py-3 px-5 rounded-lg hover:text-white hover:cursor-pointer hover:bg-white/5 transition-all duration-200"
                  >
                    <div className="p-1">
                      <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <path d="M7 10h10M7 14h10" />
                      </svg>
                    </div>
                    <span className="font-medium">Feedback Form</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="border-t border-slate-700/50 p-1">
            <button
              className="w-full text-left text-sm text-slate-300 flex items-center gap-x-3 py-3 px-4 rounded-lg hover:text-white hover:cursor-pointer hover:bg-white/5 transition-all duration-200"
              onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
            >
              <div className="p-1 bg-gray-800 rounded-md">
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
              </div>
              {!isSidebarMinimized && <span className="font-medium">{isSidebarMinimized ? "Expand" : "Collapse Sidebar"}</span>}
            </button>
          </div>
          {/* Sign Out Section */}
          <div className="flex-shrink-0 border-t border-slate-700/50 p-1">
            <button
              className="w-full text-left text-sm text-slate-300 hover:text-red-400 hover:cursor-pointer flex items-center gap-x-3 py-3 px-4 rounded-lg hover:bg-red-500/10 transition-all duration-200 group"
              onClick={handleSignOut}
            >
              <div className="p-1 bg-gradient-to-r from-red-500/30 to-red-700/30 rounded-md group-hover:from-red-500/30 group-hover:to-pink-500/30 transition-all duration-200">
                <svg
                  className="shrink-0 size-3.5 3xl:size-4"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                  <path d="M20 12H9" />
                  <path d="M16 8l4 4-4 4" />
                </svg>
              </div>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  //COLLAPSED SIDEBAR
  return (
    <div
      id="hs-application-sidebar"
      className="hs-overlay w-18 h-full fixed inset-y-0 start-0 z-60 bg-gray-900 border-e border-gray-700 lg:block"
      role="dialog"
      aria-label="Sidebar"
    >
      <div className="flex flex-col h-full justify-between relative">
        {/* Logo (optional small icon) */}
        <div>
          <div className="flex justify-center px-3.5 pt-6">
            <img src={logoMini} alt="Logo" className="w-36 h-auto" />
          </div>

          {/* Navigation icons */}
          <nav className="flex flex-col items-center space-y-4 mt-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg p-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "text-blue-400 hover:bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`
              }
              title="Dashboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="block mx-auto"
                viewBox="0 0 24 24"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </NavLink>

            {userRole && hasAnyAccess(userRole, "inventory") && (
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `bg-gradient-to-r from-green-500/20 to-emerald-500/20 shadow-lg p-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 hover:bg-white/10"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`
                }
                title="Inventory"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="block mx-auto"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </NavLink>
            )}

            {userRole && hasAnyAccess(userRole, "sales") && (
              <NavLink
                to="/sales-database"
                className={({ isActive }) =>
                  `bg-gradient-to-r from-orange-500/20 to-red-500/20 shadow-lg p-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 hover:bg-white/10"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`
                }
                title="Sales Database"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="block mx-auto"
                  viewBox="0 0 24 24"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v14a9 3 0 0 0 18 0V5" />
                  <path d="M3 12a9 3 0 0 0 18 0" />
                </svg>
              </NavLink>
            )}

            {userRole && hasAnyAccess(userRole, "super admin") && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg p-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400 hover:bg-white/10"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`
                }
                title="Access Management"
              >
                <svg className="block mx-auto" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/></svg>
              </NavLink>
            )}
          </nav>
        </div>

        {/* Bottom controls */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          <button
            className="text-slate-400 bg-gray-800 hover:text-white p-2 rounded-md hover:cursor-pointer focus:outline-none"
            onClick={() => setIsSidebarMinimized(false)}
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <svg className="block mx-auto" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
          </button>

          <button
            className="text-red-400 bg-gradient-to-r from-red-500/30 to-red-700/30 hover:text-red-600 p-2 rounded-md focus:outline-none"
            onClick={handleSignOut}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
              <path d="M20 12H9" />
              <path d="M16 8l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}




