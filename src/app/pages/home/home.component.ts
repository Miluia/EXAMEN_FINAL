import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title: any;
  subtitle: any;
  link: any;
  constructor() {
    this.link = 'https://drive.google.com/drive/u/0/';
    this.title = 'Welcome home ';
    this.subtitle = 'Lorem ipsum sit dolor amet';
  }
}
