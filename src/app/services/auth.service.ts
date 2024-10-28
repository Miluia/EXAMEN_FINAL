import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogued: any;



  
  constructor(
   /*  private afAuth: AngularFireAuth,
    private firestore: Firestore */
  ) {
    this.isLogued = true;
  }

  async register(params: any) {
   // return await this.afAuth.createUserWithEmailAndPassword(params.email, params.password);
  }




  /* const userId = userCredential.user.uid;

  // Crear un documento en Firestore con el mismo UUID
  const userDocRef = doc(this.firestore, `users/${userId}`);
  await setDoc(userDocRef, { ...additionalData, email });
 */
}
