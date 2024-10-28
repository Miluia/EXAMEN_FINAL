import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
///////// importar firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

///////// importar httopclient module de forma global
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { Auth } from '@angular/fire/auth';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule, ReactiveFormsModule,  AngularFireAuthModule),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyDCZapGt7BC69fT1GG2ZAIgm6FpuzftpJM",
      authDomain: "progra2-2.firebaseapp.com",
      projectId: "progra2-2",
      storageBucket: "progra2-2.appspot.com",
      messagingSenderId: "580133731545",
      appId: "1:580133731545:web:ff5d7b4515d30c32c552c8"
    })),
    provideFirestore(() => getFirestore()),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)
  ]
};
