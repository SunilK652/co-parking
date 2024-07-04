'use client';
import { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import "react-datetime/css/react-datetime.css";
import '../globals.css';
import Layout from '../components/layout/page';
import withAuth from '../withAuth/withAuth';
import { addOwner, getOwners } from '../apiMethod';

const ParkingOwnerDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    spotName: '',
    pinCode: '',
    landMark: '',
    segment: '',
    city: '',
    state: '',
    price: '',
    fromDate: '',
    toDate: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewParkingForm, setShowNewParkingForm] = useState(false);
  const [owners, setOwners] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.spotName) newErrors.spotName = 'Parking space name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.pinCode) newErrors.pinCode = 'PinCode is required';
    if (!formData.segment) newErrors.segment = 'Segment is required';
    if (!formData.fromDate) newErrors.fromDate = 'From date is required';
    if (!formData.toDate) newErrors.toDate = 'To date is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      let fromDate = moment(formData.fromDate).format('YYYY-MM-DDTHH:mm:ss');
      let toDate = moment(formData.toDate).format('YYYY-MM-DDTHH:mm:ss');
      const response = await addOwner(formData.name, formData.address, formData.phone,
        formData.spotName, formData.pinCode, formData.landMark, formData.segment, formData.city, formData.state, formData.price, fromDate, toDate);
      setLoading(false);
      setSuccessMessage(response.message);
      setFormData({
        name: '',
        address: '',
        phone: '',
        spotName: '',
        pinCode: '',
        landMark: '',
        segment: '',
        city: '',
        state: '',
        price: '',
        fromDate: '',
        toDate: '',
      });
      fetchOwners();
    } catch (error) {
      setLoading(false);
      setErrors({ api: 'Failed to submit parking information' });
    }
  };

  const fetchOwners = async () => {
    try {
      const ownersData = await getOwners();
      setOwners(ownersData);
    } catch (error) {
      setErrors({ api: 'Failed to fetch owners' });
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleFromDateChange = (fromDate) => {
    setFormData({
      ...formData,
      fromDate: fromDate,
    });
  };

  const handleToDateChange = (toDate) => {
    setFormData({
      ...formData,
      toDate: toDate,
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Parking Owner Dashboard</h1>
        <hr className="border-gray-300 mb-6" />
        <div className="mb-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Add New Parking</h2>
            <button
              onClick={() => setShowNewParkingForm(!showNewParkingForm)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showNewParkingForm ? '-' : '+'}
            </button>
          </div>
          <hr className="border-gray-300 mb-6" />
          {showNewParkingForm && (
            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Parking Owner Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="spotName" className="block text-sm font-medium text-gray-700">Parking Spot Name</label>
                <input
                  id="spotName"
                  name="spotName"
                  type="text"
                  required
                  value={formData.spotName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.spotName && <p className="text-red-500 text-sm mt-1">{errors.spotName}</p>}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              <div>
                <label htmlFor="landMark" className="block text-sm font-medium text-gray-700">Nearest LandMark</label>
                <input
                  id="landMark"
                  name="landMark"
                  type="text"
                  required
                  value={formData.landMark}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.landMark && <p className="text-red-500 text-sm mt-1">{errors.landMark}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="segment" className="block text-sm font-medium text-gray-700">Segment</label>
                <select
                  id="segment"
                  name="segment"
                  required
                  value={formData.segment}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="" disabled>Select segment</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                </select>
                {errors.segment && <p className="text-red-500 text-sm mt-1">{errors.segment}</p>}
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Declare Your Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <span className="text-gray-500 text-sm">Price for one hour</span>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">Select Available From Date and Time</label>
                <div className="mt-1">
                  <Datetime
                    value={formData.fromDate}
                    onChange={handleFromDateChange}
                    timeFormat={true}
                    inputProps={{ className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' }}
                  />
                </div>
                {errors.fromDate && <p className="text-red-500 text-sm mt-1">{errors.fromDate}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">Select Available To Date and Time</label>
                <div className="mt-1">
                  <Datetime
                    value={formData.toDate}
                    onChange={handleToDateChange}
                    timeFormat={true}
                    inputProps={{ className: 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' }}
                  />
                </div>
                {errors.toDate && <p className="text-red-500 text-sm mt-1">{errors.toDate}</p>}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
              <div>
                <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">Pin Code</label>
                <input
                  id="pinCode"
                  name="pinCode"
                  type="number"
                  required
                  value={formData.pinCode}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Add Parking'}
                </button>
              </div>
            </form>
          )}
        </div>
        {successMessage && (
          <div className="mt-4 text-green-600">
            {successMessage}
          </div>
        )}
        {errors.api && (
          <div className="mt-4 text-red-600">
            {errors.api}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default withAuth(ParkingOwnerDashboard);
