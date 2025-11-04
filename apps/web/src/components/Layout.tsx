import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useAuthStore } from '../store/authStore';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`app-layout ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <Header 
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          user={user}
        />
        
        {/* Page Content */}
        <main className="page-content">
          <Container fluid className="py-4">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Layout;
