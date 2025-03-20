import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PlaylistListComponent } from './components/playlist-list/playlist-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'playlists',
    component: PlaylistListComponent,
    canActivate: [AuthGuard],
  },
];
