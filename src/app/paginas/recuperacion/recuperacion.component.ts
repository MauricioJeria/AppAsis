import { IonicModule } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from 'src/app/compartidos/header/header.component';
import { FooterComponent } from 'src/app/compartidos/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ApiService } from '../../service/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.component.html',
  styleUrls: ['./recuperacion.component.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, FooterComponent,
    FormsModule, CommonModule, RouterModule]
})
export class RecuperacionComponent implements OnInit, OnDestroy {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPasswordFields: boolean = false;
  mensaje: string = '';
  private routerSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.limpiarDatos();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.limpiarDatos();
  }

  limpiarDatos() {
    this.email = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showPasswordFields = false;
    this.mensaje = '';
  }

  async recuperarContrasena() {
    if (!this.showPasswordFields) {
      await this.verificarEmail();
    } else {
      await this.cambiarContrasena();
    }
  }

  private async verificarEmail() {
    try {
      const url = 'https://6711db204eca2acdb5f5f551.mockapi.io';
      const usuarios = await this.apiService.request('GET', url, 'usuarios');
      const usuario = usuarios.find((u: any) => u.email === this.email);
      if (usuario) {
        this.showPasswordFields = true;
        this.mensaje = 'Por favor, ingrese su nueva contraseña.';
      } else {
        this.mensaje = 'No se encontró ningún usuario con ese correo electrónico.';
      }
    } catch (error) {

      this.mensaje = 'Hubo un error al procesar su solicitud. Por favor, inténtelo más tarde.';
    }
  }

  private async cambiarContrasena() {
    if (!this.newPassword || !this.confirmPassword) {
      this.mensaje = 'Por favor, ingrese y confirme su nueva contraseña.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.mensaje = 'Las contraseñas no coinciden. Por favor, inténtelo de nuevo.';
      return;
    }

    if (this.newPassword.length < 1) {
      this.mensaje = 'La contraseña debe tener al menos 1 caracter.';
      return;
    }

    try {
      const url = 'https://6711db204eca2acdb5f5f551.mockapi.io';
      const usuarios = await this.apiService.request('GET', url, 'usuarios');
      const usuario = usuarios.find((u: any) => u.email === this.email);
      if (usuario) {
        usuario.clave = this.newPassword;
        await this.apiService.request('PUT', url, `usuarios/${usuario.id}`, usuario);
        this.mensaje = 'Contraseña cambiada con éxito. Por favor, inicie sesión con su nueva contraseña.';
        setTimeout(() => {
          this.router.navigate(['/iniciosesion']);
        }, 2000);
      }
    } catch (error) {

      this.mensaje = 'Hubo un error al cambiar la contraseña. Por favor, inténtelo más tarde.';
    }
  }
}
