import React from 'react';
import { Layout } from '../../layouts/Layout';
import { PlusIcon } from '@heroicons/react/24/outline';

export const Personnel: React.FC = () => {
  return (
    <Layout title="Personnel Management">
      <div className="flex justify-end mb-4">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-navy hover:bg-blue-900">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Personnel
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((person) => (
            <li key={person}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex text-sm">
                      <p className="font-medium text-brand-navy truncate">Security Guard {person}</p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500">in DLF Phase {person % 3 + 1}</p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>ID: KNDL-{1000 + person}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Shift {person % 2 === 0 ? 'Morning' : 'Night'}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Personnel;
