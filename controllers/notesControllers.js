
const readAllNotes = (req, res) => res.status(200).json({
  status: 'success',
  data: 'notes'
})

module.exports = {
  readAllNotes
};