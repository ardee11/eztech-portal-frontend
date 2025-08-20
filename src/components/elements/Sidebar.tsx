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
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 shadow-lg" 
                      : "text-slate-300 hover:text-white" 
                  }
                  end
                >
                  {({ isActive }) => (
                    <div className="flex items-center gap-x-3 py-3 px-4 text-xs rounded-r-lg hover:bg-white/5 transition-all duration-200 group">
                      {isActive && <div className="w-1 h-6 bg-blue-400 rounded-r"></div>}
                    <div className="p-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-md group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-200">
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
                   )}
                 </NavLink>
              </li>

              {userRole && hasAccess(userRole, "inventory") && (
                <li>
                                     <NavLink
                     to="/inventory"
                     className={({ isActive }) =>
                       isActive 
                         ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 shadow-lg" 
                         : "text-slate-300 hover:text-white"
                     }
                   >
                     {({ isActive }) => (
                       <div className="flex items-center gap-x-3 py-3 px-4 text-xs rounded-r-lg hover:bg-white/5 transition-all duration-200 group">
                         {isActive && <div className="w-1 h-6 bg-blue-400 rounded-r"></div>}
                      <div className="p-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-md group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-200">
                        <svg
                          className="shrink-0 size-4"
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
                     )}
                   </NavLink>
                </li>
              )}

              {userRole && hasAccess(userRole, "sales") && (
                <li>
                  <NavLink
                    to="/sales-database"
                    className={({ isActive }) =>
                      isActive 
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 shadow-lg" 
                        : "text-slate-300 hover:text-white"
                    }
                  >
                     {({ isActive }) => (
                       <div className="flex items-center gap-x-3 py-3 px-4 text-xs rounded-r-lg hover:bg-white/5 transition-all duration-200 group">
                         {isActive && <div className="w-1 h-6 bg-blue-400 rounded-r"></div>}
                      <div className="p-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-md group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-all duration-200">
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
                     )}
                   </NavLink>
                </li>
              )}

              <li className="hs-accordion" id="account-accordion">
                                 <button 
                   type="button" 
                   className="hs-accordion-toggle w-full text-start flex items-center gap-x-3 py-3 px-4 text-xs text-slate-300 rounded-r-lg hover:bg-white/5 hover:text-white focus:outline-none focus:bg-white/5 transition-all duration-200 group" 
                   aria-expanded="true" 
                   aria-controls="account-accordion-child"
                 >
                  <div className="p-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-md group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-200">
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
                      <path d="m7 11 2-2-2-2"/>
                      <path d="M11 13h4"/>
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    </svg>
                  </div>
                  <span className="font-medium">System Setup</span>

                  <svg className="hs-accordion-active:block ms-auto hidden size-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>

                  <svg className="hs-accordion-active:hidden ms-auto block size-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
                </button>

                <div id="account-accordion-child" className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="account-accordion">
                  <ul className="ps-6 pt-2 space-y-1">
                    {userRole && hasAccess(userRole, "admin") && (
                      <li>
                                                 <NavLink
                           to="/admin"
                           className={({ isActive }) =>
                             isActive 
                               ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 shadow-lg" 
                               : "text-slate-400 hover:text-white"
                           }
                         >
                           {({ isActive }) => (
                             <div className="flex items-center gap-x-3 py-2.5 px-4 text-xs rounded-r-lg hover:bg-white/5 transition-all duration-200 group">
                               {isActive && <div className="w-1 h-6 bg-purple-400 rounded-r"></div>}
                            <div className="p-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-md group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-200">
                              <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/></svg>
                            </div>
                                                         <span className="font-medium">Access Management</span>
                           </div>
                           )}
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

        {/* Sign Out Section */}
        <div className="flex-shrink-0 border-t border-slate-700/50 p-1">
          <button
            className="w-full text-left text-xs text-slate-400 hover:text-red-400 hover:cursor-pointer flex items-center gap-x-3 py-3 px-4 rounded-lg hover:bg-red-500/10 transition-all duration-200 group"
            onClick={handleSignOut}
          >
            <div className="p-1.5 bg-gradient-to-r from-red-500/30 to-red-700/30 rounded-md group-hover:from-red-500/30 group-hover:to-pink-500/30 transition-all duration-200">
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


