import { Component, OnInit } from '@angular/core';

import Gun from 'gun';
const SEA = require('gun/sea');
import 'gun/lib/radix'
import 'gun/lib/radisk'
import 'gun/lib/store'
import 'gun/lib/rindexed'
import 'gun/lib/webrtc'
import 'gun/nts'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  alias = null;
  username = ''
  password = ''
  title = 'dapp';
  db = new Gun([ 'http:localhost:4200/gun', 'https://gun-dapp.herokuapp.com/gun' ]);
  user = this.db.user().recall({sessionStorage: true});
  message = '';
  todos: any = [];

  constructor() {

  }

  ngOnInit() {

  }

  createUser() {
    this.user.create(this.username, this.password)
    console.log(this.user)
  }

  login() {
    this.user.auth(this.username, this.password, (opt: any) => {
      console.log(opt)
      this.user.get('alias', (alias: any) => this.alias = alias.put);
      this.db.get('chat', (chat) => console.log(chat)).map().on((async data => {
        const key = '#foo';
        const message = {
          who: await this.db.user(data).get('alias'),
          what: (await SEA.decrypt(data.what, key) + ''),
        }
        this.todos.push(message);
      }));
    })
  }

  logout() {
    this.user.leave();
    this.alias = null;
  }

  async sendMessage() {
    const secret = await SEA.encrypt(this.message, '#foo');
    const message = this.user.get('all').set({what: secret});
    const index = new Date().toISOString();
    this.db.get('chat').get(index).put(message);
  }

}
