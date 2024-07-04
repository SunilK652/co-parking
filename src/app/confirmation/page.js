'use client';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import Confetti from 'react-confetti';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/layout/page';
import { useParking } from '../ParkingContext';

const ConfirmationPage = () => {
  const { parkingDetails } = useParking();
  const [showDetails, setShowDetails] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const getDirectionsLink = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  };

  useEffect(() => {
    toast.success('Your slot is confirmed!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setTimeout(() => {
      setShowDetails(true);
    }, 5000);
   
  }, []);
  useEffect(() => {
    if (showDetails) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 8000);
    }
  }, [showDetails]);

  return (
    <Layout>
      <div className="p-8">
        {parkingDetails && (
        <><h1 className="text-2xl font-bold mb-6">Confirm Parking Selection</h1><div className="bg-white shadow-md rounded-lg p-6">
            {showDetails ? (
              <>
                {showConfetti && <Confetti />}
                <p className="text-lg font-semibold mb-4">You have selected parking space:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700"><strong>Name:</strong> {parkingDetails?.name}</li>
                  <li className="text-gray-700"><strong>Address:</strong> {parkingDetails?.address}</li>
                  <li className="text-gray-700"><strong>Spot Name:</strong> {parkingDetails?.spotName}</li>
                  <li className="text-gray-700"><strong>Landmark:</strong> {parkingDetails?.landMark}</li>
                  <li className="text-gray-700"><strong>From Date:</strong> {moment(parkingDetails?.fromDate).format('MMMM DD, hA')}</li>
                  <li className="text-gray-700"><strong>To Date:</strong> {moment(parkingDetails?.toDate).format('MMMM DD, hA')}</li>
                  <li className="text-gray-700"><strong>Phone Number:</strong> {parkingDetails?.phoneNumber}</li>
                  <li className="text-gray-700"><strong>Pincode:</strong> {parkingDetails?.pinCode}</li>
                </ul>
                <div className="mt-6">
                  <a
                    href={getDirectionsLink(parkingDetails?.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Get Directions
                  </a>
                </div>
              </>
            ) : null}
          </div></>
        )}
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default ConfirmationPage;
