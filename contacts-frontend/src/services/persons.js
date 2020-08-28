import axios from 'axios';

// URL of server -- needs to be set-up in advance
// const baseUrl = 'http://localhost:3001/persons'; // Original development
// const baseUrl = 'http://localhost:3001/api/persons'; // Moved to backend
// const baseUrl = 'https://guarded-woodland-94743.herokuapp.com/api/persons'; // Moved to Heroku server
const baseUrl = '/api/persons'; // Using build --same address

// CREATE
const create = (newObj) => axios.post(baseUrl, newObj).then((res) => res.data);

// RETRIEVE
const getAll = () => axios.get(baseUrl).then((res) => res.data);

// UPDATE
const update = (id, newObj) =>
  axios.put(`${baseUrl}/${id}`, newObj).then((res) => res.data);

// DELETE
const deleteReq = (id) => axios.delete(`${baseUrl}/${id}`).then((res) => res.data);

// Export default an object with all 4 CRUD methods
export default { create, getAll, update, deleteReq };
