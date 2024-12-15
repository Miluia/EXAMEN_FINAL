import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, docData, updateDoc, addDoc, collection, collectionData, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  evento$: Observable<any> | undefined;
  evento: any;
  opinions: any[] = [];
  newOpinion: string = '';
  rating = 0;
  showRatingSection = false;
  showThanks = false;
  showOpinionsSection = false;
  showPurchaseSection = false;
  ticketQuantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private auth: AuthService,
    private cartService: CartService,
    private db: DatabaseService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      const eventDocRef = doc(this.firestore, `eventos/${eventId}`);
      this.evento$ = docData(eventDocRef).pipe(
        map((evento: any) => {
          this.evento = evento;
          return {
            ...evento,
            fecha: evento.fecha instanceof Timestamp ? evento.fecha.toDate() : evento.fecha
          };
        })
      );

      this.loadOpinions(eventId);
    } else {
      console.error('Event ID no encontrado en la ruta');
    }
  }

  getImageUrl(imagen: string | null): string {
    return imagen ? `/posts/${imagen.trim().toLowerCase()}` : 'https://via.placeholder.com/150';
  }

  rateEvent(star: number): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      const eventDocRef = doc(this.firestore, `eventos/${eventId}`);
      updateDoc(eventDocRef, { calificacion: star })
        .then(() => {
          this.rating = star;
          this.showThanks = true;
          console.log('Calificación guardada exitosamente:', star);
        })
        .catch(err => console.error('Error al guardar calificación:', err));
    }
  }

  loadOpinions(eventId: string): void {
    const opinionsCollectionRef = collection(this.firestore, `eventos/${eventId}/opiniones`);
    collectionData(opinionsCollectionRef, { idField: 'id' }).subscribe(
      (data: any[]) => {
        this.opinions = data.map(opinion => ({
          ...opinion,
          fecha: opinion.fecha instanceof Timestamp ? opinion.fecha.toDate() : opinion.fecha
        }));
      },
      (error: unknown) => {
        if (error instanceof Error) {
          console.error('Error al cargar opiniones:', error.message);
        } else {
          console.error('Error desconocido al cargar opiniones:', error);
        }
      }
    );
  }
  
  submitOpinion(): void {
    if (this.newOpinion.trim() === '') return;

    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      const opinionsCollectionRef = collection(this.firestore, `eventos/${eventId}/opiniones`);
      addDoc(opinionsCollectionRef, {
        text: this.newOpinion,
        fecha: new Date()
      })
        .then(() => {
          console.log('Opinión guardada exitosamente');
          this.newOpinion = '';
          this.loadOpinions(eventId);
        })
        .catch(err => console.error('Error al guardar opinión:', err));
    }
  }

  toggleRatingSection(): void {
    this.showRatingSection = !this.showRatingSection;
    if (this.showRatingSection) {
      this.showOpinionsSection = false;
      this.showPurchaseSection = false;
    }
  }

  toggleOpinionsSection(): void {
    this.showOpinionsSection = !this.showOpinionsSection;
    if (this.showOpinionsSection) {
      this.showRatingSection = false;
      this.showPurchaseSection = false;
    }
  }

  togglePurchaseSection(): void {
    this.showPurchaseSection = !this.showPurchaseSection;
    if (this.showPurchaseSection) {
      this.showRatingSection = false;
      this.showOpinionsSection = false;
    }
    if (!this.showPurchaseSection) {
      this.ticketQuantity = 1;
    }
  }

  buyNow(): void {
    if (this.ticketQuantity <= 0 || this.ticketQuantity > 10) {
        alert('Por favor selecciona una cantidad válida de tickets (1-10).');
        return;
    }

    const userId = this.auth.getUserId();

    const purchaseDetails = {
      nombreEvento: this.evento.nombre,
      cantidadTickets: this.ticketQuantity,
      fechaCompra: new Date(),
      userId: userId,
      imagenEvento: this.evento.imagen
    };

    if (userId) {
        const purchasesCollectionRef = collection(this.firestore, `users/${userId}/compras`);
        addDoc(purchasesCollectionRef, purchaseDetails)
            .then(() => {
                alert(`${this.ticketQuantity} tickets comprados para ${this.evento.nombre}!`);
                this.removeTicketFromCart();
            })
            .catch(err => console.error('Error al guardar la compra:', err));
    } else {
        alert('Usuario no autenticado. No se puede realizar la compra.');
    }
}

removeTicketFromCart(): void {
  const userId = this.auth.getUserId();
  const ticketId = this.evento.id;

  if (userId) {
      const ticketDocRef = doc(this.firestore, `users/${userId}/tickets/${ticketId}`);
      deleteDoc(ticketDocRef)
          .then(() => console.log('Ticket eliminado del carrito'))
  }
}

addToCart() {
  const userId = this.auth.getUserId();
  if (!userId) {
    console.error('No se pudo agregar al carrito porque el usuario no está autenticado');
    return;
  }

  const ticket = {
    nombre: this.evento.nombre,
    precio: this.evento.precio,
    cantidad: this.ticketQuantity,
    userId: userId,
    fecha: this.evento.fecha,
    ubicacion: this.evento.ubicacion,
    imagen: this.evento.imagen
  };

  this.db.addTicketToUser (userId, ticket)
    .then(() => alert('Ticket añadido al carrito'))
    .catch(err => console.error('Error al añadir el ticket al carrito:', err));
}
}