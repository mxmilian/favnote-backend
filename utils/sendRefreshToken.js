const sendRefreshToken = (res, token) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh_token"
  })
}

module.exports = {
  sendRefreshToken
}
