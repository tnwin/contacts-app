import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Display from './components/Display';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';

// import axios from 'axios'; // Moved to ./services/personService.js
import personService from './services/persons';
import Footer from './components/Footer';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  // const [errorMsg, setErrorMsg] = useState(null);
  // const [successMsg, setSuccessMsg] = useState(null);
  const [notification, setNotification] = useState(null);

  // RETRIEVE from server all persons at initial render
  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  /**
   * Save person by creating a person object with appropriate props
   * Also check for duplication and whether an update is needed
   * [CREATE] & [UPDATE]
   */
  const addPerson = (e) => {
    e.preventDefault(); // Prevent page refresh

    const inputPersonObj = {
      name: newName.trim(),
      number: newNumber.trim(),
      // ID handled on server side
    };

    // See if person exists
    const toUpdatePerson = persons.find((p) => cleanStr(p.name) === cleanStr(newName));
    // If they exist
    if (typeof toUpdatePerson !== `undefined`)
      // Ask to [UPDATE] the existing person
      return updatePersonNumber(toUpdatePerson.id, inputPersonObj.number);

    // POST to server and add the response (should be the same item)
    // [CREATE]
    personService
      .create(inputPersonObj)

      // Set state by adding resNewPerson/inputPersonObj to current persons IFF name doesn't exist
      .then((resNewPerson) => {
        setPersons(persons.concat(resNewPerson));
        // console.log('response data', responsePerson); // C.LOG RESPONSE

        // Clear the input fields
        setNewName('');
        setNewNumber('');

        // Notify person of successful addition
        notifyUser(`Added ${inputPersonObj.name}`);
      })

      .catch((err) => {
        console.log(`Error adding person`, err.response.data);
        notifyUser(`${err.response.data.error}`, `error`);
      });
  };

  /**
   * [UPDATE] the person with ID id with new number newNumber
   * @param {number} id - Person ID of person being updated
   * @param {number} updatedNumber - New phone # to be updated with
   */
  const updatePersonNumber = (id, updatedNumber) => {
    // Ask to update the existing person
    const updateConfirm = window.confirm(
      `${newName.trim()} is already added to your contact; replace old number with a new one?`
    );

    // If user confirms
    if (updateConfirm) {
      // Find the person that match id of interest (param)
      const toUpdatePerson = persons.find((p) => p.id === id);

      // Make a copy of OG person, but update their phone #
      const updatedPersonObj = {
        ...toUpdatePerson,
        number: updatedNumber,
      };

      // PUT request to update
      personService
        .update(toUpdatePerson.id, updatedPersonObj)

        // Iterate persons and set person of interest to be the responseUpdatedPerson
        .then((resUpdatedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== toUpdatePerson.id ? p : resUpdatedPerson))
          );
          // Clear input fields
          setNewName('');
          setNewNumber('');

          // Notify successful update
          setNotification(`Updated ${updatedPersonObj.name}`);
        })

        // Updating a person who was already deleted...
        .catch((error) => {
          console.log(`Error while updating:`, error); // C.LOG ERROR
          setPersons(persons.filter((p) => p.id !== id));
          notifyUser(
            `Information of ${updatedPersonObj.name} has already been removed from server`,
            `error`
          );
        });
    }
  };

  /**
   * [DELETE] person of ID id
   * Display name in alert to ask for confirmation before removal
   * @param {number} id - ID of person being removed
   * @param {string} name - Name of person being removed
   */
  const deletePerson = (id, name) => {
    const deleteConfirm = window.confirm(`Delete ${name}?`);

    // If user confirms to delete...
    if (deleteConfirm) {
      personService
        .deleteReq(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          // Notify successful deletion
          notifyUser(`Deleted ${name}`);
        })

        // Deleting already removed person
        .catch((error) => {
          console.log(`Error while deleting:`, error); // C.LOG ERROR
          setPersons(persons.filter((p) => p.id !== id));
          notifyUser(`${name} was already removed from server`, `error`);
        });
    }
  };

  //** */ Handlers /* **//

  // Set newName with value from the input
  const handleNameInput = (e) => setNewName(e.target.value);

  // Set newNumber with value from the input
  const handleNumberInput = (e) => setNewNumber(e.target.value);

  // Set filterWith with value from the input
  const handleFilter = (e) => setFilter(e.target.value);

  //** */ Additional helper functions /* **//

  // Clean up the strings for search, find, and add purposes
  const cleanStr = (s) => s.toLowerCase().trim();

  // Array of persons to be actually used to display (toDisplay)
  // Display all or the filtered persons accordingly
  const filteredPersons = persons.filter((person) =>
    cleanStr(person.name).includes(cleanStr(filter))
  );

  // Set notification message and type to display
  const notifyUser = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className="App">
      <Header text="Phonebook" className={'h1'} />
      {/* <Notification msg={successMsg} type={`success`} /> */}
      {/* <Notification msg={errorMsg} type={`error`} /> */}
      <Notification notification={notification} />

      <Filter filter={filter} handleFilter={handleFilter} />

      <Header text="New Contact" />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleName={handleNameInput}
        handleNumber={handleNumberInput}
      />

      <Header text="Numbers" />
      <ul>
        <Display persons={filteredPersons} handleDelete={deletePerson} />
      </ul>

      {/* Test Footer */}
      <Footer text={`Test Footer: Phonebook contact app`} />
    </div>
  );
};

export default App;
