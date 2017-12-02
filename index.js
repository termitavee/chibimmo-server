const socketio = require('socket.io')
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser');
const crypto = require("crypto");
//const https = require('https')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/chibimmo';

const { fileLog, parseBody } = require('./public/utils');
const { } = require('./public/db/db')
const classStats = require('./public/db/characterStats')

const PORT = 3000
const app = express()
const server = http.Server(app)

const io = socketio(server);
const ioChat = io.of('/chat');
const ioGame = io.of('/game');
var chatList = []
var gameList = []
//TODO implement namespaces for private chat
//TODO porbar sockets con -i max

//TODO usar raiz y otras rutas para login y otras funciones en app

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.get('/', function (req, res) {

	//res.send("hey")
	res.redirect('https://chibimmo.tumblr.com/');

});

app.post('/login', function (req, res) {


	const { user, pass, token = null, remember = false, device = null } = parseBody(req.body)
	console.log('user')
	console.log(user)
	console.log('pass')
	console.log(pass)
	console.log('token')
	console.log(token)
	console.log('remember')
	console.log(remember)
	console.log('device')
	console.log(device)
	/*
	if(token!=null && checkToken(user, device, token)){		
		
		const token = crypto.randomBytes(10).toString('hex');
		console.log("token="+token)
		updateToken(user,device, token)
		res.send({status: "success", user: getFullUser(user)})
		
	}
	*/
	try {

		MongoClient.connect(url, function (err, db) {

			db.collection('User').findOne({ "_id": user }).then((found) => {
				console.log('found')
				console.log(found)
				//TODO check token 

				if (found !== null) {
					if (found.pass == pass) {
						//TODO update user last login
						db.collection('Character').find({ "userID": user }, (err, characters) => {

							characters.toArray().then((characters) => {
								console.log('characters')
								console.log(characters)
								found.characters = characters
								console.log('found')
								console.log(found)
								res.send({ action: "login", status: "202", user: found })
							})

						})
					} else {
						res.send({ action: "login", status: "401", error: "password" })
					}
				} else {
					res.send({ action: "login", status: "401", error: "user" })
				}

			})

		});
	} catch (ex) {
		res.send({ action: "login", status: "500", error: "db" })
	}

})

app.post('/signup', function (req, res) {
	//crear usuario
	try {
		const { user, pass, email } = parseBody(req.body)
		console.log("user " + user + " pass " + pass + " email " + email)
		//TODO modificar como en login
		//comprobar si existe usuario

		//comprobar si el email es válido
		console.log('check mail')
		const emailPatt = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/i;
		if (!emailPatt.test(email)) {
			console.log('email not valid')
			res.send({ action: "signup", status: "401", error: "email" })
		}

		console.log('check user')

		MongoClient.connect(url, function (err, db) {
			console.log('err')
			console.log(err)


			let users = db.collection('User').insert({
				"_id": user,
				"pass": pass,
				"token": {},
				"email": email,
				"started": new Date(),
				"login": 0,
				"friendList": []
			}, (err, result) => {
				console.log('finished')
				console.log('err')
				console.log(err)
				if (err == null) {
					res.send({ action: "signup", status: "202" })
				} else {
					if (err.message.includes("E11000"))
						res.send({ action: "signup", status: "401", error: 'User exist' })
					else
						res.send({ action: "signup", status: "500", error: 'internal error' })
				}

			})
		})

		//TODO enviar verificación por email
	} catch (e) {
		console.log("Error: " + e.message)
		res.send({ action: "signup", status: "401", error: "bad header" })
	}

})

app.get('/user/:name', function (req, res) {
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

})

//TODO new pet and update inventory
// db.collection('Pet').insert({})
// db.collection('Inventory').insert({})

app.get('/pets/:name', function (req, res) { })

app.get('/inventory/:name', function (req, res) { })

app.post('/create', function (req, res) {
	//crear personaje
	console.log('create character')
	const { user, name, className = null, orientation = false, hair = null, hairColor, bodyColor } = parseBody(req.body)
	console.log(user)
	console.log(name)
	console.log(className)// [soldier, mage, rogue]
	console.log(orientation)//[ofensive, defensive, neutral]
	console.log(hair)
	console.log(hairColor)
	console.log(bodyColor)
	let userID = 0

	if (name.length < 4) {
		//TODO error too short
		console.log('name short')
		res.send({ action: "create", status: "401", error: "name" })
	}

	MongoClient.connect(url, function (err, db) {
		db.collection('Character').findOne({ "_id": name }).then((found) => {

			if (found !== null)
				res.send({ action: "create", status: "401", error: 'exist' })
			console.log('is null')

			db.collection('User').findOne({ "_id": user })
				.then((userFound) => {

					if (userFound !== null) {
						//Ceate default stats depending of the class and orientation
						//see './public/db/characterStats'
						const stadistics = (classStats[className])[orientation]

						//pets and inventory is referenced from themselves because of the variable size
						db.collection('Character').insert({ "userID": user, "_id": name, "type": className, 'orientation': orientation, "stadistics": stadistics, map: 1, position: { x: 100, y: 100 }, "started": new Date(), "equipment": '', achievements: [] })
						db.collection('inventory').insert({ "_ID": name, items: [] })
						res.send({ action: "create", status: "202", error: '' })

					} else {
						console.log('user is null')
						res.send({ action: "create", status: "401", error: 'unknow user' })
					}

				})
				.catch((error) => {
					console.log(err)
					res.send({ action: "create", status: "500", error })
				})
		})


	})

})
//TODO add/remove item in invenstory - get array, check item, add/update or remove
app.post('/deletecharacter', function (req, res) {
	//borrar personaje
	console.log('delete user')
	const { user, name } = parseBody(req.body)
	console.log(user)
	console.log(name)
	if(name)
	MongoClient.connect(url, function (err, db) {
		db.collection('Character').remove({ "userID": user, "_id": name }).then((err, found) => {
			console.log('err')
			console.log(err)
			console.log('found')
			console.log(found)
			res.send({ action: "delete", status: "202", character: name })

		})
		})	
	else
		res.send('http://127.0.0.1:3000/remove')	
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

//io.on('connection', function (socket) {console.log("default connection")})
//TODO toda la mecanica de cominicación del juego

ioGame.on('connection', function (socket) {

	console.log("ioGame connection")
	//TODO create new pet and update inventory here
	socket.on('message', function (message) {
		console.log('nuevo mensaje de "' + socket.username + '": "' + message.content + '"');
		//io.emit('chat', mensaje);
		socket.broadcast.emit('message', { "mensaje": socket.username + " ha dicho: " + message });
	});

	//TODO toda la mecanica de comunicación del chat

})

ioChat.on('connection', function (socket) {
	console.log("iochat connection")
	console.log(socket)
	chatList.push(socket)
	console.log(chatList)

	socket.on('setUser', function (userName) {
		console.log(userName)
		socket.userName = userName
		socket.broadcast.emit('mensaje', userName + " joined.");
	})

	socket.on('message', function (message) {
		console.log('nuevo mensaje de "' + socket.userName + '": "' + message + '"');
		//io.emit('chat', mensaje);
		if (socket.userName != null)
			socket.broadcast.emit('mensaje', socket.userName + ": " + message);
	});

})

server.listen(PORT);
console.log('Server suposely running on port ' + PORT)