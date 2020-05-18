//app.js - connection between chat.js and ui.js

//DOM
let chatList = document.querySelector('ul');
let formNewMessage = document.getElementById('formNewMessage');
let formUpdateUsername = document.getElementById('formUpdateUsername');
let formColor =  document.getElementById('formColor');
let formDate = document.getElementById('formDate');
let inputUsername = document.querySelector('#inputUsername');
let divUpdatedUsername = document.getElementById('divUpdatedUsername');
let navRooms = document.querySelector('nav div');
let navBtns = document.querySelectorAll('nav .btn');

//add btn-selected class
let selectedBtn = button => {
    navBtns.forEach( btn => {
        btn.classList.remove('btn-selected');
    });
    button.classList.add('btn-selected');
}

//localStorage username
let username = () => {
    if(localStorage.username) {
        //if username exists in localStorage
        return localStorage.username
    } else {
        //if username doesn't exists in localStorage
        return 'anonymus';
    }
}

//localStorage room
let room = () => {
    let roomTmp = 'general';
    if(localStorage.room) {
        roomTmp = localStorage.room;
    } 
    let btnTmp = document.querySelector(`#${roomTmp}`);
    btnTmp.click();
    selectedBtn(btnTmp);
    return roomTmp;
}

//import class Chatroom
import {Chatroom} from './Chatroom.js';
let chatroom = new Chatroom(room(), username());
//import class ChatUI
import {ChatUI} from './ChatUI.js';
let ui = new ChatUI(chatList);

//show all messages
chatroom.getChats(data => ui.templateLI(data));

//prevent new line
$("textarea").keydown(function(e){
    // Enter was pressed without shift key
    if (e.keyCode == 13 && !e.shiftKey)
    {
        // prevent default behavior
        e.preventDefault();
    }
});

//add new message from textarea
let newMessage = () => {
    let inputMessage = document.getElementById('inputMessage').value;
    //message input validation
    let pattern = /^(?!\s*$).+/;
    if(pattern.test(inputMessage) && 
        inputMessage != "" && 
        inputMessage != null
    ) {
        chatroom.addChat(inputMessage)
        .then()
        .catch( error => console.log(error));
    } else {
        divUpdatedUsername.textContent = 'Please, enter your message.';
        setTimeout(() => {
            divUpdatedUsername.textContent = '';
        }, 3000);
    }
    formNewMessage.reset();
}
formNewMessage.addEventListener('submit', e => {
    e.preventDefault();
    newMessage();
});
formNewMessage.addEventListener('keyup', e => {
    e.preventDefault();
    if(e.keyCode == 13 && !e.shiftKey) {
        newMessage();
    }
});

//update username
formUpdateUsername.addEventListener('submit', e => {
    e.preventDefault();
    let newUsername = inputUsername.value;
    //username input validation
    let pattern = /^(?!\s*$).+/;
    if(pattern.test(newUsername) && 
        newUsername != "" && 
        newUsername != null
    ) {
        chatroom.updateUsername(newUsername)
        formUpdateUsername.reset();
        room();
        divUpdatedUsername.innerHTML = 'Your username was updated to <span id="spanNewUsername">' + newUsername + '</span>';
        setTimeout(() => {
            divUpdatedUsername.textContent = '';
        }, 3000);
    } else {
        divUpdatedUsername.textContent = 'Please, enter username.';
        setTimeout(() => {
            divUpdatedUsername.textContent = '';
        }, 3000);
    }
});

//update room
navRooms.addEventListener('click', e => {
    if(e.target.tagName == 'BUTTON') {
        //delete all messages when room is changed
        ui.clear();
        //change room
        let roomID = e.target.getAttribute('id');
        localStorage.setItem('room', roomID);
        chatroom.updateChatroom(roomID);
        //add class btn-selected
        selectedBtn(e.target);
        //show messages from new room
        chatroom.getChats( chat => ui.templateLI(chat));
    }
});

//background color
if(localStorage.color) {
    document.body.style.backgroundColor = localStorage.color;
}

//update background color 
formColor.addEventListener('submit', e => {
    e.preventDefault();
    let color = document.getElementById('inputColor').value;
    document.body.style.backgroundColor = color;
    localStorage.setItem('color', color);
});

//delete message
chatList.addEventListener('click', e => {
    if(e.target.tagName == "I") {
        Swal.fire({
            title: 'Are you sure?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'purple',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          })
          .then((result) => {
            if (result.value) {
                Swal.fire(
                    'Deleted!',
                    'Message has been deleted.',
                    'success'
                );
                if(e.target.parentElement.classList.contains('me')) {
                    let id = e.target.parentElement.getAttribute('data-id');
                    chatroom.deleteMessage(id);
                    chatList.removeChild(e.target.parentElement);
                } else {
                    chatList.removeChild(e.target.parentElement);
                }
            } 
        }); 
    }
});

//sort messages by date
formDate.addEventListener('submit', e => {
    e.preventDefault();
    let from = new Date(document.getElementById('input-from').value);
    let to = new Date(document.getElementById('input-to').value);
    ui.clear();
    chatroom.sortByDate(from, to, data => ui.templateLI(data));
});