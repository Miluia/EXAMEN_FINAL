import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartService } from './services/cart.service';
import { CartComponent } from './pages/cart/cart.component';

@NgModule({
  imports: [
    HttpClientModule,
    FormsModule
  ],
  providers: [
    CartService,
  ],
})
export class CoreModule {
  constructor() {
    console.log('CoreModule cargado.');
  }
}