//objetos para insertar en base de datos
class User{
    constructor(id, nick, pass, email, characters, login) {
        this.id = id; //string
        this.nick = nick;//string
        this.pass = pass;//string
        this.email = email;//string
        this.characters = characters;//array
        this.login = login;//date
    }
    
}

class Character{
    constructor(UserId, id, name, type, qualities, statistics,pets,login) {
        this.UserId = UserId; //string
        this.id = id; //string
        this.name = name;//string
        this.type = type;//string soldier/mage
        this.qualities = qualities;//{}
        this.statistics = statistics;//{}
        this.pets = pets//objet
        this.login = login;//date
    }
    
}

class Pet{
    constructor(id, name, action) {
        this.id = id; //string
        this.name = name;//string
        this.action = action;//{name, endDate}
        
    }
    
}

class Inventory{
    constructor(id, items) {
        this.id = id; //string
        this.name = name;//string
        this.type = type;//string soldier/mage
        this.qualities = qualities;//{}
        this.statistics = statistics;//{}
        this.pets = pets//objet
    }
    
}

class News{
    constructor(id, articles) {
        this.id = id; //string
        this.articles = articles;//[]
    }
    
}

class article{
    constructor(id, name, description, update, event, important) {
        this.id = id; //string
        this.name = name;//string
        this.description = description;//string soldier/mage
        this.update = update;//boolean
        this.event = event;//boolean
        this.important = important//boolean
    }
}

/**
* en la bd coleccion de usuarios, personajes, mascotas e inventarios
* 
*/