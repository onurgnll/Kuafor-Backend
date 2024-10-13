const bcrypt = require("bcrypt");

const cryptPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 12);

    return hashedPassword

}

module.exports = {
    cryptPassword
}