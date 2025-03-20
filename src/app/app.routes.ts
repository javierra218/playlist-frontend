import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PlaylistListComponent } from './components/playlist-list/playlist-list.component';
import { AuthGuard } from './guards/auth.guard';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'playlists',
    component: PlaylistListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'playlists/:nombre',
    component: PlaylistDetailComponent,
    canActivate: [AuthGuard],
  },
];
