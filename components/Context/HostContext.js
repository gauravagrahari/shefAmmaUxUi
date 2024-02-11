import React, { createContext, useContext, useState } from 'react';

// Define the initial state for hosts
const initialHostState = {
  hostList: [],
  hasFetchedHosts: false,
};

const HostContext = createContext({
  ...initialHostState, // Spread the initial state into the default context
  resetHostContext: () => {}, // Provide a no-op function for resetting context
});

export const HostProvider = ({ children }) => {
  const [hostList, setHostList] = useState(initialHostState.hostList);
  const [hasFetchedHosts, setHasFetchedHosts] = useState(initialHostState.hasFetchedHosts);

  const resetHostContext = () => {
    setHostList(initialHostState.hostList);
    setHasFetchedHosts(initialHostState.hasFetchedHosts);
  };

  return (
    <HostContext.Provider value={{ hostList, setHostList, hasFetchedHosts, setHasFetchedHosts, resetHostContext }}>
      {children}
    </HostContext.Provider>
  );
};

// Custom hook for using context
export const useHostContext = () => useContext(HostContext);

export default HostContext;
