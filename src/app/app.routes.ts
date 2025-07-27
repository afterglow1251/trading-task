import { Routes } from '@angular/router';
import { Historical } from './pages/historical/historical';
import { RealTime } from './pages/real-time/real-time';

export const routes: Routes = [
  { path: 'historical', component: Historical },
  { path: 'realtime', component: RealTime },
] as const;
