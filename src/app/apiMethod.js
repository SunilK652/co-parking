import axios from 'axios';

export const registerUser = async (name, email, mobile, password, confirmpassword) => {
    try {
      const response = await axios.post('http://localhost:3333/api/user/signup', {
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
    const response = await axios.post('http://localhost:3333/api/user/login', {
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
    const response = await axios.post('http://localhost:3333/api/owner/addOwner', {
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
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred. Please try again.');
  }
};

export const getOwners = async () => {
  try {
    const response = await axios.get('http://localhost:3333/api/owner/getParking');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An error occurred. Please try again.');
  }
};

export const getQRCode = async () => {
  try {
    const response = await axios.get('http://localhost:3333/api/payment/qr-code');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate QR code');
  }
};

export const checkout = async(token) => {
  try {
    const response = await axios.post('http://localhost:3333/api/payment/check-out',{
      token,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate Token')
  }
}
