import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { DatabaseService } from '../../services/database.service';
import { NgFor } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CardComponent } from '../../components/card/card.component'; // Importa CardComponent
import { CommonModule } from '@angular/common';
import { Firestore, doc, docData, updateDoc, addDoc, collection, collectionData, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, NgFor, CommonModule, CardComponent], // Asegúrate de que FormsModule esté aquí
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  search: string = '';
  alldata: any[] = []; // Datos originales
  filtered: any[] = []; // Datos filtrados
  categories: string[] = ['kpop', 'jpop', 'pop', 'metal', 'clasico']; // Categorías disponibles
  selectedCategory: string | null = null; // Categoría seleccionada
  selectedDate: string | null = null; // Fecha seleccionada
  selectedLocation: string | null = null; // Ubicación seleccionada

  constructor(
    public auth: AuthService,
    public db: DatabaseService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    console.log('Usuario autenticado:', this.auth.verifyIsLogued());
    this.loadData();
  }

  loadData() {
    this.db.fetchFirestoreCollection('eventos')
      .subscribe(
        (res: any[]) => {
          console.log('Datos cargados desde Firestore:', res);
  
          this.alldata = res.map(event => ({
            ...event,
            nombre: event.nombre || '', 
            categoria: event.categoria || 'sin-categoria', 
            fecha: event.fecha?.seconds 
              ? new Date(event.fecha.seconds * 1000) 
              : null 
          }));
  
          this.filtered = [...this.alldata]; 
          console.log('Datos normalizados:', this.alldata);
        },
        (error: any) => {
          console.error('Error al cargar datos:', error);
        }
      );
  }

  searchOnChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filtered = this.alldata.filter(item => {
      const matchesName = this.search
        ? item.nombre.toLowerCase().includes(this.search.toLowerCase())
        : true;
  
      const matchesCategory = this.selectedCategory
        ? item.categoria.toLowerCase() === this.selectedCategory.toLowerCase()
        : true;
  
      const matchesDate = this.selectedDate
        ? item.fecha && new Date(item.fecha).toDateString() === new Date(this.selectedDate).toDateString()
        : true;
  
      const matchesLocation = this.selectedLocation
        ? item.ubicacion && item.ubicacion.includes(this.selectedLocation)
        : true;
  
      return matchesName && matchesCategory && matchesDate && matchesLocation;
    });
  
    console.log('Datos filtrados combinados:', this.filtered);
  }

  searchDocument() {
    this.applyFilters();
  }

  // Filtrar por categoría
  filterByCategory() {
    this.applyFilters(); // Simplemente llamamos a applyFilters() para combinar todos los filtros
  }

  // Filtrar por fecha
  filterByDate() {
    this.applyFilters();
  }

  // Filtrar por ubicación
  filterByLocation() {
    this.applyFilters();
  }
}