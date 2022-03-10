const moment = require('moment')

let generateLocationMessage = (username, latitude, longitude) => {
    return {
        username,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        time: moment().format('h:mm a')
    }

}
function formatMessages(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}
module.exports = { formatMessages, generateLocationMessage };

