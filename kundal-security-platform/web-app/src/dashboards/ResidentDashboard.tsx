import React from 'react';
import { Layout } from '../layouts/Layout';
import { ShieldExclamationIcon, MegaphoneIcon, ChatBubbleLeftRightIcon, UserGroupIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

export const ResidentDashboard: React.FC = () => {
  return (
    <Layout title="Resident Dashboard">
      <div className="space-y-6">
        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg shadow transition-colors">
            <ShieldExclamationIcon className="w-6 h-6" />
            <span className="font-bold text-lg">Emergency SOS</span>
          </button>

          <button className="flex items-center justify-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 p-4 rounded-lg shadow-sm transition-colors">
            <CheckBadgeIcon className="w-6 h-6 text-brand-emerald" />
            <span className="font-semibold">Pre-approve Visitor</span>
          </button>

          <button className="flex items-center justify-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 p-4 rounded-lg shadow-sm transition-colors">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500" />
            <span className="font-semibold">Log Complaint</span>
          </button>

          <button className="flex items-center justify-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 p-4 rounded-lg shadow-sm transition-colors">
             <UserGroupIcon className="w-6 h-6 text-purple-500" />
             <span className="font-semibold">My Visitors</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Visitor Approvals Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Approvals</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {[1].map((item) => (
                  <li key={item} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                           <UserGroupIcon className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Delivery Driver (Amazon)</p>
                        <p className="text-sm text-gray-500">Waiting at Main Gate</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                       <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                         Approve
                       </button>
                       <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-navy">
                         Deny
                       </button>
                    </div>
                  </li>
                ))}
                {[2, 3].map((item) => (
                  <li key={item} className="p-4 sm:px-6">
                    <div className="text-sm text-gray-500 italic text-center">No more pending approvals.</div>
                  </li>
                )).slice(0, 1)}
              </ul>
            </div>

            {/* Notice Board */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
               <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center">
                  <MegaphoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Notice Board</h3>
               </div>
               <div className="p-4 sm:px-6">
                  <div className="border-l-4 border-brand-navy pl-4 py-2 mb-4">
                     <p className="text-sm font-bold text-gray-900">Water Supply Interruption</p>
                     <p className="text-sm text-gray-600 mt-1">Water supply will be interrupted on Tower B from 2PM to 4PM due to maintenance.</p>
                     <p className="text-xs text-gray-400 mt-2">Posted 2 hours ago by Society Admin</p>
                  </div>
                  <div className="border-l-4 border-gray-300 pl-4 py-2">
                     <p className="text-sm font-bold text-gray-900">Annual General Meeting</p>
                     <p className="text-sm text-gray-600 mt-1">Please join us for the AGM this Sunday at the clubhouse.</p>
                     <p className="text-xs text-gray-400 mt-2">Posted 2 days ago by Society Admin</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar / Logs */}
          <div className="bg-white shadow rounded-lg overflow-hidden h-fit">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Visitors</h3>
            </div>
            <ul className="divide-y divide-gray-200">
               {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="p-4 flex items-center space-x-3">
                     <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">V</span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Visitor {i}</p>
                        <p className="text-xs text-gray-500 truncate">Entry: 10:{i}0 AM</p>
                     </div>
                     <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                           Completed
                        </span>
                     </div>
                  </li>
               ))}
            </ul>
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
               <a href="#" className="text-sm font-medium text-brand-navy hover:text-blue-800">View All Visitor Logs</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
