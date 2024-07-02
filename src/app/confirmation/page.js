'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '../components/layout/page';
import { useEffect, useState } from 'react';

const ConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [parkingDetails, setParkingDetails] = useState({});

  useEffect(() => {
    const details = {
      name: searchParams.get('name'),
      address: searchParams.get('address'),
      spotName: searchParams.get('spotName'),
      landMark: searchParams.get('landMark'),
      phoneNumber: searchParams.get('phoneNumber'),
      pinCode: searchParams.get('pinCode'),
    };
    setParkingDetails(details);
  }, [searchParams]);

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Confirm Parking Selection</h1>
        <p>You have selected parking space:</p>
        <ul className="mt-4 space-y-2">
          <li className="text-gray-700"><strong>Name:</strong> {parkingDetails.name}</li>
          <li className="text-gray-700"><strong>Address:</strong> {parkingDetails.address}</li>
          <li className="text-gray-700"><strong>Spot Name:</strong> {parkingDetails.spotName}</li>
          <li className="text-gray-700"><strong>Landmark:</strong> {parkingDetails.landMark}</li>
          <li className="text-gray-700"><strong>Phone Number:</strong> {parkingDetails.phoneNumber}</li>
          <li className="text-gray-700"><strong>Pincode:</strong> {parkingDetails.pinCode}</li>
        </ul>
        {/* Additional confirmation UI can be added here */}
      </div>
    </Layout>
  );
};

export default ConfirmationPage;
