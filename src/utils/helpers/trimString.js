function trimString(message, length) {
    return message.length > length ? message.substring(0, length - 3) + `...` : message;
}

module.exports = trimString;
