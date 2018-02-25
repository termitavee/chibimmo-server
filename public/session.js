logInSession = (s, n, r) => {

  if (!checkSession(s)) {
    s.logged = n
    //remember just the sesion or for 7 days
    r ? s.cookie.maxAge = 604800000 : s.cookie.expires = false

  } else
    s.touch()
  s.admin = true

}

logOutSession = (s) => {
  if (checkSession(s)) {
    s.logged = false
  } else {
    //not logged
  }
}

setToken = (s, n) => {
  return s.logged ? n : false
}

checkToken = (s) => {
  console.log(s)
  return s == undefined ? false : s.logged != false
}

checkSession = (s) => {
  return (!s.logged || s.cookie._expires < new Date()) ? false : true
}

module.exports = { logInSession, logOutSession, setToken, checkToken, checkSession }