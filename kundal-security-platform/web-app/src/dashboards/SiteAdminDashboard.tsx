import React from 'react';
import { Layout } from '../layouts/Layout';
import { UsersIcon, ShieldCheckIcon, ChartBarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export const SiteAdminDashboard: React.FC = () => {
  return (
    <Layout title="Site Admin Dashboard">
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
             <div className="flex items-center">
                <div className="p-3 rounded-md bg-blue-100">
                   <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                   <p className="text-sm font-medium text-gray-500">Active Guards</p>
                   <p className="text-2xl font-semibold text-gray-900">12/15</p>
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
             <div className="flex items-center">
                <div className="p-3 rounded-md bg-green-100">
                   <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                   <p className="text-sm font-medium text-gray-500">Patrol Compliance</p>
                   <p className="text-2xl font-semibold text-gray-900">94%</p>
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
             <div className="flex items-center">
                <div className="p-3 rounded-md bg-orange-100">
                   <ClipboardDocumentListIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                   <p className="text-sm font-medium text-gray-500">Open Incidents</p>
                   <p className="text-2xl font-semibold text-gray-900">2</p>
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
             <div className="flex items-center">
                <div className="p-3 rounded-md bg-purple-100">
                   <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                   <p className="text-sm font-medium text-gray-500">Today's Visitors</p>
                   <p className="text-2xl font-semibold text-gray-900">142</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shift Monitoring */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Live Shift Monitoring</h3>
              <button className="text-sm text-brand-navy hover:text-blue-800 font-medium">Assign Guards</button>
            </div>
            <ul className="divide-y divide-gray-200">
              {[
                { name: 'Ramesh Singh', role: 'Main Gate', status: 'On Duty', time: '08:00 AM - 04:00 PM', late: false },
                { name: 'Suresh Kumar', role: 'Tower A', status: 'On Duty', time: '08:00 AM - 04:00 PM', late: false },
                { name: 'Amit Patel', role: 'Basement', status: 'Absent', time: '08:00 AM - 04:00 PM', late: true },
              ].map((guard) => (
                <li key={guard.name} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                     <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UsersIcon className="h-6 w-6 text-gray-500" />
                     </div>
                     <div className="ml-4">
                       <p className="text-sm font-medium text-gray-900">{guard.name}</p>
                       <p className="text-xs text-gray-500">{guard.role} | {guard.time}</p>
                     </div>
                  </div>
                  <div>
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        guard.status == 'On Duty' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                     }`}>
                        {guard.status}
                     </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Visitor Analytics Summary */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Visitor Analytics</h3>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gray-50 rounded flex items-center justify-center border border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                   <ChartBarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                   <p>Visitor trends graph placeholder</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                 <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">86</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Guests</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">34</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Services</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">22</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
