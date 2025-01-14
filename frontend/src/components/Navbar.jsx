import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Users, FileText, Coffee, Truck, Users as Staff } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const role = user.user?.role?.toLowerCase();

  const navLinks = [
    {
      to: '/dashboard',
      text: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      roles: ['admin', 'manager', 'delivery', 'pantry']
    },
    {
      to: '/patients',
      text: 'Patients',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin', 'manager']
    },
    {
      to: '/diet-charts',
      text: 'Diet Charts',
      icon: <FileText className="w-5 h-5" />,
      roles: ['admin', 'manager', 'pantry']
    },
    {
      to: '/meals',
      text: 'Meals',
      icon: <Coffee className="w-5 h-5" />,
      roles: ['admin', 'manager', 'pantry']
    },
    {
      to: '/deliveries',
      text: 'Deliveries',
      icon: <Truck className="w-5 h-5" />,
      roles: ['admin', 'delivery']
    },
    {
      to: '/pantry-staff',
      text: 'Pantry Staff',
      icon: <Staff className="w-5 h-5" />,
      roles: ['admin', 'pantry']
    }
  ];

  const isAuthorized = (roles) => {
    return roles.includes(role);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4">
            {navLinks.map((link) => 
              isAuthorized(link.roles) && (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `
                    flex items-center px-4 py-2 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-yellow-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'}
                    transition-colors duration-200
                  `}
                >
                  {link.icon}
                  <span className="ml-2">{link.text}</span>
                </NavLink>
              )
            )}
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Welcome, {user.user?.username}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
