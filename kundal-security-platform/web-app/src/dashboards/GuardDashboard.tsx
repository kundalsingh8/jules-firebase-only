import React from 'react';
import { Layout } from '../layouts/Layout';
import { CameraIcon, QrCodeIcon, ShieldExclamationIcon, ClockIcon } from '@heroicons/react/24/outline';

export const GuardDashboard: React.FC = () => {
  return (
    <Layout title="Guard Dashboard">
      <div className="space-y-6">

        {/* Main Status & Shift */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center border-l-4 border-green-500">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shift Active</h2>
            <p className="text-gray-600 mt-1">Started at 08:00 AM (4 hours remaining)</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
             <button className="bg-white border-2 border-red-500 text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-red-50 transition-colors">
               SOS / Panic
             </button>
             <button className="bg-brand-navy text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors">
               Clock Out
             </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
               <CameraIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Visitor Check-in</h3>
            <p className="text-sm text-gray-500 text-center mt-1">Log entry & take photo</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
               <QrCodeIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">QR Patrol</h3>
            <p className="text-sm text-gray-500 text-center mt-1">Scan site checkpoints</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
               <ShieldExclamationIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Report Incident</h3>
            <p className="text-sm text-gray-500 text-center mt-1">Log security issue</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
               <ClockIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Shift Log</h3>
            <p className="text-sm text-gray-500 text-center mt-1">View attendance history</p>
          </div>
        </div>

        {/* Tasks & Patrols */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Assigned Patrols</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            <li className="p-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center">
                 <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <CheckBadgeIcon className="h-6 w-6 text-green-600" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-gray-900">Morning Perimeter Check</p>
                   <p className="text-xs text-gray-500">Completed at 09:15 AM (12/12 Checkpoints)</p>
                 </div>
              </div>
            </li>
            <li className="p-4 sm:px-6 flex items-center justify-between bg-yellow-50">
              <div className="flex items-center">
                 <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center mr-4">
                    <QrCodeIcon className="h-6 w-6 text-yellow-700" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-gray-900">Afternoon Basement Check</p>
                   <p className="text-xs text-yellow-700 font-medium">Due in 30 mins (0/8 Checkpoints)</p>
                 </div>
              </div>
              <button className="bg-brand-navy text-white px-3 py-1.5 rounded text-sm font-bold">Start Now</button>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

// Extracted from original Resident Dashboard creation attempt for icon compatibility
const CheckBadgeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>
);
