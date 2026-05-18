import React from 'react';
import { Layout } from '../layouts/Layout';
import { BuildingOfficeIcon, ShieldCheckIcon, UsersIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

export const AreaOfficerDashboard: React.FC = () => {
  return (
    <Layout title="Area Officer Dashboard">
      <div className="space-y-6">

        {/* Metric Cards - Multi Site view */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
             <div className="p-3 rounded-md bg-blue-100">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
             </div>
             <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sites Assigned</p>
                <p className="text-2xl font-semibold text-gray-900">4</p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
             <div className="p-3 rounded-md bg-green-100">
                <UsersIcon className="h-6 w-6 text-green-600" />
             </div>
             <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Personnel on Duty</p>
                <p className="text-2xl font-semibold text-gray-900">32/35</p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
             <div className="p-3 rounded-md bg-red-100">
                <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
             </div>
             <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Incidents</p>
                <p className="text-2xl font-semibold text-gray-900">1</p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
             <div className="p-3 rounded-md bg-orange-100">
                <ShieldCheckIcon className="h-6 w-6 text-orange-600" />
             </div>
             <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Patrol Compliance</p>
                <p className="text-2xl font-semibold text-gray-900">88%</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Multi-Site Monitoring Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Site Status Overview</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guards (Active/Total)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patrols Completed</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incidents</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { site: 'DLF Phase 1', active: 12, total: 12, patrols: '100%', incidents: 0, status: 'ok' },
                    { site: 'Golf Course Extension', active: 8, total: 9, patrols: '75%', incidents: 0, status: 'warning' },
                    { site: 'Cyber Hub Towers', active: 7, total: 8, patrols: '100%', incidents: 1, status: 'alert' },
                    { site: 'Sushant Lok A', active: 5, total: 6, patrols: '50%', incidents: 0, status: 'warning' },
                  ].map((site) => (
                    <tr key={site.site}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{site.site}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={site.active < site.total ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                           {site.active}
                        </span> / {site.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{site.patrols}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {site.incidents > 0 ? (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                             {site.incidents} Open
                           </span>
                        ) : '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-brand-navy hover:text-blue-900">View Details</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Absentee Alerts */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center bg-red-50">
              <h3 className="text-lg leading-6 font-medium text-red-900 flex items-center">
                 <ShieldExclamationIcon className="h-5 w-5 mr-2" />
                 Absentee & Late Alerts
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
               {[
                 { name: 'Vikram Singh', site: 'Golf Course Extension', expected: '08:00 AM', delay: '1h 30m' },
                 { name: 'Rahul Sharma', site: 'Cyber Hub Towers', expected: '08:00 AM', delay: '1h 30m' },
                 { name: 'Deepak Kumar', site: 'Sushant Lok A', expected: '09:00 AM', delay: '30m' }
               ].map((alert) => (
                 <li key={alert.name} className="p-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-bold text-gray-900">{alert.name}</p>
                       <p className="text-xs text-gray-500">Site: {alert.site}</p>
                       <p className="text-xs text-red-600 mt-1">Expected: {alert.expected} (Late by {alert.delay})</p>
                     </div>
                     <div>
                       <button className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                         Call
                       </button>
                       <button className="ml-2 bg-brand-navy border border-transparent rounded px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-800">
                         Reassign
                       </button>
                     </div>
                   </div>
                 </li>
               ))}
            </ul>
          </div>

          {/* Incident Overview Feed */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Incidents Feed</h3>
            </div>
            <ul className="divide-y divide-gray-200">
               {[
                 { type: 'Suspicious Activity', site: 'Cyber Hub Towers', time: '10 mins ago', severity: 'Medium' },
                 { type: 'Gate Barrier Malfunction', site: 'DLF Phase 1', time: '2 hours ago', severity: 'Low' },
                 { type: 'Guard Dispute', site: 'Golf Course Extension', time: 'Yesterday', severity: 'Medium', resolved: true }
               ].map((incident, i) => (
                 <li key={i} className={`p-4 ${incident.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                           <span className={`w-2 h-2 rounded-full mr-2 ${incident.severity == 'Medium' ? 'bg-orange-500' : 'bg-yellow-500'}`}></span>
                           <p className="text-sm font-medium text-gray-900">{incident.type}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{incident.site}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-gray-500">{incident.time}</p>
                         {incident.resolved ? (
                           <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-800 rounded">Resolved</span>
                         ) : (
                           <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-800 rounded">Action Req</span>
                         )}
                      </div>
                    </div>
                 </li>
               ))}
            </ul>
          </div>

        </div>
      </div>
    </Layout>
  );
};
