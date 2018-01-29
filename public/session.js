
logInSession = (s, n,r) => {
  if (!checkSession) {
    s.logged = n
    //TODO remember just the sesion or for 7 days
    r ? req.session.cookie.maxAge = 604800000 : s.cookie.expires = false

  } else {
    s.touch()
  }
}

logOutSession = (s) => {
  if (checkSession) {
    s.logged = false
  } else {
    //not logged
  }
}

setToken = (s,n) => {
  return s.logged ? n : false
}

checkToken = (s) => {
  return s.logged != false
}

checkSession = (s) => {
  return (s.cookie.expires < new Date()) ? false : true
}

module.exports = { logInSession, logOutSession, setToken, checkToken, checkSession }