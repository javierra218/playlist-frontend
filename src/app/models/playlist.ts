import { Song } from './song';

export interface Playlist {
  nombre: string;
  descripcion: string;
  canciones: Song[];
}
