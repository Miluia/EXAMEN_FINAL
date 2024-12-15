import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  private subscriptions = new Subscription();

  constructor(public auth: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Suscribirse al estado de autenticación (opcional)
    this.subscriptions.add(
      this.auth.isLogued$.subscribe((isLogued) => {
        console.log('Estado de autenticación actual:', isLogued);
      })
    );
  }

  ngOnDestroy(): void {
    console.log('destroy login');
    this.subscriptions.unsubscribe(); // Limpiar suscripciones
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.auth
        .loginUser(email, password)
        .then(() => {
          const role = this.auth.getRole();
          if (role === 'admin') {
            alert('Bienvenido administrador');
          } else {
            alert('Bienvenido usuario');
          }
        })
        .catch((error) => {
          console.error('Error al iniciar sesión:', error);
          alert('Credenciales incorrectas o problema con la autenticación.');
        });
    } else {
      alert('Formulario inválido. Verifica los datos ingresados.');
    }
  }
}
