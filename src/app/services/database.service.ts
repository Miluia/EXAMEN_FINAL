import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Asegúrate de que DatabaseService se provee en la raíz
})
export class DatabaseService {
  constructor(private http: HttpClient) {} // Inyección correcta de HttpClient

  fetchLocalCollection(collection: string): Observable<any> {
    return this.http.get('db/' + collection + '.json');
  }
}
