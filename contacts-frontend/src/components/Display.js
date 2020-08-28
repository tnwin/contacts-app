import React from 'react';
import Person from './Person';
import Button from './Button';

// Display each Person from persons
const Display = ({ persons, handleDelete }) =>
  persons.map((person) => (
    <li key={person.id}>
      <Person person={person} />
      <Button onClick={() => handleDelete(person.id, person.name)} text="delete" />
    </li>
  ));

export default Display;
