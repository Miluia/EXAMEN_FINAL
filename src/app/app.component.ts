import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { BtnComponent } from './components/btn/btn.component';
import { MessageComponent } from './components/message/message.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core.module';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    CardComponent,
    BtnComponent,
    MessageComponent,
    CoreModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isMenuOpen = false;
  isLogued = false;
  isAdmin = false;

  constructor(private authService: AuthService) {
    console.log('constructor app component');
  }

  ngOnInit() {
    // Suscribirse al estado de autenticación
    this.authService.isLogued$.subscribe((logued) => {
      this.isLogued = logued;
      console.log('Estado de logueo actualizado:', this.isLogued);
    });

    // Obtener si el usuario es administrador directamente
    const role = this.authService.getRole();
    this.isAdmin = role === 'admin';
    console.log('Estado de administrador:', this.isAdmin);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
