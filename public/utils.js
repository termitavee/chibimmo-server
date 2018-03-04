const util = require('util');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const { mail, cred } = require('./db/data')

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: mail.user,
        pass: mail.pass
    }
});
const

    parseBody = function (t) {
        return JSON.parse(Object.keys(t)[0])
    }

getIP = () => {
    const ips = require('child_process').execSync("ifconfig | grep inet | grep -v inet6 | awk '{gsub(/addr:/,\"\");print $2}'").toString().trim().split("\n")
    return ips.filter(i => i != "127.0.0.1")

}

checkDB = (client, url) => {
    client.connect(url, function (err, db) {
        if (err) {
            console.error("Database not found. It's running MongoDB?")
        } else {
            console.log("Database found.")
        }
    })
}

stringInject = (t, i) => {

    for (let key in data) {
        return t.replace(/({([^}]+)})/g, function (j) {
            let key = j.replace(/{/, '').replace(/}/, '');
            if (!data[key]) {
                return j;
            }
            return data[key];
        });
    }
}

//reference to rammstein \m/
doHash = (s, h = 'md5') => {
    //a = typeof h != null ? a : 'md5';
    return crypto.createHash(h).update(email).digest('hex');
}

generateID = (a = 2) => {
    return Math.random().toString(36).substring(a);
}

sendEmail = (userMail, type, args) => {

    let { START, SIGNUP, SIGNIN, REMEMBER } = mailContentID
    const mailOptions = {
        from: '"chibimmo" <project.chibimmo@gmail.com>',
        to: userMail,
        subject: "",
        html: "",
        text: ""
    };
    switch (type) {
        case START:
            const currentTime = Date()
            mailOptions.subject = startContent.subject
            mailOptions.html = util.format(startContent.html, currentTime)
            mailOptions.text = util.format(startContent.text, currentTime)
            break

        case SIGNUP:

            mailOptions.subject = signUpContent.subject
            mailOptions.html = signUpContent.html
            mailOptions.text = signUpContent.text
            //TODO update args
            break

        case SIGNIN:
            //TODO WAT    
            mailOptions.subject = signInContent.subject
            mailOptions.html = signInContent.html
            mailOptions.text = signInContent.text
            //TODO update args
            break

        case REMEMBER:

            mailOptions.subject = forgetContent.subject
            mailOptions.html = forgetContent.html
            mailOptions.text = forgetContent.text
            //TODO update args
            break

        default:
            mailOptions.subject = dummyContent.subject
            mailOptions.html = util.format(dummyContent.html, args)
            mailOptions.text = util.format(dummyContent.text, args)
    }

    nodemailer.createTestAccount((err, account) => {

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Message sent successfuly to: %s', info.accepted);
            }
            console.log(info);

        });
    });

}
const mailContentID = {
    START: 0,
    SIGNUP: 1,
    SIGNIN: 2,
    REMEMBER: 3

}

const dummyContent = {
    subject: 'Hello ✔', // Subject line
    text: 'Hello world? %o', // plain text body
    html: '<b>Hello world?</b><p>%o</p>' // html body
}

const startContent = {
    subject: "Server Started",
    text: "Server launched at %s",
    html: "<p>Server launched at %s</p>"
}

const signUpContent = {
    subject: "Welcome to chibimmo",
    text: `in order to activate your account, click here  www.${getIP()[0]}:1993/activate/:id`,
    html: "<p>in order to activate your account, click here  www.${getIP()[0]}:1993/activate/:id</p>"
}
const signInContent = {
    subject: "",
    text: "",
    html: ""
}

const forgetContent = {
    subject: "",
    text: "",
    html: ""
}


module.exports = { parseBody, getIP, checkDB, sendEmail, mailContentID, doHash }