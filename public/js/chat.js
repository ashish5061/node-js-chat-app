const socket = io()

const $messageform = document.querySelector('#message-form')
const $messageformInput = $messageform.querySelector('input')
const $messageformButton = $messageform.querySelector('button')
const $sendlocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationmessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=  document.querySelector('#sidebar-template').innerHTML

//Options
const{username, room}=Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset+1) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm:a')


    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage',(message) => {
    console.log(message)
    const html = Mustache.render(locationmessageTemplate,{
        username: message.username,
        mapsurl: message.mapsurl,
        createdAt: moment(message.createdAt).format('h:mm:a')

    })

    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML= html
})



$messageform.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageformButton.setAttribute('disabled','disabled')
    
    const message =  e.target.elements.message.value

    socket.emit('sendMessage', message,(error) => {

        $messageformButton.removeAttribute('disabled')
        $messageformInput.value = ''
        $messageformInput.focus()
        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')

    })

})
$sendlocationButton.addEventListener('click',() => {
   
    if (!navigator.geolocation) {
        return alert ('Geolocation is not supported by your browser')
    }

    $sendlocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {

    socket.emit('sendlocation',{
        
        
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,

    }, () => {
        $sendlocationButton.removeAttribute('disabled')
        console.log('location shared ')

    })


    })
})

socket.emit('join', {username, room},( error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }

})

