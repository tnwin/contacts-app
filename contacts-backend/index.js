/**
 * !!!!!!!!!!!!!!!! BUGS !!!!!!!!!!!!!!!!
 * --> Frontend notification timer persist even for new notifications--need new timer for each notification
 * --> Can bypass phone `number` 8-digits validation by updating existing contact with invalid number
 */

// Imports via CommonJS
const express = require('express'); // For express
const morgan = require('morgan'); // For logging
const cors = require('cors'); // For cross origin (diff ports/hosts)
require('dotenv').config(); // For .env for ./models/contact (Must be before Contact) -- can be moved to ./models/contact
const Contact = require('./models/contact'); // For MongoDB/Mongoose

const app = express(); // Setting express() to app for ease of use

/**
 * BEFORE ROUTING MIDWARES ***********************************************
 */
app.use(express.json()); // For express json parser (req.body)
app.use(cors()); // For cross origin (diff ports/hosts)
app.use(express.static('build')); // For 'build' folder to work properly

// Logging data to console like this can breach local privacy laws
morgan.token('reqBody', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'));
// ***********************************************************************

// [GET] Retrieve response with info page
app.get('/api/info', (req, res) => {
  // See Stackoverflow
  // .count() is deprecated
  // Count, then do something with it
  Contact.countDocuments({}).then((count) => {
    const currTime = new Date();
    res.end(`<p>Phonebook has info for ${count} people</p>
  <p>${currTime}</p>`);
  });

  // Alternative
  // Contact.find({}).then((contacts) =>
  //   res.end(`Phonebook has info for ${contacts.length} people
  // ${new Date()}`)
  // );
});

// [GET] Retrieve response with all contacts/persons
app.get('/api/persons', (req, res) => {
  // Don't need this b/c express internally calls toJSON
  // Contact.find({}).then((resPersons) => res.json(resPersons.map((p) => p.toJSON())));
  Contact.find({}).then((resPersons) => res.json(resPersons));
});

// [GET] Retrieve response with a single contact/person
app.get('/api/persons/:id', (req, res, next) => {
  // Send Status 404 if trying to reach a non-existing ID **
  Contact.findById(req.params.id)
    // Again -- don't need res.json(resPerson.toJSON())
    .then((resPerson) => (resPerson ? res.json(resPerson) : res.status(404).end()))
    .catch((err) => next(err)); // Was missing next & error catch
});

// [POST] Create new contact/person and respond
app.post('/api/persons', (req, res, next) => {
  const body = req.body; // const for convenience

  // When creating a contact w/o name and/or number
  if (!body.name || !body.number)
    return res.status(400).json({
      error: 'Name or number is missing!',
    });

  // Set new person object for new contact
  const newPersonObj = new Contact({
    name: body.name,
    number: body.number,
  });

  // Save the new person obj to database
  // Only send response if added successfully
  newPersonObj
    .save()
    .then((savedContact) => res.json(savedContact))
    .catch((err) => next(err));
});

// [PUT] Update a single contact/person (with new number) and respond
app.put('/api/persons/:id', (req, res, next) => {
  // const body = req.body; // convenience
  const { name, number } = req.body; // can be destructured

  // Set currPersonObj with old/updated info
  // Don't need redundant { name: name, number: number }
  const currPersonObj = { name, number };

  // Find ID and update with currPersonObj
  // Using {new:true} to ensure currPersonObj is the NEW updated info
  // Contact.findByIdAndUpdate(req.params.id, { name, number }, { new: true }); // This works but it's hard to read
  Contact.findByIdAndUpdate(req.params.id, currPersonObj, { new: true })
    .then((updatedPerson) => res.json(updatedPerson)) // Don't need updatedPerson.toJSON()
    .catch((err) => next(err));
});

// [DELETE] a single contact/person and respond
app.delete('/api/persons/:id', (req, res, next) => {
  // Find the ID and send 204 response then end response process w/o any data
  // Respond with Status 204 for existing ID deletion and not existing deletions
  Contact.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

/**
 * ERROR HANDLER**********************************************************
 */
const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  // Special case for Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }

  // Special case for casting error (specific to error kind?)
  if (err.name === 'CastError' && err.kind === 'ObjectId')
    return res.status(400).send({ error: 'malformatted id' });

  next(err);
};

app.use(errorHandler);
// ***********************************************************************

// Listening port using .env (to satisfy Heroku) or 3001
// const PORT = process.env.PORT || 3001;
// Don't need PORT 3001 b/c of .env file
// eslint-disable-next-line no-undef -- for process.*
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server starting on port ${PORT}`));
