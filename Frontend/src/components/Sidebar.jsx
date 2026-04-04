
import { useState, useEffect, useCallback } from 'react';
import { 
  FaTachometerAlt, 
  FaPlus, 
  FaUser, 
  FaCalendarAlt, 
  FaBars,
  FaTimes  
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', path: '/dashboard' },
    { icon: FaPlus, label: 'Add Task', path: '/add-task' },
    { icon: FaCalendarAlt, label: 'Task List', path: '/task-list' },
    { icon: FaUser, label: 'Profile', path: '/profile' },
  ];

  const toggleSidebar = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 black-card p-3 rounded-xl glow shadow-lg md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <FaBars size={20} className="text-yellow-400" />
      </button>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="black-card h-screen p-6 w-64 shadow-2xl border-r border-yellow-500/30 sticky top-0">
          <nav className="space-y-2 mt-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 p-4 rounded-xl transition-all group hover:shadow-lg ${
                    isActive 
                      ? 'bg-gradient-to-r from-yellow-500/30 to-yellow-400/30 border-r-4 border-yellow-400 shadow-yellow-500/25 text-yellow-400 font-semibold'
                      : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 border border-transparent hover:border-yellow-500/50'
                  }`}
                  onClick={closeSidebar}
                >
                  <Icon size={20} />
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {isOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={closeSidebar}
            />
          )}
          
          <div className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out black-card shadow-2xl border-r border-yellow-500/50 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                  Menu
                </h2>
                <button
                  onClick={closeSidebar}
                  className="p-2 hover:bg-yellow-500/10 rounded-xl transition-all"
                >
                  <FaTimes size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            <nav className="p-4 space-y-2 mt-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 p-4 rounded-xl transition-all group w-full ${
                      isActive 
                        ? 'bg-gradient-to-r from-yellow-500/30 to-yellow-400/30 border-r-4 border-yellow-400 shadow-lg text-yellow-400 font-semibold'
                        : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                    onClick={closeSidebar}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;