import { Link, useLocation } from 'react-router-dom';
import staffAvatar from '../../assets/default-avatar.png';
import { useAuth } from '../../contexts/authContext';
import { useSignOut } from '../../hooks/useSignOut';

const nameMap: Record<string, string> = {
  'sales-database': 'Sales Database',
  'admin': 'Access Management',
  'add': 'Add Inventory Item',
  // Add more custom names here if needed
};

export default function Header() {
  const { user } = useAuth();
  const handleSignOut = useSignOut();
  const location = useLocation();

  const paths = location.pathname.split('/').filter(Boolean); // removes empty strings
  const breadcrumbPaths = paths.map((segment, index) => {
    const path = '/' + paths.slice(0, index + 1).join('/');
    const name = nameMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return { name, path };
  });

  return (
    <header className="sticky top-0 inset-x-0 z-40 w-full bg-white border-b border-gray-300 shadow-xs">
      <nav className="px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Breadcrumb */}
        <ol className="flex items-center space-x-1.5 text-sm text-teal-600 whitespace-nowrap">
          <li>
            <Link to="/" className="hover:underline text-gray-800">Home</Link>
            {breadcrumbPaths.length > 0 && (
              <svg
                className="mx-2 h-4 w-4 text-gray-600 inline-block"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </li>

          {breadcrumbPaths.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index < breadcrumbPaths.length - 1 ? (
                <>
                  <Link to={crumb.path} className="hover:underline text-gray-800">
                    {crumb.name}
                  </Link>
                  <svg
                    className="mx-2 h-4 w-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                <span className="font-semibold truncate">{crumb.name}</span>
              )}
            </li>
          ))}
        </ol>
        {/* End Breadcrumb */}

        {/* Avatar Dropdown */}
        <div className="flex items-center space-x-3">
          <div className="hs-dropdown relative inline-flex">
            <button
              id="hs-dropdown-account"
              type="button"
              className="w-10 h-10 flex justify-center items-center rounded-full hover:cursor-pointer"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <img
                className="w-10 h-10 rounded-full border border-gray-300"
                src={staffAvatar}
                alt="Avatar"
              />
            </button>

            <div
              className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-account"
            >
              <div className="py-3 px-5 bg-gray-100 rounded-t-lg">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-800">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 hover:cursor-pointer"
                >
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Avatar Dropdown */}
      </nav>
    </header>
  );
}
