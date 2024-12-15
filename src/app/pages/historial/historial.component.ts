import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; 
import { Firestore} from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})

export class HistorialComponent implements OnInit {
  @Input() data: any;
  compras: any[] = [];
  total: number = 0;

  constructor(
    private db: DatabaseService, 
    private auth: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    if (this.auth.verifyIsLogued()) {
      this.loadCompras();
    } else {
      console.error('Usuario no autenticado');
    }
  }

  loadCompras() {
    const userId = this.auth.getUserId();
    this.db.getDocumentsByField(`users/${userId}/compras`, 'userId', userId).subscribe(compras => {
      
      this.compras = compras.map(compra => {
        return {
          ...compra,
          fechaCompra: compra.fechaCompra instanceof Timestamp 
            ? compra.fechaCompra.toDate() 
            : (compra.fechaCompra ? new Date(compra.fechaCompra) : 'Fecha no disponible')
        };
      });
      console.log('Datos de compra cargados:', this.compras);
    });
  }

}