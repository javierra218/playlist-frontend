import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Inicio de sesión exitoso',
        });

        setTimeout(() => {
          this.router.navigate(['/playlists']);
        }, 2000); //2s
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciales incorrectas',
        });
        console.error('Error al autenticar', err);
      },
    });
  }

  isFormValid(): boolean {
    return this.username.trim() !== '' && this.password.trim() !== '';
  }
}
