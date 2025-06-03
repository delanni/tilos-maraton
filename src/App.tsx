import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <NavLink 
              to="/" 
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Tilos Maraton 2025
            </NavLink>
            <div className="flex space-x-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                Program
              </NavLink>
              <NavLink 
                to="/info" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                Információk
              </NavLink>
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Tilos Rádió. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
