'use client';
import React from 'react';

const QrCodeModal = ({ qrCodeData, confirmPayment, closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <button className="absolute top-2 right-2 text-gray-500" onClick={closeModal}>
          &times;
        </button>
        <img src={qrCodeData} alt="QR Code" />
        <button onClick={confirmPayment} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md">
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default QrCodeModal;
