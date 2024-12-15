import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { CardComponent } from '../../components/card/card.component';
import { MessageComponent } from '../../components/message/message.component';
import { BtnComponent } from '../../components/btn/btn.component';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TabbarComponent } from '../../components/tabbar/tabbar.component';
import { CommonModule } from '@angular/common'; // Importa CommonModule
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgFor,
    CardComponent,
    MessageComponent,
    TabbarComponent,
    BtnComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title: string = 'Eventos Disponibles';
  eventos: any[] = [];
  filteredEventos: any[] = [];
  isEduUser: boolean = false;
  isAdminUser: boolean = false; // Nueva variable para verificar admin
  showOnlyDestacados: boolean = false;

  constructor(
    public auth: AuthService,
    private db: DatabaseService,
    public http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadEventos();
    this.checkUserEmail();
  }

  loadEventos() {
    this.db.fetchFirestoreCollection('eventos').subscribe(
      (res: any[]) => {
        this.eventos = res.map(evento => ({
          ...evento,
          fecha: evento.fecha?.toDate() || null,
          destacado: evento.destacado || false
        }));
        this.filteredEventos = [...this.eventos];
      },
      (error) => console.error('Error al cargar eventos:', error)
    );
  }
  toggleDestacados() {
    this.showOnlyDestacados = !this.showOnlyDestacados;
    this.filteredEventos = this.showOnlyDestacados
      ? this.eventos.filter(evento => evento.destacado)
      : [...this.eventos];
  }

  checkUserEmail() {
    const userEmail = this.auth.profile?.email;
    this.isEduUser = !!(userEmail && userEmail.endsWith('.edu.bo'));
    this.isAdminUser = this.auth.isAdmin$.getValue(); // Obtén el valor actual de `isAdmin`
  }
}
