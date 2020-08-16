const sendRefreshToken = (res, token) => {
  res.cookie("jid", token, {
    httpOnly: true,
  })
}

module.exports = {
  sendRefreshToken
}