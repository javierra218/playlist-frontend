import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { backend } from '../constants/api-url';
import { Playlist } from '../models/playlist';


@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener todas las listas de reproducción
  getPlaylists(): Observable<Playlist[]> {
    const headers = this.getHeaders();
    return this.http.get<Playlist[]>(backend('/lists'), { headers });
  }

  // Obtener una lista por nombre
  getPlaylistByName(name: string): Observable<Playlist> {
    const headers = this.getHeaders();
    const encodedName = encodeURIComponent(name);
    return this.http.get<Playlist>(backend(`/lists/${encodedName}`), {
      headers,
    });
  }

  // Crear una nueva lista de reproducción
  createPlaylist(playlist: Playlist): Observable<Playlist> {
    const headers = this.getHeaders();
    return this.http.post<Playlist>(backend('/lists'), playlist, { headers });
  }

  // Eliminar una lista de reproducción
  deletePlaylist(name: string): Observable<void> {
    const headers = this.getHeaders();
    const encodedName = encodeURIComponent(name);
    return this.http.delete<void>(backend(`/lists/${encodedName}`), {
      headers,
    });
  }
}
