import React from 'react';

const Header: React.FC = () => {

  return (
      <header className="min-h-screen-8 bg-gold flex justify-between items-center shadow px-5 fixed w-screen">
          <h1 className="title font-semibold">CSV to TTL converter</h1>
          <p className="release">v1.0.0</p>
      </header>
  );
};

export default Header;
