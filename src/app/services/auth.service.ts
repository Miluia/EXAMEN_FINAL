import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogued$ = new BehaviorSubject<boolean>(false); // Observable para el estado de autenticación
  isAdmin$ = new BehaviorSubject<boolean>(false); 
  profile: any;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    public db: DatabaseService,
    public router: Router
  ) {
    this.verifyIsLogued(); // Verificar el estado inicial
    this.verifyIsAdmin();
    this.initializeProfile(); // Cargar perfil si está almacenado
  }

  private initializeProfile() {
    const storedProfile: any = localStorage.getItem('profile');
    if (storedProfile) {
      this.profile = JSON.parse(storedProfile);
    }
    const storedUser: any = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.getProfile(user?.uid);
    }
  }

  // Registrar un usuario
  async registerUser(email: string, password: string, additionalData: { name: string; phone: string; username: string }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const userId = userCredential.user.uid;

      const userDocRef = doc(this.firestore, `users/${userId}`);
      await setDoc(userDocRef, { ...additionalData, email });
      this.router.navigateByUrl('/login');
      console.log('Usuario registrado y documento creado en Firestore');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  }

  // Iniciar sesión
  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      localStorage.setItem('user', JSON.stringify(userCredential.user));

      const isAdmin = this.isAdminUser(email); // Determinar si es admin
      localStorage.setItem('role', isAdmin ? 'admin' : 'user'); // Guardar el rol

      this.isLogued$.next(true); // Actualizar estado de autenticación
      this.isAdmin$.next(isAdmin); // Actualizar estado de administrador

      this.getProfile(userCredential.user.uid); // Cargar perfil

      this.router.navigateByUrl(isAdmin ? '/admin-event' : '/home');
      console.log('Usuario autenticado:', userCredential.user);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  async logoutUser() {
    try {
      await this.auth.signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('profile');
      this.profile = null;
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Verificar si el usuario está autenticado
  verifyIsLogued() {
    const user = localStorage.getItem('user');
    const isLogued = !!user; // Si hay usuario, está logueado
    this.isLogued$.next(isLogued); // Notificar el estado actual
    return isLogued;
  }

  // Verificar si el usuario es administrador
  verifyIsAdmin() {
    const role = localStorage.getItem('role');
    const isAdmin = role === 'admin'; // Verificar si el rol es admin
    this.isAdmin$.next(isAdmin); // Notificar el estado actual
    return isAdmin;
  }

  // Obtener el perfil del usuario desde Firestore
  getProfile(uid: any) {
    this.db.getDocumentById('users', uid).subscribe(
      (res: any) => {
        console.log('Perfil desde Firebase:', res);
        localStorage.setItem('profile', JSON.stringify(res));
        this.profile = res;
      },
      (error: any) => {
        console.log('Error al obtener perfil:', error);
      }
    );
  }

  getUserId(): string | null {
    const user = this.auth.currentUser;
    console.log('ID del usuario:', user ? user.uid : 'No autenticado');
    return user ? user.uid : null;
  }

  isAdminUser(email: string): boolean {
    return email.endsWith('@ucb.edu.bo') || email.endsWith('@ticker.edu.bo');
  }

  getRole(): string {
    const role = localStorage.getItem('role');
    return role ? role : 'user'; // Por defecto, es un usuario normal
  }
}
