import React from 'react';

function Container({ children, className = '' }) {
  return <div className={`w-full max-w-7xl ${className}`}>{children}</div>;
}

export default Container;
