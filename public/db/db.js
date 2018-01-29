//async operation, not return needed

updateLoginDate = (db, user)=> {
    db.collection('Character').update({ "_id": user }, { "login": new Date() })
}

//modelos

module.exports = { updateLoginDate }

class User {
    constructor(nick, pass, deskToken, mobToken, email, characters, started, login, friendList) {
        this.nick = nick;//string
        this.pass = pass;//string
        this.token = token;//{id: token, id:token}
        this.email = email;//string
        this.characters = characters;//array
        this.login = login;//date
        this.friendList = friendList
        this.archivements = archivements//[]
    }

}

class Character {
    constructor(User, name, type, qualities, stadistics, equipment, inventory, pets, login) {
        this.User = User; //string
        this.name = name;//string
        this.type = type;//string soldier/mage/rogue
        this.qualities = qualities;
        /*{
            sprite color
            hair
            hair color
        }*/
        this.stadistics = stadistics;
        /*{
            variable
            life
            magic
            hab
            money
            fixed
            type (off, deff)
            fuerza
            resistencia
            inteligencia
            mente
            destreza
            carisma
        }*/
        this.equipment = equipment;
        /*{
            head:
            body:
            leftArm:
            rightArm:
            leftLeg:
            rightLeg:
        }*/
        this.inventory = inventory;//[]
        this.pets = pets//objet or []
        this.login = login;//date
    }
}

class Monster {
    constructor(level, size) {
        this.level = level;//string
        this.size = size;
    }
}

//borrar, lo almacena el cliente
class NPC {
    constructor(name, type, qualities, statistics, equipment, inventory, pets, login) {
        this._id = _id; //string
        this.name = name;//string
        this.type = type;//string seller/standar/whatever
        this.qualities = qualities;
        /*{
            sprite color
            hair
            hair color
        }*/
        this.equipment = equipment;
        /*{
            head:
            body:
            leftArm:
            rightArm:
            leftLeg:
            rightLeg:
        }*/
        this.inventory = inventory;//[]
    }
}

class Pet {
    constructor(_id, name, sprite, action) {
        this._id = _id; //string
        this.name = name;//string
        this.sprite = sprite;//number
        this.action = action;//{name, endDate}

    }
}

class Inventory {
    constructor(items) {
        this.items = items;//[]
    }
}

class Item {
    constructor(_id, name, sprite, description, data) {
        this._id = _id;//
        this.name = name;//
        this.sprite = sprite;//
        this.description = description;//
        this.data = data;//where to equip or number of uses
    }
}

class News {
    constructor(articles) {
        this.articles = articles;//[]
    }

}

class article {
    constructor(_id, name, description, update, event, important) {
        this._id = _id; //string
        this.name = name;//string
        this.description = description;//string soldier/mage
        this.update = update;//boolean
        this.event = event;//boolean
        this.important = important//boolean
    }
}

class Messages {
    constructor(sender, to, message) {
        this.sender = sender;//boolean
        this.to = to;//boolean
        this.message = message//boolean
    }
}
