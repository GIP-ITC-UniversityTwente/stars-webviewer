import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';

export const ROUTES: Routes = [
  { path: '', component: HeaderComponent },
  { path: '**', redirectTo: '' }
];
