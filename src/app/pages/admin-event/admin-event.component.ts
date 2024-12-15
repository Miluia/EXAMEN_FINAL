import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-event',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './admin-event.component.html',
  styleUrls: ['./admin-event.component.scss']
})

export class AdminEventComponent implements OnInit {
  eventForm: FormGroup;
  eventos: any[] = [];
  selectedEventId: string | null = null;

  constructor(private fb: FormBuilder, private db: DatabaseService) {
  this.eventForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', [Validators.required, Validators.min(0)]],
    fecha: ['', Validators.required],
    ubicacion: ['', Validators.required],
    imagen: ['', Validators.required],
    categoria: ['', Validators.required],
    descuento: [0, [Validators.min(0), Validators.max(100)]], // Campo descuento
    destacado: [false] // Campo destacado
  });
}

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos() {
    this.db.fetchFirestoreCollection('eventos')
      .subscribe(
        (res: any[]) => {
          this.eventos = res.map(evento => {
            return {
              ...evento,
              fecha: evento.fecha?.toDate() || null
            };
          });
          console.log('Eventos cargados:', this.eventos);
        },
        (error) => {
          console.error('Error al cargar eventos:', error);
        }
      );
  }

  createEvent() {
    if (this.eventForm.valid) {
      const eventData = {
        ...this.eventForm.value,
        fecha: Timestamp.fromDate(new Date(this.eventForm.value.fecha)), // Convertir fecha
        descuento: this.eventForm.value.descuento || 0, // Asegúrate de que descuento tenga un valor por defecto
      };
  
      this.db.addFirestoreDocument('eventos', eventData)
        .then(() => {
          this.eventForm.reset();
          this.loadEventos();
        })
        .catch(err => console.error('Error al crear evento:', err));
    }
  }
  
  

  deleteEvent(eventId: string) {
    this.db.deleteFirestoreDocument('eventos', eventId)
      .then(() => this.loadEventos())
      .catch(err => console.error('Error al eliminar evento:', err));
  }

  // Implementar métodos para editar eventos
  editEvent(event: any) {
    this.selectedEventId = event.id; // Guarda el ID del evento seleccionado
    this.eventForm.patchValue({
      ...event,
      fecha: event.fecha ? event.fecha.toISOString().split('T')[0] : '' // Convierte Timestamp a fecha para el formulario
    });

    // Desplaza la página al formulario
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Desplazamiento suave
      });

  }
  

  updateEvent() {
    if (this.eventForm.valid && this.selectedEventId) {
      const updatedEvent = {
        ...this.eventForm.value,
        fecha: Timestamp.fromDate(new Date(this.eventForm.value.fecha)), // Convertir fecha
        descuento: this.eventForm.value.descuento || 0, // Asegúrate de que descuento tenga un valor por defecto
      };
  
      this.db.updateFirestoreDocument('eventos', this.selectedEventId, updatedEvent)
        .then(() => {
          this.eventForm.reset();
          this.selectedEventId = null;
          this.loadEventos();
        })
        .catch(err => console.error('Error al actualizar evento:', err));
    }
  }
  
  
  updateEventFromTable(eventId: string) {
    const updatedEvent = this.eventos.find(event => event.id === eventId);
    if (updatedEvent) {
      this.db.updateFirestoreDocument('eventos', eventId, updatedEvent)
        .then(() => {
          console.log('Evento actualizado desde la tabla');
          this.loadEventos();
        })
        .catch(err => console.error('Error al actualizar evento desde tabla:', err));
    }
    
  }
  
}