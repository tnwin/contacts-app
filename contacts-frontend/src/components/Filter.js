import React from 'react';

// Filter input to display only filtering persons
const Filter = ({ filter, handleFilter }) => (
  <div>
    filter shown with:{' '}
    <input value={filter} onChange={handleFilter} placeholder="Search name..." />
  </div>
);

export default Filter;
