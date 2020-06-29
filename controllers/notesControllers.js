const Notes = require('../models/notesModels');
const { createOne } = require('./crudFactory');


const createNote = createOne(Notes)

module.exports = {
  createNote
};