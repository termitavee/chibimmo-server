//library imports
const socketio = require('socket.io')
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser');
const crypto = require("crypto");
const fs = require('fs');
//const https = require('https')
const session = require('express-session')
const MongoClient = require('mongodb').MongoClient
const MongoStore = require('connect-mongo')(session);

//external functions
const { fileLog, parseBody, printIP, checkDB, mailContentID, doHash, generateID } = require('./public/utils');
const { updateLoginDate, storeSignUpToken } = require('./public/db/db')
const classStats = require('./public/db/characterStats')
const { logInSession, logOutSession, checkToken, checkSession } = require('./public/session')
const { START, SIGNUP, SIGNIN, REMEMBER } = mailContentID

//server data
const MongoUrl = 'mongodb://localhost:27017/chibimmo';
const PORT = 3000
const app = express()
const server = http.Server(app)
let db;
const io = socketio(server);
//const io = socketio(server, { transports: ['websocket'] });
const ioChat = io.of('/chat');
const ioGame = io.of('/game');
var chatConn = {}
var gameConn = {}
//TODO implement namespaces for private chat
//TODO move all connection to new file

//io.on('connection', function (socket) {console.log("default connection")})
//TODO toda la mecanica de cominicación del juego

ioGame.on('connection', function (socket) {
	//.of('myNamespace').
	//socket.to(<socketid>).emit('hey', 'I just met you');
	chatConn
	console.log("ioGame connection")
	//TODO create new pet and update inventory here
	socket.on('message', function (message) {
		console.log('nuevo mensaje de "' + message.username + '": "' + message.content + '"');
		//io.emit('chat', mensaje);
		socket.broadcast.emit('message', { "mensaje": socket.username + " ha dicho: " + message });
	});
	socket.on('echo', function () {
		socket.emit('echo')
	})
	//TODO toda la mecanica de comunicación del chat

})

ioChat.on('connection', function (socket) {

	console.log("iochat connection")
	console.log(chatConn)
	chatConn[socket.id] = socket

	socket.on('setUser', function (userName, isPhone, nick) {
		console.log(userName)

		console.log(chatConn)
		console.log(socket)
		const user = `${isPhone ? "${userName}" : "${nick}(${userName})"}`
		const message = `joined`

		socket.userName = userName
		socket.broadcast.emit('newMessage', { user, message });
	})

	socket.on('message', function (dispatch) {
		console.log('nuevo mensaje de "' + dispatch.user + '": "' + dispatch.content + '"');
		const user = dispatch.user
		const message = dispatch.content

		socket.broadcast.emit('newMessage', { user, message });
	});

	client.on('disconnect', function () {
		delete chatConn[client.id];
	});

})

MongoClient.connect(MongoUrl, function (err, database) {
	if (err) {
		console.error("Database not Running")
		throw err;
	}

	db = database

	app.use(express.static("public"));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(bodyParser.text());

	app.use(session({
		secret: "sesionID",
		store: new MongoStore({ db }),
		resave: true,
		saveUninitialized: false,
		maxAge: 604800000
	}))

	app.get('/', function (req, res) {

		res.redirect('https://chibimmo.tumblr.com/');

	});

	app.post('/login', function (req, res) {
		const { user, pass, remember, adminApp } = parseBody(req.body)
		console.log('login')
		console.log(req.session)

		//console.log(parseBody(req.body))
		const hasToken = checkToken(req.session)
		if (user && (pass || hasToken)) {

			try {

				db.collection('User').findOne({ "_id": user }).then((found) => {
					console.log('found')
					console.log(found)
					if (found.admin || !adminApp) {
						if (hasToken || found.pass === pass) {
							logInSession(req.session, user, remember, found.admin)

							db.collection('Character').find({ "userID": user }, (err, foundCharacters) => {
								foundCharacters.toArray().then((characters) => {
									res.send({ action: "login", status: "202", user: { ...found, characters } })
								})
							})
						} else
							res.send({ action: "login", status: "401", error: "password" })
					} else
						res.send({ action: "login", status: "403", error: "Forbidden" })

				})

			} catch (ex) {
				res.send({ action: "login", status: "500", error: "db" })
			}

		} else {
			user ?
				res.send({ action: "login", status: "401", error: "user" })
				:
				res.send({ action: "login", status: "401", error: "token" })
		}
	})

	app.post('/signup', function (req, res) {
		//crear usuario
		try {
			const { user, pass, email, adminApp } = parseBody(req.body)

			//comprobar si el email es válido
			console.log('check mail')
			const emailPatt = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/i;

			if (!emailPatt.test(email)) {
				console.log('email not valid')
				res.send({ action: "signup", status: "401", error: "email" })
			}

			db.collection('User').insert({
				"_id": user,
				"pass": pass,
				"token": {},
				"email": email,
				"started": new Date(),
				"login": 0,
				"friendList": [],
				"achievements": [false, false, false, false, false, false, false, false, false],
				"admin": adminApp || false,
				"verified": false,
			}, (err, result) => {
				console.log('finished')

				if (err == null) {

					const mailData = doHash(email)
					sendEmail(email, SIGNUP, { url: mailData })
					storeSignUpToken(db, user, mailData)

					res.send({ action: "signup", status: "202" })
				} else {
					if (err.message.includes("E11000"))
						res.send({ action: "signup", status: "401", error: 'User exist' })
					else
						res.send({ action: "signup", status: "500", error: 'internal error' })
				}

			})

		} catch (e) {
			console.log("Error: " + e.message)
			res.send({ action: "signup", status: "401", error: "bad header" })
		}

	})
	app.get('activate/:id', (req, res) => {
		const { id } = req.query
		db.collection('Token').find({_id: id}).then((found) => {
			console.log('users')
			console.log(users)

			res.send({ action: "user", status: "202", found: users })

		})
	})
	app.get('/users/', function (req, res) {
		if (res.session.logged) {
			const { name } = req.query
			let founded

			db.collection('User').find({}).then((users) => {
				console.log('users')
				console.log(users)

				res.send({ action: "user", status: "202", found: users })

			})

		} else {
			res.send({ action: "user", status: "401", error: 'not logged' })
		}

	})

	app.post('/users/admin', function (req, res) {
		if (res.session.logged && res.session.admin) {
			const { user, admin } = parseBody(req.body)

			db.collection('User').update({_id: user}, {admin}).then((user) => {
				console.log('user')
				console.log(user)

				res.send({ action: "admin", status: "202", found: user })

			})

		} else {
			res.send({ action: "admin", status: "401", error: 'not logged' })
		}

	})

	app.get('/users/:name', function (req, res) {
		if (res.session.logged) {
			const { name } = req.query
			let founded

			db.collection('User').findOne({ "_id": name }).then((user) => {
				console.log('user')
				console.log(user)
				if (user !== null) {
					founded = user
					db.collection('Character').find({ "userID": name }).then((characterList) => {
						console.log('characterList')
						console.log(characterList)
						founded.characters = characterList
						res.send({ action: "user", status: "202", found: founded })
					})
				}
				else
					res.send({ action: "user", status: "401", error: "User not found" })
			})

		} else {
			res.send({ action: "signup", status: "401", error: 'not logged' })
		}

	})

	app.get('/pets/:name', function (req, res) {
		if (res.session.logged) {

			//TODO update 

		} else {
			res.send({ action: "signup", status: "401", error: 'not logged' })
		}
	})

	app.post('/pets/:name', function (req, res) {
		const { updateItems } = parseBody(req.body)
		const name = req.params.name
		if (res.session.logged) {


			//TODO update or create
			/* db.collection('Pet').insert({
	"_id": (auto, no insert)
	"name": nombre,
	"user": usuario,
	"activity": undefined, // if no date, is free, if date is working
	"date": nombre,
	}) 
	db.collection.findAndModify
	*/

		} else {
			res.send({ action: "inventory", status: "401", inventory: "not logged" })
		}


	})

	app.get('/inventory/:name', function (req, res) {

		const name = req.params.name
		if (res.session.logged) {


			db.collection('Inventory').findOne({ "_id": name }).then((found) => {
				if (found)
					res.send({ action: "inventory", status: "202", inventory: found })
				else
					res.send({ action: "inventory", status: "404", inventory: "not found" })
			})

		} else {
			res.send({ action: "inventory", status: "401", inventory: "not logged" })
		}

	})

	app.post('/inventory/:name', function (req, res) {
		const { updateItems } = parseBody(req.body)
		const name = req.params.name
		if (res.session.logged) {

			//TODO update 
			/* 
	
	db.collection('Inventory').insert({
	"_id": item,
	"quantity": param, 
	
	})
	
	db.collection.findAndModify
	*/

		} else {
			res.send({ action: "inventory", status: "401", inventory: "not logged" })
		}


	})

	app.post('/create', function (req, res) {
		//crear personaje
		console.log('create character')

		const { user, name, className, orientation, hair, hairColor, bodyColor } = parseBody(req.body)
		console.log(user._id)//root
		console.log(name)//reddo
		console.log(className)// [soldier, mage, rogue]
		console.log(orientation)//[ofensive, defensive, neutral]
		console.log(hair)
		console.log(hairColor)
		console.log(bodyColor)

		/*if (name.length < 4) {
			// error too short
			console.log('name short')
			res.send({ action: "create", status: "401", error: "name" })
		}*/
		//TIDI cambiar, al ser id único 

		db.collection('Character').findOne({ "_id": name }).then((found) => {

			if (found !== null)
				res.send({ action: "create", status: "400", error: 'exist' })


			db.collection('User').findOne({ "_id": user._id }).then((userFound) => {
				console.log('userFound')
				console.log(userFound)

				if (userFound !== null) {
					//Ceate default stats depending of the class and orientation
					//see './public/db/characterStats'
					const stadistics = (classStats[className])[orientation]
					console.log(stadistics)

					//pets and inventory is referenced from themselves because of the variable size

					const char = { "userID": user._id, "_id": name, "type": className, 'orientation': orientation, "stadistics": stadistics, map: 0, position: { x: 100, y: 100 }, "direction": 0, "started": new Date(), "equipment": { armor: 0, weapon: 0 }, achievements: [], "hair": hair, "hairColor": hairColor, "bodyColor": bodyColor }
					db.collection('Character').insert(char)
					console.log('inserted character ' + name)
					//db.collection('inventory').insert({ "_ID": name, items: [] })
					res.send({ action: "create", status: "202", char })

				} else {
					console.log('user not found')
					res.send({ action: "create", status: "401", error: 'unknow user' })
				}

			})
				.catch((error) => {
					console.log(error)
					res.send({ action: "create", status: "500", error: error })
				})
		})


	})


	//TODO add/remove item in invenstory - get array, check item, add/update or remove
	app.post('/deletecharacter', function (req, res) {
		//borrar personaje
		console.log('delete user')
		const { user, name } = parseBody(req.body)


		db.collection('Character').remove({ "userID": user, "_id": name }).then((err, found) => {

			res.send({ action: "delete", status: "202", character: name })

		})


	})

	app.get('/news', function (req, res) {
		if (res.session.logged) {
			const { name } = req.query
			let founded

			db.collection('news').find({}).then((news) => {
				console.log('news')
				console.log(news)

				res.send({ action: "user", status: "202", found: news })

			})

		} else {
			res.send({ action: "signup", status: "401", error: 'not logged' })
		}

	})

	app.post('/news/new', function (req, res) {
		//crear noticia
		if (res.session.logged) {
			const { user, title, description, image } = parseBody(req.body)
			const url = encodeURIComponent(title) + generateID(4)
			const currentTime = Date()
			//get image
			const origin = req.files.thumbnail.path
			const destination = "/img/news/" + url 
			const insertion = { url, user, title, description, image: destination, created = currentTime, updated: currentTime }

			fs.rename(origin, destination, function (err) {
				if (err) {
					console.error(err)
					//res.send({ action: "delete", status: "500" })

				}
				fs.unlink(origin, function (err) {
					if (err) {
						console.error(err)
						//res.send({ action: "delete", status: "500" })
					}
					else {
						db.collection('News').insert(insertion).then((err, found) => {
							if (!err) {
								//TODOretunr id?
								res.send({ action: "create", status: "202" })
							}
							res.send({ action: "create", status: "500" })

						})
					}
				})
			})

		} else {
			res.send({ action: "create", status: "401", error: 'not logged' })
		}

	})

	app.post('/news/edit', function (req, res) {
		//editar noticia
		if (res.session.logged) {
			const { _id, url, user, title, description, image } = parseBody(req.body)

			//get image
			const origin = req.files.thumbnail.path
			const destination = "/img/news/" + url 
			const insertion = { url, user, title, description, image: destination, updated: Date() }

			fs.rename(origin, destination, function (err) {
				if (err) {
					console.error(err)
					res.send({ action: "edit", status: "500" })

				}
				fs.unlink(origin, function (err) {
					if (err) {
						console.error(err)
						res.send({ action: "edit", status: "500" })
					}
					else {
						db.collection('News').update({_id},insertion).then((err, found) => {
							if (!err) {

								res.send({ action: "edit", status: "202" })
							}
							res.send({ action: "edit", status: "500" })

						})
					}
				})
			})

		} else {
			res.send({ action: "signup", status: "401", error: 'not logged' })
		}
	})

	app.post('/news/delete', function (req, res) {
		//borrar noticia
		if (res.session.logged) {
			const { _id, title } = parseBody(req.body)

			const storedImage = "/img/news/" + url
			
			fs.unlink(storedImage, function (err) {
					if (err) {
						console.error(err)
						res.send({ action: "delete", status: "500" })
					}
					else {
						db.collection('News').deleteOne({_id}).then((err, found) => {
							if (!err) {
								res.send({ action: "delete", status: "202" })
							}
							res.send({ action: "delete", status: "500" })

						})
					}
				
			})

		} else {
			res.send({ action: "signup", status: "401", error: 'not logged' })
		}
	})

	app.get('/enter', function (req, res) {
		//pasa del launcher al juego (redireccionar a /game?) 
		const { user, name } = parseBody(req.body)
		const date = new Date()
		db.collection('Character').findOne({ "userID": user, "_id": name }).then((found) => {
			if (found != null)
				res.send({ action: "enter", status: "202", error: '' })
			else
				res.send({ action: "enter", status: "401", error: 'Not found' })
		})
	})

	// Start the application after and only if the database connection is ready
	server.listen(PORT, () => {
		console.log("Server running on local ips " + printIP() + ' and port ' + PORT)
		//sendEmail('project.chibimmo@gmail.com', START)

	});
});
