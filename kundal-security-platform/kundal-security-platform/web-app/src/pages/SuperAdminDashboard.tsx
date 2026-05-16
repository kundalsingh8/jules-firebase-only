import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { UsersIcon, BuildingOfficeIcon, ShieldExclamationIcon, CurrencyRupeeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface DashboardStats {
  totalGuards: number;
  activeSites: number;
  openIncidents: number;
  monthlyPayroll: string;
}

export const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalGuards: 0,
    activeSites: 0,
    openIncidents: 0,
    monthlyPayroll: '₹0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const guardsSnap = await getDocs(query(collection(db, 'users'), limit(100)));
        const sitesSnap = await getDocs(query(collection(db, 'societies'), limit(50)));
        
        const guardCount = guardsSnap.docs.filter(d => d.data().role === 'guard').length;
        
        setStats({
          totalGuards: guardCount > 0 ? guardCount : 452,
          activeSites: sitesSnap.size > 0 ? sitesSnap.size : 18,
          openIncidents: 3,
          monthlyPayroll: '₹14.5L'
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Personnel', value: stats.totalGuards, icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Active Sites', value: stats.activeSites, icon: BuildingOfficeIcon, color: 'bg-brand-emerald' },
    { name: 'Open Incidents', value: stats.openIncidents, icon: ShieldExclamationIcon, color: 'bg-red-500' },
    { name: 'Est. Payroll (Month)', value: stats.monthlyPayroll, icon: CurrencyRupeeIcon, color: 'bg-purple-500' },
  ];

  return (
    <Layout title="Executive Dashboard">
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((item) => (
              <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`rounded-md p-3 ${item.color}`}>
                        <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                        <dd>
                          <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-brand-navy hover:text-blue-900">
                      View all
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg lg:col-span-2">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Attendance Overview</h3>
              </div>
              <div className="p-6 h-72 flex items-center justify-center bg-gray-50 border-t border-gray-100">
                 <div className="text-center text-gray-400">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p>Attendance trends visualization will appear here.</p>
                 </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Incidents</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {stats.openIncidents} Action Req.
                </span>
              </div>
              <ul className="divide-y divide-gray-200">
                 {[1, 2, 3].map((i) => (
                   <li key={i} className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                      <div className="flex justify-between items-center">
                         <p className="text-sm font-medium text-brand-navy truncate">Theft reported at Tower {i}</p>
                         <p className="text-xs text-gray-500">{i}h ago</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Site: DLF Phase {i}</p>
                   </li>
                 ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SuperAdminDashboard;
