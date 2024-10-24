import { Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { BtnComponent } from './components/btn/btn.component';
import { MessageComponent } from './components/message/message.component';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink, RouterOutlet, CardComponent, BtnComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular1';

  constructor(){
    console.log('constructor app component');
  }


  sumar(){
    let num1 = 2;
    let num2 = 3;
    return num1 + num2;
  }
}
