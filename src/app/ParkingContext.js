"use client";
import {createContext, useContext, useState} from 'react';

const ParkingContext = createContext();

export const ParkingProvider = ({ children }) => {
    const [parkingDetails, setParkingDetails] = useState(null);

    return(
        <ParkingContext.Provider value={{parkingDetails, setParkingDetails}}>
                {children}
        </ParkingContext.Provider>
    )
}

export const useParking = () => {
    return useContext(ParkingContext);
  };