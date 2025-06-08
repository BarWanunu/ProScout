// This is a simple layout component that wraps the main content of the application with a header and footer.
import React from 'react';
import Header from './Header';
import Footer from './Footer';

// The AppLayout component is a functional component that takes children as props and wraps them with a header and footer.
const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
        <main className="flex-1">
            {children}
        </main>
    </div>
  );
};

export default AppLayout;