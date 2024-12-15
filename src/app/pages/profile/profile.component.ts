import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    NgFor,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  postsFiltrados: any;
  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    private router: Router
    
  ) {
    this.db.getDocumentsByField('posts', 'userId', this.auth.profile?.id)
    .subscribe((res: any)=>{
      console.log('posts filtrados', res);
      this.postsFiltrados = res;
    });
  }

  onLogout() {
    this.auth.logoutUser().then(() => {
      alert('Has cerrado sesión.');
      this.router.navigate(['/login']);
    });
  }
}
