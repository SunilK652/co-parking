'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../withAuth/withAuth';
import Layout from '../components/layout/page';

const DEFAULT_LOCATION = { latitude: 12.948260, longitude: 77.576851 };
const RADIUS = 2000; 

const fetchResults = async (latitude, longitude, radius) => {
  // Dummy function to simulate fetching results based on location
  // Replace this with your actual API call
  console.log(`Fetching results for lat: ${latitude}, lon: ${longitude}, radius: ${radius}`);
  return ['Result 1', 'Result 2', 'Result 3'];
};

const fetchAreaName = async (latitude, longitude) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error('Error fetching area name:', error);
    return null;
  }
};

const Dashboard = () => {
  const [location, setLocation] = useState(null);
  const [areaName, setAreaName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locationDetails = { latitude, longitude };
            localStorage.setItem('userLocation', JSON.stringify(locationDetails));
            setLocation(locationDetails);

            // Fetch results based on user's actual location
            const results = await fetchResults(latitude, longitude, RADIUS);
            setSearchResults(results);

            // Fetch area name
            const area = await fetchAreaName(latitude, longitude);
            setAreaName(area);
          },
          async (error) => {
            console.error('Error fetching location:', error);

            // Use default location if geolocation is denied
            const results = await fetchResults(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, RADIUS);
            setSearchResults(results);

            // Fetch area name for default location
            const area = await fetchAreaName(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
            setAreaName(area);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  const handleSearch = async () => {
    // Fetch results based on search query and location
    const { latitude, longitude } = location || DEFAULT_LOCATION;
    const results = await fetchResults(latitude, longitude, RADIUS);
    setSearchResults(results.filter(result => result.toLowerCase().includes(searchQuery.toLowerCase())));
  };

  const handleSelectParking = (selectedParking) => {
    router.push(`/confirmation?selectedParking=${encodeURIComponent(selectedParking)}`);
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
      <div className="my-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full px-3 py-2 mb-4 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </div>
      {searchResults.length > 0 && (
        <ul className="mt-4 space-y-2">
          {searchResults.map((result, index) => (
            <li key={index}
            onClick={() => handleSelectParking(result)}
            className="px-4 py-2 bg-gray-200 rounded-md">
              {result}
            </li>
          ))}
        </ul>
      )}
    </div>
    </Layout>
  );
};

export default withAuth(Dashboard);
