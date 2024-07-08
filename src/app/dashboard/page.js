"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from 'moment';
import withAuth from "../withAuth/withAuth";
import Layout from "../components/layout/page";
import { getOwners } from "../apiMethod";
import { useParking } from '../ParkingContext';

const DEFAULT_LOCATION = { latitude: 12.94826, longitude: 77.576851 };
const RADIUS = 2000;

const fetchAreaName = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error("Error fetching area name:", error);
    return null;
  }
};

const Dashboard = () => {
  const [location, setLocation] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedParking, setSelectedParking] = useState(null);
  const router = useRouter();
  const { setParkingDetails } = useParking();

  const getDirectionsLink = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  };

  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        const owners = await getOwners();
        setSearchResults(owners);
        setFilteredResults(owners);
      } catch (error) {
        console.error("Error fetching parking spots:", error);
        setSearchResults([]);
        setFilteredResults([]);
      }
    };

    fetchParkingSpots();
  }, []);

  useEffect(() => {
    const filteredResults = searchResults.filter((result) => {
      if (filter === "all") return true;
      return result.segment?.toLowerCase() === filter;
    });
    setFilteredResults(filteredResults);
  }, [filter, searchResults]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSelectParking = (parking) => {
    setSelectedParking(parking);
    setShowModal(true);
  };

  const handleConfirmPayment = () => {
    const parkingDetails = {
      name: selectedParking?.name,
      address: selectedParking?.address,
      spotName: selectedParking?.spotName,
      landMark: selectedParking?.landMark,
      phoneNumber: selectedParking?.phoneNumber,
      pinCode: selectedParking?.pinCode,
      fromDate:selectedParking?.fromDate,
      toDate:selectedParking?.toDate,
      id: selectedParking?._id
    };

   // setSelectedParkingId(selectedParking?._id);

    setParkingDetails(parkingDetails);
    router.push('/payment');
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        {areaName && (
          <div className="my-4">
            <p>Location: {areaName}</p>
          </div>
        )}
        <div className="flex flex-col items-end my-4">
          <p className="mb-2">Select Your Segment</p>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="w-1/3 px-3 py-2 mb-4 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
        </div>
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredResults.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold">{result?.name}</h2>
                <p className="text-gray-600">{result?.segment}</p>
                <p className="text-gray-600">{result?.address}</p>
                <p className="text-gray-600">{result?.pinCode}</p>
                <p className="text-gray-600">
      From: {moment(result?.fromDate).format('MMMM DD, hA')}
    </p>
    <p className="text-gray-600">
      To: {moment(result?.toDate).format('MMMM DD, hA')}
    </p>
    <div className="flex items-center my-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      result?.parkingStatus === 'available'
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    {result?.parkingStatus === 'available' ? 'Available' : 'Booked'}
                  </span>
                </div>
                <div className="flex flex-col">
                <button
                    onClick={() => handleSelectParking(result)}
                    className={`mt-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      result?.parkingStatus === 'available'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={result?.parkingStatus !== 'available'}
                  >
                    Select Parking
                  </button>
                </div>
              </div>
            ))}
          </div>
        ): <p className="text-center">No Parking available</p>}
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium text-gray-900">
                      Payment Required
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        To view contact details and get directions, please make
                        a advance payment of one hour.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleConfirmPayment}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm Payment
                </button>
                <button
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default withAuth(Dashboard);
