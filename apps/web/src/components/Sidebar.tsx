import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  House, 
  TriangleAlert, 
  Boxes, 
  Wrench, 
  Map,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
    },
    {
      path: '/incidencias',
      label: 'Incidencias',
      icon: TriangleAlert,
    },
    {
      path: '/inventario',
      label: 'Inventario',
      icon: Boxes,
    },
    {
      path: '/mantenimiento',
      label: 'Mantenimiento',
      icon: Wrench,
    },
    {
      path: '/mapa',
      label: 'Mapa',
      icon: Map,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
          style={{ zIndex: 1040 }}
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`sidebar d-flex flex-column ${
          isOpen ? 'show' : ''
        }`}
      >
        {/* Logo */}
        <div className="p-3 border-bottom border-secondary">
          <h4 className="text-white mb-0">
            <House className="me-2" size={24} />
            TFG Mineria
          </h4>
        </div>

        {/* Navigation */}
        <Nav className="flex-column p-3 flex-grow-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Nav.Item key={item.path}>
                <Nav.Link
                  as={Link}
                  to={item.path}
                  className={`d-flex align-items-center py-2 ${
                    isActive ? 'active' : ''
                  }`}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 992) {
                      onToggle();
                    }
                  }}
                >
                  <Icon className="me-3" size={20} />
                  {item.label}
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>

        {/* Footer */}
        <div className="p-3 border-top border-secondary">
          <small className="text-muted">
            Sistema de Gestión Minera
          </small>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
