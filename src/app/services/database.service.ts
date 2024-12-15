import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { collectionData, Firestore, collection, addDoc, doc, updateDoc, deleteDoc, setDoc, query, where, DocumentData, getDoc, docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(
    private firestore: Firestore,
    private http: HttpClient) { }

  fetchLocalCollection(collection: string): Observable<any> {
    return this.http.get('db/' + collection + '.json');
  }

  // Obtener un documento por ID
  getDocumentById(collectionName: string, documentId: string): Observable<any> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    return docData(docRef, { idField: 'id' });
  }

  // Obtener documentos por campo
  getDocumentsByField(collectionNameOrPath: string, field: string, value: any): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionNameOrPath);
    const queryRef = query(collectionRef, where(field, '==', value));
    return collectionData(queryRef, { idField: 'id' }) as Observable<any[]>;
  }

  // Obtener colección de Firestore
  fetchFirestoreCollection(collectionName: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return collectionData(collectionRef, { idField: 'id' });
  }

  // Agregar documento a Firestore
  addFirestoreDocument(collectionName: string, data: any): Promise<any> {
    const collectionRef = collection(this.firestore, collectionName);
    return addDoc(collectionRef, data);
  }

  // Actualizar documento en Firestore
  updateFirestoreDocument(collectionName: string, uuid: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${uuid}`);
    return updateDoc(docRef, data);
  }

  // Eliminar documento de Firestore
  deleteFirestoreDocument(collectionName: string, uuid: string): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${uuid}`);
    return deleteDoc(docRef);
  }

  // Agregar ticket a usuario
  addTicketToUser (userId: string, ticket: any): Promise<any> {
    const collectionRef = collection(this.firestore, `users/${userId}/tickets`);
    return addDoc(collectionRef, ticket);
  }

  updateTicketQuantity(userId: any, ticketId: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, `users/${userId}/tickets/${ticketId}`);
    return updateDoc(docRef, data);
  }

  deleteTicketFromUser (userId: string, ticketId: string): Promise<void> {
    const docRef = doc(this.firestore, `users/${userId}/tickets/${ticketId}`);
    return deleteDoc(docRef);
  }
}