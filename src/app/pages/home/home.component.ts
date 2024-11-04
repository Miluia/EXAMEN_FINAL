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

    //lee de forma local peliculas desde un json
    this.fetchMovies();

    //lee la colección figuras desdes firestore
    this.db.fetchFirestoreCollection('figuras')
      .subscribe(
        (res: any) => { console.log('figuras desde firebase', res) },
        (error: any) => { }
      )
    // crea un nuevo documento en la coleccion figuras
    /* this.db.addFirestoreDocument(
      'comics', {
      name: 'Harley Queen',
      photo: 'No tiene',
      age: 28,
      size: 170
    }) */
    //actualiza un documento en la colección figuras
    this.db.addFirestoreDocument('comics', {
      name: 'Harley Queen',
      photo: 'No tiene',
      age: 28,
      size: 170
    }).then(docRef => {
      console.log('Documento agregado con ID:', docRef.id);  // Aquí tienes el ID del documento nuevo
    }).catch(error => {
      console.error('Error al agregar documento:', error);
    });

   /*  this.db.deleteFirestoreDocument(
      'figuras',
      'UH2dbloE7r5pcLrmrw69'
    ).then(
      (res: any) => { console.log('figuras desde firebase', res) },
      (error: any) => { }
    ) */

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
