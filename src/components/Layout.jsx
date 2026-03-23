// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import Sidebar from '@/components/Sidebar';
// import Header from '@/components/Header';

// const Layout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
//       <div
//         className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
//           sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
//         }`}
//       >
//         <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//         <motion.main
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto"
//         >
//           {children}
//         </motion.main>
//       </div>
//     </div>
//   );
// };

// export default Layout;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex relative">

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className={`fixed inset-0 bg-black/40 z-30 lg:hidden `}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:ml-64 ml-64' : 'lg:ml-20 ml-20'}
        `}
      >
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:p-4 p-3 lg:p-7 flex-1 overflow-y-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
