import React from 'react';

// Present Person with a name and number
const Person = ({ person }) => (
  <>
    {person.name} {person.number}
  </>
);

export default Person;
