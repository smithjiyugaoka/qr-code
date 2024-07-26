'use client';

import React, { useState } from 'react';

const QRCodeGenerator: React.FC = () => {
  const [businessName, setBusinessName] = useState('');

  const generateQRCode = () => {
    // TODO: Implement QR code generation
    console.log('Generating QR code for:', businessName);
  };

  return (
    <div>
      <input
        type="text"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        placeholder="Enter business name"
      />
      <button onClick={generateQRCode}>Generate QR Code</button>
    </div>
  );
};

export default QRCodeGenerator;