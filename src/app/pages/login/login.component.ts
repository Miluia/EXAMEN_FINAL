import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor() {
    console.log('constructor login');
    this.imprimirMensaje();
    this.imprimirMensaje2();
  }

  imprimirMensaje(){
    console.log('inicie sesión para continuar');
  }

  imprimirMensaje2(){
    console.log('......');
  }

}
