import axios from 'axios';

const PROD_BASE_URL = 'https://co-parking-be-6u3k.vercel.app';

export const registerUser = async (name, email, mobile, password, confirmpassword) => {
    try {
      const response = await axios.post(`${PROD_BASE_URL}/api/user/signup`, {
        name,
        email,
        contactnumber: mobile,
        password,
        confirmpassword,
      });
  
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${PROD_BASE_URL}/api/user/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred. Please try again.');
  }
};

export const addOwner = async (name, address, phoneNumber, spotName, pinCode, landMark, segment, city, state, price, fromDate, toDate) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.post(`${PROD_BASE_URL}/api/owner/addOwner`, {
      name,
      address,
      phoneNumber,
      spotName,
      pinCode,
      landMark,
      segment,
      city,
      state,
      price,
      fromDate,
      toDate
    },{
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred. Please try again.');
  }
};

export const getOwners = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.get(`${PROD_BASE_URL}/api/owner/getParking`,{
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred. Please try again.');
  }
};

export const getQRCode = async () => {
  try {
    const response = await axios.get(`${PROD_BASE_URL}/api/payment/qr-code`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate QR code');
  }
};

export const checkout = async(token) => {
  try {
    const response = await axios.post(`${PROD_BASE_URL}/api/payment/check-out`,{
      token,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate Token')
  }
}

export const sendPaymentConfirmationFlag = async (flagData) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.post(`${PROD_BASE_URL}/api/payment/payment-confirmation`, flagData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending payment confirmation flag:', error);
    throw error;
  }
};
