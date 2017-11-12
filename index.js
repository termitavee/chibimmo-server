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

const ioGame = socketio(server, {
	path: '/game',
	serveClient: true,
}).listen(server);

//TODO implement namespaces for private chat
const ioChat = socketio(server, {
	path: '/chat',
	serveClient: true,
}).listen(server);

//TODO comprobar extructura en la web de socket.io
//TODO usar raiz y otras rutas para login y otras funciones en app


//io.listen(app.listen(process.env.PORT || 1337));

//TODO definir variables globales necesarias

//res.send({action:"signup",status: "401", data: "bad header"})
//definir ruta por defecto
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

	/*
	if(token!=null && checkToken(user, device, token)){		
		
		const token = crypto.randomBytes(10).toString('hex');
		console.log("token="+token)
		updateToken(user,device, token)
		res.send({status: "success", user: getFullUser(user)})
		
	}
	*/
	MongoClient.connect(url, function (err, db) {
		db.collection('User').findOne({ "_id": user }).then((found) => {
			console.log('found')
			console.log(found)
			//TODO check token 

			if (found !== null) {
				if (found.pass == pass) {
					//TODO update user last login
					res.send({ action: "login", status: "202", user: found })
				} else {
					res.send({ action: "login", status: "401", error: "password" })
				}
			} else {
				res.send({ action: "login", status: "401", error: "user" })
			}

		})

	});

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
			res.send({ action: "login", status: "401", error: "email" })
		}
		console.log('email ok')


		console.log('check user')

		MongoClient.connect(url, function (err, db) {
			let users = db.collection('User').insert({
				"_id": user,
				"pass": pass,
				"token": {},
				"email": email,
				"characters": [],
				"started": new Date(),
				"login": 0,
				"friendList": []
			}, (err, result) => {
				console.log('finished')
				console.log('err')
				console.log(err)
				/*
				name: 'MongoError',
				message: 'E11000 duplicate key error collection: chibimmo.User index: _id_ dup key: { : "root" }',
				driver: true,
				code: 11000,
				index: 0,
				errmsg: 'E11000 duplicate key error collection: chibimmo.User index: _id_ dup key: { : "root" }',
				getOperation: [Function],
				toJSON: [Function],
				toString: [Function] }
				*/
				console.log('result')
				console.log(result)
				const userData = db.collection('User').findOne({ "nick": user })
				console.log(userData)

				res.send({ action: "signup", status: "202", user: userData })
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
				res.send({ action: "user", status: "202", found: founded})
			})
		}
		else
			res.send({ action: "user", status: "401", error: "User not found" })
	})

})

app.post('/create', function (req, res) {
	//crear personaje
	const { user, name, className = null, orientation = false, hair = null, color } = parseBody(req.body)
	console.log(user)
	console.log(name)
	console.log(className)
	console.log(hair)
	console.log(color)
	let userID = 0

	if (name.length < 4) {
		//TODO error too short
		console.log('name short')
		res.send({ action: "create", status: "401", error: "name" })
	}

	MongoClient.connect(url, function (err, db) {
		db.collection('Character').findOne({ "_id": name }).then((found) => {
			console.log('found')
			console.log(found)

			if (found !== null)
				res.send({ action: "create", status: "401", error: 'exist' })

			db.collection('User').findOne({ "nick": user }).then((found) => {

				if (found !== null) {
					//{user, name, className="sol", orientation=n, hair=null, color}
					const stadistics = (classStats[className])[orientation]
					cosnole.log(stadistics)
					db.collection('Character').insert({ "userID": user, "_id": name, "type": className, "stadistics": stadistics, "started": currentDate, "equipment": currentDate, "inventory": [], "pets": [], "login": [] })
					res.send({ action: "create", status: "202", error: '' })

				}

			})

		})
		db.close()

	})

})

app.get('/delete', function (req, res) {
	//borrar personaje
	const { user, name } = parseBody(req.body)
	db.collection('Character').remove({ "userID": user, "_id": name }).then((found) => {
		console.log('found')
		console.log(found)
		res.send({ action: "delete", status: "202", error: '' })

	})
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

ioGame.on('connection', function (cocket) {

	console.log("ioGame connection")

	socket.on('mensaje', function (mensaje) {
		console.log('nuevo mensaje de "' + socket.username + '": "' + mensaje + '"');
		//io.emit('chat', mensaje);
		socket.broadcast.emit('mensaje', { "mensaje": socket.username + " ha dicho: " + mensaje });
	});

	//toda la mecanica de comunicación del juego

})

ioChat.on('connection', function (cocket) {
	console.log("iochat connection")

})

server.listen(PORT);
console.log('Server suposely running on port ' + PORT)