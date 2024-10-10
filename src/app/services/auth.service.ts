import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogued: any;
  constructor() {
    this.isLogued = true;
  }
}
