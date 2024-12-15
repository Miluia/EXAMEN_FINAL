import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import { Firestore, doc, docData, updateDoc, addDoc, collection, collectionData, deleteDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'], // Archivo de estilo conectado
  imports: [CommonModule, FormsModule, CardComponent],
})

export class CartComponent implements OnInit {
  tickets: any[] = [];
  total: number = 0;

  constructor(
    private db: DatabaseService, 
    private auth: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    if (this.auth.verifyIsLogued()) {
      this.loadTickets();
    } else {
      console.error('Usuario no autenticado');
    }
  }

  loadTickets() {
    const userId = this.auth.getUserId();
    this.db.getDocumentsByField(`users/${userId}/tickets`, 'userId', userId).subscribe((tickets: any[]) => {
      this.tickets = tickets.map(ticket => ({
        ...ticket,
        
        precioFinal: this.getDiscountedPrice(ticket), // Calcula el precio con descuento
        fecha: ticket.fecha instanceof Timestamp ? ticket.fecha.toDate() : ticket.fecha // Convierte Timestamp
      }));
      this.calculateTotal();
    });
  }
  
  isNaN(value: any): boolean {
    return isNaN(value);
  }
  
  incrementQuantity(ticket: any) {
    ticket.cantidad++;
    this.calculateTotal();
    this.updateTicketInFirestore(ticket);
  }

  decrementQuantity(ticket: any) {
    if (ticket.cantidad > 1) {
      ticket.cantidad--;
      this.calculateTotal();
      this.updateTicketInFirestore(ticket);
    }
  }

  calculateTotal() {
    this.total = this.tickets.reduce((acc, ticket) => {
      return acc + ticket.precioFinal * ticket.cantidad;
    }, 0);
  }

  removeTicket(ticketId: string) {
    const userId = this.auth.getUserId();
    this.db.deleteFirestoreDocument(`users/${userId}/tickets`, ticketId)
      .then(() => this.loadTickets());
  }
  
  confirmPurchase() {
    const userId = this.auth.getUserId();
    this.tickets.forEach(ticket => {
        const purchaseDetails = {
            nombreEvento: ticket.nombre,
            cantidadTickets: ticket.cantidad,
            fechaCompra: new Date(),
            userId: userId,
        };
  
        const purchasesCollectionRef = collection(this.firestore, `users/${userId}/compras`);
        addDoc(purchasesCollectionRef, purchaseDetails)
            .then(() => {
                alert(`${ticket.cantidad} tickets comprados para ${ticket.nombre}!`);
                this.removeTicket(ticket.id);
            })
            .catch(err => console.error('Error al guardar la compra:', err));
    });
  }

  updateTicketInFirestore(ticket: any) {
    const userId = this.auth.getUserId();
    this.db.updateTicketQuantity(userId, ticket.id, { cantidad: ticket.cantidad })
      .then(() => console.log('Cantidad actualizada en Firestore'))
      .catch(err => console.error('Error al actualizar la cantidad en Firestore:', err));
  }

  getDiscountedPrice(ticket: any): number {
    let basePrice = ticket.precio;
  
    // Administrador: aplica un descuento fijo del 30%
    if (this.auth.isAdminUser(this.auth.profile?.email)) {
      return Math.round(basePrice * 0.7 * 100) / 100;
    }
  
    // Usuario normal: aplica el descuento específico del ticket
    if (ticket.descuento) {
      return Math.round((basePrice - (basePrice * ticket.descuento) / 100) * 100) / 100;
    }
  
    return basePrice; // Si no hay descuento, retorna el precio original
  }

  getRoundedPrice(value: any): string {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      console.error('Error en getRoundedPrice: el valor no es un número:', value);
      return '0.00';
    }
    return numValue.toFixed(2);
  }
  
  getImageUrl(imagen: string | null): string {
    const url = imagen ? `./posts/${imagen.trim().toLowerCase()}` : 'https://via.placeholder.com/150';
    console.log('Image URL:', url);
    return url;
  }
  
  
  
}