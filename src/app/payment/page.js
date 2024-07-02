"use client";

import React, { useEffect, useState } from "react";
import { Frames, CardFrame } from "frames-react";
import Layout from "../components/layout/page";
import { getQRCode } from "../apiMethod";
import { useRouter } from "next/navigation";
import { checkout } from '../apiMethod';

const PaymentInfo = () => {
  const [qrCodeData, setQRCodeData] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [pToken, setPToken] = useState('');
  const router = useRouter();

//   useEffect(() => {
//     generateAndShowQRCode();
//   }, []);

  const generateAndShowQRCode = async () => {
    setLoading(true);
    try {
      const response = await getQRCode();
      setQRCodeData(response.qrCodeData);
      setPaymentConfirmed(false);
      setError("");
    } catch (error) {
      setError("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  const getToken = async (token) => {
    try {
      console.log('token', token);
      const response = await checkout(token);
      
      const redirectUrl = response?.response?._links?.redirect?.href;
  
      if (redirectUrl) {
        console.log('Redirect URL:', redirectUrl);
        window.open(redirectUrl, '_blank');
      } else {
        setError("No redirect URL found in the response");
      }
    } catch (error) {
      console.error('Error in getToken:', error);
      setError("Failed to process payment");
    }
  };
  

  const confirmPayment = () => {
    setPaymentConfirmed(true);
    // For example, redirect to confirmation page after payment
    router.push("/confirmation");
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Payment Information</h1>

        <Frames
          config={{
            publicKey: "pk_sbox_j7khzamf34dua34ou5o2zvd37ej",
          }}
          cardTokenized={(e) => {
            setPToken(e.token);
            getToken(e.token);
            console.log('token', e.token);
          }}
        >
          <CardFrame />

          <button
            onClick={() => {
              Frames.submitCard();
            }}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            PAY INR 20.00
          </button>
        </Frames>

        {loading && <p>Loading QR Code...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {qrCodeData && (
          <div className="mt-4">
            <img src={qrCodeData} alt="QR Code" />
            <button
              onClick={confirmPayment}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              disabled={paymentConfirmed}
            >
              {paymentConfirmed ? 'Payment Confirmed' : 'Confirm Payment'}
            </button>
          </div>
        )}

        {paymentConfirmed && <p className="text-green-500 mt-4">Payment Confirmed!</p>}
      </div>
    </Layout>
  );
};

export default PaymentInfo;
