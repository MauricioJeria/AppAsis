import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/compartidos/header/header.component';
import { FooterComponent } from 'src/app/compartidos/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-iniciosesion',
  templateUrl: './iniciosesion.component.html',
  styleUrls: ['./iniciosesion.component.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent,FooterComponent,
    FormsModule, CommonModule, RouterModule]
})
export class IniciosesionComponent {
  usuario: string = '';
  clave: string = '';
  isLoading: boolean = false;
  isLoggingOut: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  irARegistrar () {
    this.router.navigate(['/registrar']);
  }


  async iniciarSe(usuario: string, clave: string) {
    this.isLoading = true;
    this.isLoggingOut = false;

    try {

      await this.authService.apiData(usuario, clave);
      this.isLoading = false;


      this.authService.isAuthenticated$.pipe(
        switchMap(isAuthenticated => {
          if (isAuthenticated) {
            return this.authService.usuarioCompleto$;
          } else {
            throw new Error('Credenciales incorrectas');
          }
        })
      ).subscribe({
        next: (usuarioCompleto) => {
          this.usuario = '';
          this.clave = '';

          if (usuarioCompleto) {

            if (usuarioCompleto.rol === 'docente') {
              this.router.navigate(['/paginaprofesor']);
            } else {
              this.router.navigate(['/paginaestudiante']);
            }
          }
        },
        error: async (error) => {
          console.error('Error de autenticación:', error);
          await this.alerta('Error', error.message);
        }
      });

    } catch (error) {
      this.isLoading = false;
      console.error('Error al iniciar sesión:', error);
      await this.alerta('Error', 'Hubo un problema al iniciar sesión.');
    }
  }



  async alerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
