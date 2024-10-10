import { Component, OnDestroy } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { MessageComponent } from '../../components/message/message.component';
import { BtnComponent } from '../../components/btn/btn.component';
/////// paso 1 importar servicio
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, MessageComponent, BtnComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {
  title: any;
  subtitle: any;
  link: any;
  constructor(
    public auth: AuthService /////// paso 2 importar servicio
  ) {
    this.link = 'https://drive.google.com/drive/u/0/';
    this.title = 'Welcome home ';
    this.subtitle = 'Lorem ipsum sit dolor amet';
    auth.isLogued = false;
    console.log('constructor home', auth.isLogued)
  }

  ngOnDestroy(): void {
      console.log('destroy home')
  }
}
