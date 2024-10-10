import { Component } from '@angular/core';
import { BtnComponent } from '../btn/btn.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [BtnComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

}
