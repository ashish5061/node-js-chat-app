const generateMessage = (username,text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generatelocationMessage = (username,mapsurl) => {
    return {
        username,
        mapsurl,
        createdAt: new Date().getTime()

    }
}

module.exports = {
    generateMessage,
    generatelocationMessage
}