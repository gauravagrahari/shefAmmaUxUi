// HostContext.js
import React from 'react';

const HostContext = React.createContext();

export const HostProvider = HostContext.Provider;
export const HostConsumer = HostContext.Consumer;
export default HostContext;
