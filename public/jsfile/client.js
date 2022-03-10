const chatForm = document.getElementById('chatform');
const chatMessages = document.querySelector('.chatmessages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input area
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});
socket.on('locationmessage', (mess) => {

    console.log("locationmessage", mess);
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', mess.url);
    a.innerText = 'My Current Location';
    li.appendChild(a);
    document.querySelector('.chatmessages').appendChild(li);


})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');

    // first way
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
        </p>`;

    // //********* *and one another /second way to pass the message*************

    // const p = document.createElement('p');
    // p.classList.add('meta');
    // p.innerText = message.username;
    // p.innerHTML += `<span>${message.time}</span>`;
    // div.appendChild(p);
    // const para = document.createElement('p');
    // para.classList.add('text');
    // para.innerText = message.text;
    // div.appendChild(para);

    document.querySelector('.chatmessages').appendChild(div);
}

// Adding room name to the  DOM
function outputRoomName(room) {
    roomName.innerHTML = room;

}

// Adding users to the DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

//Prompt the user before leave the chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {
            alert('Unable to fetch location.')
        })
    })
})

