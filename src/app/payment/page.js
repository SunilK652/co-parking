"use client";

import React, { useEffect, useState } from "react";
import { Frames, CardFrame } from "frames-react";
import Layout from "../components/layout/page";
import { getQRCode, checkout, sendPaymentConfirmationFlag } from "../apiMethod";
import { useRouter } from "next/navigation";
import '../globals.css'

const PaymentInfo = () => {
  const [qrCodeData, setQRCodeData] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [pToken, setPToken] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("qr");
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selectedPaymentMethod === "qr" || "card") {
      setShowLoader(true);
      setTimeout(() => {
        generateAndShowQRCode();
        setShowLoader(false);
      }, 1000);
    }
  }, [selectedPaymentMethod]);

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
      const response = await checkout(token);
      
      const redirectUrl = response?.response?._links?.redirect?.href;
  
      if (redirectUrl) {
        window.open(redirectUrl, '_blank');
      } else {
        setError("No redirect URL found in the response");
      }
    } catch (error) {
      console.error('Error in getToken:', error);
      setError("Failed to process payment");
    }
  };

  const confirmPayment = async () => {
    try {
      await sendPaymentConfirmationFlag({ paymentConfirmed: true });
      setPaymentConfirmed(true);
      router.push("/confirmation");
    } catch (error) {
      setError("Failed to confirm payment");
    }
  };

  return (
    <Layout>
      <div className="max-w-full mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Payment Information</h1>
        <div className="flex">
          <div className="w-1/4">
            <nav className="flex flex-col space-y-4">
              <button
                className={`py-2 px-4 ${selectedPaymentMethod === "qr" ? "bg-gray-300" : ""}`}
                onClick={() => setSelectedPaymentMethod("qr")}
              >
                Pay with QR Code
              </button>
              <button
                className={`py-2 px-4 ${selectedPaymentMethod === "card" ? "bg-gray-300" : ""}`}
                onClick={() => setSelectedPaymentMethod("card")}
              >
                Pay with Card
              </button>
            </nav>
          </div>
          <div className="w-3/4 pl-4 flex justify-center">
            {showLoader ? (
              <div className="flex items-center justify-center">
                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12"></div>
              </div>
            ) : (
              <>
                {selectedPaymentMethod === "qr" && (
                  <>
                    {loading && <p>Loading QR Code...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {qrCodeData && (
                      <div className="border p-4 rounded-md shadow-md max-w-xs text-center">
                        <img src={qrCodeData} alt="QR Code" className="mx-auto mb-4" />
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
                  </>
                )}
                {selectedPaymentMethod === "card" && (
                  <div className="border p-4 rounded-md shadow-md max-w-xs text-center">
                    <Frames
                      config={{
                        publicKey: "pk_sbox_cowrngzw3k2ot4ygdb433zdxfqv",
                      }}
                      cardTokenized={(e) => {
                        setPToken(e.token);
                        getToken(e.token);
                      }}
                    >
                      <CardFrame />
                      <button
                        onClick={(e) => {
                          Frames.submitCard();
                        }}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        PAY INR 20.00
                      </button>
                    </Frames>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentInfo;
