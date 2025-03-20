import { environment } from '../../environments/environment';

export function backend(path: string): string {
  return `${environment.apiUrl}${path}`;
}
