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
  XMarkIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { userData, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
    { name: 'Sites', href: '/sites', icon: BuildingOfficeIcon, current: false },
    { name: 'Personnel', href: '/personnel', icon: UsersIcon, current: false },
    { name: 'Incidents', href: '/incidents', icon: ShieldCheckIcon, current: false },
    { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon, current: false },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out', error);
    }
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
              <div className="h-8 w-8 bg-white rounded flex items-center justify-center mr-3">
                <span className="text-brand-navy font-bold text-xl">K</span>
              </div>
              <span className="text-white font-bold tracking-wide">Kundal Security</span>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                     <div className="h-9 w-9 rounded-full bg-blue-700 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">AD</span>
                     </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{userData?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
                    <button onClick={handleSignOut} className="text-xs font-medium text-blue-200 hover:text-white flex items-center mt-1">
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-navy lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
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
