logInSession = (s, n, r, a) => {

  if (!checkSession(s)) {
    s.logged = n
    
    s.remmember = r == true
    s.admin = a == true
  } else
    s.touch()

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
  return (s != undefined && s.remmember )
}

checkSession = (s) => {
  return (!s.logged || s.cookie._expires < new Date()) ? false : true
}

module.exports = { logInSession, logOutSession, setToken, checkToken, checkSession }