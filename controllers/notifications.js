
const { UserNotification,CoiffeurNotification } = require("../models");

const createUserNotification = async (userID, title , content) => {
    try {
        
        const notification = await UserNotification.create({
            userID,
            title,
            content

        })
        return notification

    } catch (error) {
        console.log(error);
        return
    }
}
const createCoiffeurNotification = async (coiffeurID, title , content) => {
    try {
        
        const notification = await CoiffeurNotification.create({
            coiffeurID,
            title,
            content

        })
        return notification

    } catch (error) {
        console.log(error);
        return
    }
}

module.exports = {
    createCoiffeurNotification,
    createUserNotification
}