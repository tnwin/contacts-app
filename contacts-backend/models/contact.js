const mongoose = require('mongoose'); // Making our lives easier w/ Mongoose

// For unique validation in schema
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false); // Addressing deprecation of findONeAndUpdate()
mongoose.set('useCreateIndex', true); // Addressing deprecation of collection.ensureIndex

// URI
// eslint-disable-next-line no-undef -- for process.*
const uri = process.env.MONGODB_URI;

// C-Log connecting URI
console.log('****Connecting to...', uri);

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => {
    console.log('==================------Failed to connect!------==================');
    console.log('Error:', err.message);
  });

// Schema definition for a contact/person
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  number: {
    type: String,
    validate: {
      // See Mongoose Custom Validators docs
      validator: (v) => /(.*[0-9]){8}/.test(v),
      message: (props) => `${props.value} does not contain at least 8 digits!`,
    },
    required: true, // Added b/c it can't be blanked anyways
  },
});

// Stringify _id to id
// Remove _id and __v from public view
contactSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

contactSchema.plugin(uniqueValidator); // For unique validation in schema

// CommonJS exporting this file as 'Contact'
module.exports = mongoose.model('Contact', contactSchema);
