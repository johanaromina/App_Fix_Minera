import React from 'react';
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import { Menu, Bell, User, LogOut } from 'lucide-react';

interface User {
  id: string;
  nombre: string;
  email: string;
  roles: string[];
}

interface HeaderProps {
  onToggleSidebar: () => void;
  onLogout: () => void;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onLogout, user }) => {
  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm">
      <div className="d-flex align-items-center">
        <Button
          variant="outline-secondary"
          className="d-lg-none me-3"
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </Button>
        
        <Navbar.Brand className="fw-bold text-primary-custom">
          Panel de Control
        </Navbar.Brand>
      </div>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto align-items-center">
          {/* Notifications */}
          <Nav.Item className="me-3">
            <Button variant="outline-secondary" size="sm" className="position-relative">
              <Bell size={18} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </Button>
          </Nav.Item>

          {/* User Menu */}
          <Dropdown align="end">
            <Dropdown.Toggle as={Button} variant="outline-secondary" size="sm">
              <User className="me-2" size={18} />
              {user?.nombre || 'Usuario'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>
                <div className="fw-bold">{user?.nombre}</div>
                <small className="text-muted">{user?.email}</small>
              </Dropdown.Header>
              
              <Dropdown.Divider />
              
              <Dropdown.Item>
                <User className="me-2" size={16} />
                Perfil
              </Dropdown.Item>
              
              <Dropdown.Item>
                Configuración
              </Dropdown.Item>
              
              <Dropdown.Divider />
              
              <Dropdown.Item onClick={onLogout} className="text-danger">
                <LogOut className="me-2" size={16} />
                Cerrar Sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
