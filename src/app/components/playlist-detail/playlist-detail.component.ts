import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { Playlist } from '../../models/playlist';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css'],
  providers: [MessageService],
})
export class PlaylistDetailComponent implements OnInit {
  playlist: Playlist | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const nombre = this.route.snapshot.paramMap.get('nombre');
    if (nombre) {
      this.loadPlaylist(nombre);
    }
  }

  private loadPlaylist(nombre: string): void {
    this.loading = true;
    const decodedNombre = decodeURIComponent(nombre);
    this.playlistService.getPlaylistByName(decodedNombre).subscribe({
      next: (playlist) => {
        this.playlist = playlist;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar la lista', err);
        const errorMessage = err.error?.message || 'Error al cargar la lista';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
        this.loading = false;
      },
    });
  }
}
