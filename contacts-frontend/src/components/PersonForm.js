import React from 'react';
import Button from './Button';

// Form structure
const PersonForm = ({ newName, newNumber, addPerson, handleName, handleNumber }) => (
  <form onSubmit={addPerson}>
    <div>
      name:{' '}
      <input
        value={newName}
        onChange={handleName}
        placeholder="Input unique name"
        required
      />
    </div>

    {/* Number input with regex pattern preventing characters */}
    <div>
      number:{' '}
      <input
        value={newNumber}
        onChange={handleNumber}
        placeholder="Use phone# format"
        pattern="^[+]{0,1}[(\)\-\s\./0-9]*$"
      />
    </div>

    <div>
      <Button type="submit" text="add" />
    </div>
  </form>
);
export default PersonForm;
