import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];

  constructor() { }

  addToCart(item: any): void {
    this.cartItems.push(item);
    console.log('Ticket añadido al carrito:', item);
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  clearCart(): void {
    this.cartItems = [];
    console.log('Carrito vaciado');
  }
  
}