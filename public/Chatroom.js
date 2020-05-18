export class Chatroom {

    //constructor
    constructor(room, username) {
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }

    //set
    set room(room) {
        this._room = room;
    }
    set username(username) {
        this._username = username;
    }

    //get
    get room() {
        return this._room;
    }
    get username() {
        return this._username;
    }

    //change username
    updateUsername(newUsername) {
        this.username = newUsername;
        localStorage.setItem('username', newUsername);
    }

    //change room
    updateChatroom(newRoom) {
        this.room = newRoom;
        if(this.unsub) {
            this.unsub();
        }
    }

    //async function for adding new message to firebase
    async addChat(message) {

        let date = new Date();

        //creating new document that will be added to firebase
        let chat = {
            message: message,
            room: this.room,
            username: this.username,
            created_at: firebase.firestore.Timestamp.fromDate(date)
        }

        //adding chat(document) to this.chats(it contains whole collection from firebase)
        let response = await this.chats.add(chat);
        return response;
        
    }

    //show all messages
    getChats(callback) {
        this.unsub = this.chats
            .where('room', '==', this.room)
            .orderBy('created_at')
            .onSnapshot( snapshot => {
                snapshot.docChanges().forEach( change => {
                    if(change.type == 'added') {
                        //add message after change
                        callback(change.doc);
                    }
                });
        });
    }

    //delete message 
    deleteMessage(id) {
        this.chats.doc(id).delete();
    }

    //sort messages by date
    sortByDate(from, to, callback) {
        this.chats
        .where('room', '==', this.room)
        .where('created_at', '>', firebase.firestore.Timestamp.fromDate(from))
        .where('created_at', '<', firebase.firestore.Timestamp.fromDate(to))
        .orderBy('created_at')
        .onSnapshot( snapshot => {
            snapshot.docChanges().forEach( change => {
                if(change.type == 'added') {
                    callback(change.doc)
                }
            });
        });
    }
}

//async function - .than and .catch
// chatroom.addChat('Hello')
//     .then(console.log('Success!'))
//     .catch( error => console.log(error));

//examle of callback function
// function hello(name) {
//     alert('Hello' + name);
// }
// function enterName(callback) {
//     let name = prompt('Enter your name');
//     callback(name);
// }