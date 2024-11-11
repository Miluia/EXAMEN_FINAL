import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  constructor(
    public auth: AuthService,
    public db: DatabaseService
  ) {
    console.log('hola desde perfil component', auth.profile);

   /*  db.updateFirestoreDocument('users', auth.profile.id, { phone: '+591145625' });
    db.updateFirestoreDocument('users', auth.profile.id, {
      description: 'Full Stack developer',
      ocupation: 'Teacher',
      link: 'https:github.com/@lopezfer',
      protraitPhoto: '',
      nickname: 'lopezfer',
      verified: 'true',

      followers: [],
      following: [],
      posts: []
    }); */
  }



}
