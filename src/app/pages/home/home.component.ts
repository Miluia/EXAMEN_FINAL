import { Component, importProvidersFrom, OnDestroy } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { MessageComponent } from '../../components/message/message.component';
import { BtnComponent } from '../../components/btn/btn.component';
/////// paso 1 importar servicio
import { AuthService } from '../../services/auth.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatabaseService } from '../../services/database.service';
import { CoreModule } from '../../core.module';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [// HttpClientModule debe estar aquí
    RouterLink,
    NgFor,
    CardComponent,
    MessageComponent,
    BtnComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {
  title: any;
  noticias: any;
  pelis: any;
  constructor(
    public http: HttpClient,
    public db: DatabaseService,
    public auth: AuthService /////// paso 2 importar servicio
  ) {
    this.title = 'Welcome home ';

    this.fetchMovies();
    this.fetchTestCollection();
    this.db.fetchLocalCollection('movie')
      .subscribe(
        (res: any) => { console.log('success', res) },
        (error: any) => { console.log('error', error) },
      )
  }

  fetchTestCollection() {
    this.db.fetchFirestoreCollection('test').subscribe(
      (data) => {
        console.log('Data de la colección test:', data);
        //this.testData = data;
      },
      (error) => {
        console.log('Error al obtener la colección test:', error);
      }
    );
  }
  fetchMovies() {
    this.http.get('db/movie.json')
      .subscribe(
        (res: any) => {
          console.log('leyendo datos de movie.json', res);
          this.pelis = res;
        },
        (error: any) => {
          console.log('error', error)
        });
  }

  ngOnDestroy(): void {
    console.log('destroy home')
  }
}
