import logo from '../../assets/ez-logo.png';
import staffAvatar from '../../assets/default-avatar.png';
import { useAuth } from '../../contexts/authContext';
import { useSignOut } from '../../hooks/useSignOut';

export default function Header() {
  const { user } = useAuth();
  const handleSignOut = useSignOut();

  return (
    <>
      <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-48 w-full bg-white border-b border-gray-300 shadow-xs text-sm py-2.5 lg:ps-65">
        <nav className="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">

          <div className="me-5 lg:me-0 lg:hidden">
            <img src={logo} className="w-48 h-auto" alt="Logo"/>
            <div className="lg:hidden ms-1">
            </div>
          </div>

          <div className="w-full flex items-center justify-end ms-auto md:justify-between">
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                  <svg className="shrink-0 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>

                <input disabled id="searchbar" type="text" className="py-2 ps-10 pe-32 block w-full bg-gray-100 border border-gray-400 rounded-lg text-sm focus:outline-hidden focus:border-blue-500 checked:border-blue-500 disabled:cursor-not-allowed" placeholder="Search"/>
                
                <div className="hidden absolute inset-y-0 end-0 flex items-center z-20 pe-1">
                  <button type="button" className="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600" aria-label="Close">
                    <span className="sr-only">Close</span>
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-end gap-1 z-[999]">
              {/* <button type="button" className="size-9.5 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 hover:cursor-pointer focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span className="sr-only">Notifications</span>
              </button>

              {/* Dropdown */}
              <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
                <button id="hs-dropdown-account" type="button" className="size-9.5 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:cursor-pointer focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                  <img className="shrink-0 size-9 rounded-full border border-gray-300" src={staffAvatar} alt="Avatar" />
                </button>

                <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-account">
                  <div className="py-3 px-5 bg-gray-100 rounded-t-lg">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800">{ user?.email }</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <a onClick={handleSignOut} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 hover:cursor-pointer">
                      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      Sign Out
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
