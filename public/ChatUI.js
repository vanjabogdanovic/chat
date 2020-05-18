//UI - user interface

export class ChatUI {

    //constructor
    constructor(list) {
        this.list = list;
    }
    //set
    set list(list) {
        this._list = list;
    }
    //get
    get list() {
        return this._list;
    }

    //create new li element and show message, username and date
    templateLI(document) {
        let htmlLI = `<li data-id="${document.id}"`;
        if(document.data().username == localStorage.username) {
            htmlLI += `class="me">`;
        } else {
            htmlLI += `>`;
        }
        htmlLI += `
                <span class='username'>${document.data().username}:</span>
                <span class='message'>${document.data().message}</span>
                <div class='date'>${this.formatDate(document.data().created_at.toDate())}</div>
                <i class="fa fa-trash"></i>
            </li>
        `;
        this.list.innerHTML += htmlLI;
        this.list.scrollTop = this.list.scrollHeight;
    }

    //date formating
    dateFormat(document) {
        let date;
        let d1 = document.created_at.toDate().toString().substr(0, 15);
        let d2 = new Date().toString().substr(0, 15);
        if(d1 != d2) {
            date = document.created_at.toDate().toString().substr(4, 21);
        } else {
            date = document.created_at.toDate().toString().substr(15, 6);
        }
        return date;
    }

    //date today
    dateToday(d, m, y) {
        let today = new Date();
        let todayDay =  today.getDate();
        let todayMonth = today.getMonth() + 1;
        let todayYear = today.getFullYear();

        if(d == todayDay &&
            m == todayMonth &&
            y == todayYear) {
            return true;
        } else {
            return false;
        }
    }

    formatDate(date) {
        let d = date.getDate();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();
        let hour = date.getHours();
        let min = date.getMinutes();

        let d1 = String(d).padStart(2, '0');
        let m1 = String(m).padStart(2, '0');
        let hour1 = String(hour).padStart(2, '0');
        let min1 = String(min).padStart(2, '0');

        if(this.dateToday(d, m, y)) {
            let strDate = `${hour1}:${min1}`;
            return strDate;

        } else {
            let strDate = `${d1}.${m1}.${y}.  ${hour1}:${min1}`;
            return strDate;
        }
    }

    //delete all messages from screen
    clear() {
        this.list.innerHTML = '';
    }

    
}