import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { CoreModule } from './core.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
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
