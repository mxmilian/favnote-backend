const Notes = require('../models/notesModel');
const { createOne } = require('../factory/crudFactory');


const createNote = createOne(Notes)

module.exports = {
  createNote
};