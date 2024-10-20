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
import { firstValueFrom } from 'rxjs';



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

  irARecuperar() {
    this.router.navigate(['/recuperacion']);
  }


  async iniciarSe(usuario: string, clave: string) {

    if (!usuario || !clave) {
      await this.alert('Error', 'Por favor ingresa tu usuario y clave.');
      return;
  }
    this.isLoading = true;
    this.isLoggingOut = false;

    try {

      const inicioExitoso = await this.authService.apiData(usuario, clave);

      if(inicioExitoso) {
        const usuarioCompleto = await firstValueFrom(this.authService.usuarioCompleto$);

        this.usuario = '';
        this.clave ='';

        if(usuarioCompleto) {
          const ruta = usuarioCompleto.rol === 'docente'
          ? '/paginaprofesor'
          : '/paginaestudiante';
          await this.router.navigate([ruta]);
        }
        }else {
          await this.alert('Error', 'Usuario o clave incorrectos.');
        }
      }catch (error){
        console.error('Error al iniciar sesión:', error);
        await this.alert('Error', 'Hubo un problema al iniciar sesión.');
      }finally {
        this.isLoading = false;
        this.isLoggingOut = false;
        }
      }


  async alert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }
}

