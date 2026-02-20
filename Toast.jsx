import React, { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? '#28a745' : '#dc3545';

  return (
    <div style={{...toastStyle, background: bgColor}}>
      {message}
    </div>
  );
}

const toastStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 1000,
  fontWeight: 'bold',
  fontFamily: 'sans-serif'
};