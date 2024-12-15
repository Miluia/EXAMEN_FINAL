import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
///////// importar firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

///////// importar httopclient module de forma global
import { HttpClientModule } from '@angular/common/http';
import { NgModel, ReactiveFormsModule } from '@angular/forms';

///// para login y registro ////
import { Auth } from '@angular/fire/auth';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule, ReactiveFormsModule,  AngularFireAuthModule,
      CommonModule),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyAEtbiMytmncJ5hRhknnqH6njXa9Vrdwdo",
      authDomain: "progra-dbe41.firebaseapp.com",
      projectId: "progra-dbe41",
      storageBucket: "progra-dbe41.firebasestorage.app",
      messagingSenderId: "596729176935",
      appId: "1:596729176935:web:510999bfda1fa0ba2cc5c2",
      measurementId: "G-9HYR1S7P3R"
    })),
    ////// para login y registro
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
