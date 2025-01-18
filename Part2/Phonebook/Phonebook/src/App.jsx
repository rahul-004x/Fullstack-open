import { useState, useEffect } from 'react';
import personsService from './services/persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ message: null, type: '' });

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  // Function to handle changes in the name input field
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  // Function to handle changes in the number input field
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  // Function to handle changes in the search input field
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle form submission
  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personsService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNotification({ message: `Updated ${newName}'s number`, type: 'success' });
            setTimeout(() => {
              setNotification({ message: null, type: '' });
            }, 5000);
            // Clear the input fields
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setNotification({ message: `Information of ${newName} has already been removed from server`, type: 'error' });
            setTimeout(() => {
              setNotification({ message: null, type: '' });
            }, 5000);
            setPersons(persons.filter(person => person.id !== existingPerson.id));
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    personsService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNotification({ message: `Added ${newName}`, type: 'success' });
        setTimeout(() => {
          setNotification({ message: null, type: '' });
        }, 5000);
        // Clear the input fields
        setNewName('');
        setNewNumber('');
      });
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotification({ message: `Deleted ${name}`, type: 'error' });
          setTimeout(() => {
            setNotification({ message: null, type: '' });
          }, 5000);
        })
        .catch(error => {
          setNotification({ message: `Information of ${name} has already been removed from server`, type: 'error' });
          setTimeout(() => {
            setNotification({ message: null, type: '' });
          }, 5000);
          setPersons(persons.filter(person => person.id !== id));
        });
    }
  };

  // Filter persons based on the search term
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <div>
        filter shown with <input value={searchTerm} onChange={handleSearchChange} />
      </div>

      <form onSubmit={addPerson}>
        <div>
          <h1>add a new</h1>
          name: <input value={newName} onChange={handleNameChange} required/><br/>
          number: <input value={newNumber} onChange={handleNumberChange} type='texy' required/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => 
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default App;