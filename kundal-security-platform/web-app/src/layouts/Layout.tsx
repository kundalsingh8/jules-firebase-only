import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  DocumentChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  allowedRoles: string[];
}

const allNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, allowedRoles: ['super_admin', 'company_admin', 'area_officer', 'guard_supervisor', 'society_admin', 'guard', 'resident'] },
  { name: 'Sites', href: '/sites', icon: BuildingOfficeIcon, allowedRoles: ['super_admin', 'company_admin', 'area_officer', 'guard_supervisor'] },
  { name: 'Personnel', href: '/personnel', icon: UsersIcon, allowedRoles: ['super_admin', 'company_admin', 'area_officer', 'guard_supervisor', 'society_admin'] },
  { name: 'Incidents', href: '/incidents', icon: ShieldCheckIcon, allowedRoles: ['super_admin', 'company_admin', 'area_officer', 'guard_supervisor', 'society_admin', 'guard', 'resident'] },
  { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon, allowedRoles: ['super_admin', 'company_admin', 'area_officer', 'guard_supervisor', 'society_admin'] },
];

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { currentUser, userData, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const userRole = userData?.role || 'resident';

  const navigation = allNavigation.filter(item => item.allowedRoles.includes(userRole));

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-brand-navy">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button onClick={() => setSidebarOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-shrink-0 flex items-center px-4">
             <div className="h-8 w-8 bg-white rounded flex items-center justify-center mr-3">
               <span className="text-brand-navy font-bold text-xl">K</span>
             </div>
             <span className="text-white font-bold text-xl">Kundal Security</span>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-700 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-gray-300 group-hover:text-white" aria-hidden="true" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-brand-navy pt-5 pb-4 overflow-y-auto shadow-xl">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <div className="h-8 w-8 bg-white rounded flex items-center justify-center mr-3 shadow-sm">
                <span className="text-brand-navy font-bold text-xl">K</span>
              </div>
              <span className="text-white font-bold tracking-wide text-lg">Kundal Security</span>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-3 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive ? 'bg-blue-800 text-white shadow-sm' : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* User Profile Section in Sidebar */}
            <div className="flex-shrink-0 flex p-4 mx-3 mt-4 bg-blue-900 bg-opacity-50 rounded-xl border border-blue-800">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-inner border border-blue-400">
                        <span className="text-white font-semibold">{getInitials(currentUser?.email)}</span>
                     </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate" title={currentUser?.email || ''}>
                      {currentUser?.email || 'User'}
                    </p>
                    <p className="text-xs font-medium text-blue-200 mt-0.5">
                      {formatRoleName(userRole)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden bg-gray-50/50">
        {/* Top Navbar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200 lg:border-none lg:shadow-md">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-navy lg:hidden hover:bg-gray-50"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex-1 px-4 sm:px-6 flex justify-between items-center">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy p-1 hover:bg-gray-50 transition-colors"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-brand-navy text-white flex items-center justify-center">
                      {getInitials(currentUser?.email)}
                    </div>
                  </button>
                </div>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)}></div>
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 divide-y divide-gray-100"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex={-1}
                    >
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.email}</p>
                        <p className="text-xs text-brand-emerald font-semibold mt-1 bg-green-50 inline-block px-2 py-0.5 rounded-full">{formatRoleName(userRole)}</p>
                      </div>
                      <div className="py-1">
                        <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                          <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                          Your Profile
                        </a>
                        <a href="#" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                          <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                          Settings
                        </a>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleSignOut}
                          className="group flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          role="menuitem"
                        >
                          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" aria-hidden="true" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
