import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/compartidos/header/header.component';
import { FooterComponent } from 'src/app/compartidos/footer/footer.component';



@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,HeaderComponent,FooterComponent, FormsModule,CommonModule],


})
export class RegistrarComponent  {

  nombreComplet: string = '';
  rut: string = '';
  usuario: string = '';
  clave: string = '';
  rol: string = '';
  email: string = '';
  mensajeError: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private http: HttpClient
  ) { }
  async registrouser() {
    this.isLoading = true;


    try {

      const existe = await this.authService.revUserExistente(this.usuario);
      if (existe) {
        this.isLoading = false;
        await this.alerta('Error', 'Este nombre de usuario ya está en uso. Prueba con otro.  ');
      } else {

        await this.authService.registrouser(this.nombreComplet, this.rut, this.usuario,
           this.clave, this.rol, this.email);
        this.isLoading = false;

        await this.alerta('Muy bien', 'TE HAS REGISTRADO CON ÉXITO. Ahora puedes iniciar sesión.  ');

        this.router.navigate(['/iniciosesion']);
      }
    } catch (error) {
      this.isLoading = false;
      await this.alerta('ERROR', 'Ha ocurrido un error al registrar al usuario. Inténtalo más tarde.  ');
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




