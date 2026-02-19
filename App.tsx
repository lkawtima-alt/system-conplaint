
import React, { useState } from 'react';
import ComplaintForm from './components/ComplaintForm';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';

type View = 'customer' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('customer');

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8 flex justify-center">
          <div className="relative flex p-1 bg-gray-200 rounded-full">
            <button
              onClick={() => setView('customer')}
              className={`w-40 md:w-48 py-2.5 text-sm font-medium leading-5 rounded-full focus:outline-none transition-colors duration-300 ease-in-out ${
                view === 'customer' ? 'bg-purple-700 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
              }`}
            >
              แจ้งเรื่องร้องเรียน (Customer)
            </button>
            <button
              onClick={() => setView('admin')}
              className={`w-40 md:w-48 py-2.5 text-sm font-medium leading-5 rounded-full focus:outline-none transition-colors duration-300 ease-in-out ${
                view === 'admin' ? 'bg-purple-700 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
              }`}
            >
              สำหรับเจ้าหน้าที่ (Admin)
            </button>
          </div>
        </div>

        <div>
          {view === 'customer' ? <ComplaintForm /> : <AdminDashboard />}
        </div>
      </main>
    </div>
  );
};

export default App;
