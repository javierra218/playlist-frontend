import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Playlist } from '../../models/playlist';
import { PlaylistService } from '../../services/playlist.service';



@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ConfirmDialogModule,
  ],
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class PlaylistListComponent implements OnInit {
  playlists: Playlist[] = [];
  displayDialog = false;
  playlistForm!: FormGroup;

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadPlaylists();
    this.initForm();
  }

  private initForm(): void {
    this.playlistForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      canciones: this.fb.array([]),
    });
  }

  get canciones(): FormArray {
    return this.playlistForm.get('canciones') as FormArray;
  }

  addSong(): void {
    const songGroup = this.fb.group({
      titulo: ['', Validators.required],
      artista: ['', Validators.required],
      album: ['', Validators.required],
      anno: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      genero: ['', Validators.required],
    });
    this.canciones.push(songGroup);
  }

  removeSong(index: number): void {
    this.canciones.removeAt(index);
  }

  openCreateDialog(): void {
    this.displayDialog = true;
    this.playlistForm.reset();
    this.canciones.clear();
  }

  createPlaylist(): void {
    if (this.playlistForm.invalid) return;

    const newPlaylist: Playlist = {
      nombre: this.playlistForm.value.nombre,
      descripcion: this.playlistForm.value.descripcion,
      canciones: this.playlistForm.value.canciones,
    };

    this.playlistService.createPlaylist(newPlaylist).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Lista creada correctamente',
        });
        this.displayDialog = false;
        this.loadPlaylists();
      },
      error: (err) => {
        console.error('Error al crear la lista', err);
        const errorMessage = err.error?.message || 'Error al crear la lista';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
      },
    });
  }

  private loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => (this.playlists = playlists),
      error: (err) => {
        console.error('Error al cargar listas', err);
        const errorMessage = err.error?.message || 'Error al cargar listas';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
      },
    });
  }

  deletePlaylist(nombre: string): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la lista "${nombre}"?`,
      header: 'Confirmar eliminación',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.playlistService.deletePlaylist(nombre).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Lista eliminada',
            });
            this.loadPlaylists();
          },
          error: (err) => {
            console.error('Error al eliminar', err);
            const errorMessage =
              err.error?.message || 'Error al eliminar lista';
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMessage,
            });
          },
        });
      },
    });
  }

  viewPlaylistDetails(nombre: string): void {
    const encodedNombre = encodeURIComponent(nombre);
    this.router.navigate(['/playlists', encodedNombre]);
  }
}
