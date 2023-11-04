import React from 'react';

const FilterContext = React.createContext();

export const FilterProvider = FilterContext.Provider;
export const FilterConsumer = FilterContext.Consumer;
export default FilterContext;
