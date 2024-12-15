import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { RegisterComponent } from './pages/register/register.component';
import { FeedComponent } from './pages/feed/feed.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ViewProfileComponent } from './pages/view-profile/view-profile.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { AdminEventComponent } from './pages/admin-event/admin-event.component'; // Asegúrate de importar tu componente

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'view-profile/:id', component: ViewProfileComponent },
  { path: 'event-detail/:id', component: EventDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'admin-event', component: AdminEventComponent }
];
