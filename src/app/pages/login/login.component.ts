import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  constructor(
    public auth: AuthService
  ) {
   // this.imprimirMensaje();
   // this.imprimirMensaje2();
    console.log('constructor login', auth.isLogued);
  }

  ngOnDestroy(): void {
      console.log('destroy login')
  }

  imprimirMensaje(){
    console.log('inicie sesión para continuar');
  }

  imprimirMensaje2(){
    console.log('......');
  }

}
