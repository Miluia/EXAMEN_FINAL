import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, docData, updateDoc, addDoc, collection, collectionData, deleteDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() data: any; // Datos del evento
  @Input() isEduUser: boolean = false; // Verificar si el usuario es ".edu.bo"
  @Input() isAdminUser: boolean = false; // Verificar si es admin
  
  constructor(
    private db: DatabaseService, 
    private auth: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    if (this.data.fecha instanceof Timestamp) {
      this.data.fecha = this.data.fecha.toDate();
    }
  }

  getDiscountedPrice(ticket: any): number {
    let basePrice = ticket.precio;
  
    // Si es administrador, aplica un descuento fijo del 30%
    if (this.auth.isAdminUser(this.auth.profile?.email)) {
      return basePrice * 0.7; // Solo aplica el descuento del 30% para administradores
    }
  
    // Si es usuario normal y el ticket tiene descuento, aplica el descuento del evento
    if (ticket.descuento) {
      return basePrice - (basePrice * ticket.descuento) / 100;
    }
  
    return basePrice; // Si no hay descuento, retorna el precio original
  }
  
  getRoundedPrice(value: number): string {
    return value.toFixed(2); // Asegúrate de que value es un número
  }

  getImageUrl(imagen: string | null): string {
    const imageUrl = imagen ? `./posts/${imagen.trim().toLowerCase()}` : 'https://via.placeholder.com/150';
    return imageUrl;
  }
}
