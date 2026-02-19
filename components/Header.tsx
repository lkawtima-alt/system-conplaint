
import React from 'react';

const PEALogo: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#4C1D95"/>
    <path d="M50 15L75 35V75L50 95L25 75V35L50 15Z" fill="#FBBF24"/>
    <path d="M50 25L65 40V70L50 85L35 70V40L50 25Z" fill="white"/>
    <path d="M50 42L60 50L50 58L40 50L50 42Z" fill="#4C1D95"/>
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-purple-800 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <PEALogo />
          <h1 className="text-xl md:text-2xl font-bold text-white">
            PEA Complaint System
          </h1>
        </div>
        <div className="text-sm text-purple-200">
          ระบบรับเรื่องร้องเรียน
        </div>
      </div>
    </header>
  );
};

export default Header;
