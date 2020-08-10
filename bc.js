const bcrypt = require("bcryptjs");
const { promisify } = require("util");
let { genSalt, hash, compare } = bcrypt;

genSalt = promisify(genSalt); //generates our salt -> a random string
hash = promisify(hash); // takes 2 args: a plain text password and a salt
compare = promisify(compare); //takes 2 args: a plain text and a hash compare value

module.exports.compare = compare;
module.exports.hash = (plainTxtPw) =>
    genSalt().then((salt) => hash(plainTxtPw, salt));
