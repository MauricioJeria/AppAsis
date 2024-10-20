import { IonicModule, AlertController } from '@ionic/angular';
import { Component, OnInit  } from '@angular/core';
import { HeaderComponent } from 'src/app/compartidos/header/header.component';
import { FooterComponent } from 'src/app/compartidos/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { RouterModule } from '@angular/router';


declare const navigator: any;

@Component({
  selector: 'app-qrscaner',
  templateUrl: './qrscaner.component.html',
  styleUrls: ['./qrscaner.component.scss'],
  standalone: true,
  imports: [IonicModule,HeaderComponent,FooterComponent,
    CommonModule, ZXingScannerModule, RouterModule]
})
export class QrscanerComponent implements OnInit {
  resultado: string | null = null;
  mostrarScaner: boolean = false;
  currentDevice: MediaDeviceInfo | null = null;

  constructor(private alertController: AlertController, private router: Router) { }

  async ngOnInit() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Acceso concedido', stream);
      this.setupDevices();
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error al acceder a la cámara:', err);

        if (err.name === 'NotAllowedError') {
          await this.alertaPermisoCamara('Permiso denegado', 'Otorga el permiso de la cámara para poder escanear.');
        } else if (err.name === 'NotFoundError') {
          await this.alertaPermisoCamara('Cámara no encontrada', 'No se a detectado la ninguna camara.');
        } else {
          await this.alertaPermisoCamara('Error', 'Ocurrió un problema al intentar acceder a la cámara.');
        }
      } else {
        console.error('Error desconocido:', err);
        await this.alertaPermisoCamara('Error desconocido', 'Ocurrió un problema inesperado.');
      }
    }
  }

  async setupDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device: MediaDeviceInfo) => device.kind === 'videoinput');

      if (videoDevices.length > 0) {
        this.currentDevice = videoDevices[0];
        console.log('Cámara seleccionada:', this.currentDevice);
      } else {
        console.error('No se encontraron cámaras.');
        await this.alertaPermisoCamara('Error', 'No se encontraron cámaras en el dispositivo.');
      }
    } catch (err) {
      console.error('Error al enumerar dispositivos:', err);
      await this.alertaPermisoCamara('Error', 'Ocurrió un problema al detectar las cámaras.');
    }
  }

  escanear(resultado: string) {
    if (resultado) {
      this.resultado = resultado;
      this.aqui();
      this.router.navigate(['/paginaestudiante']);
    } else {
      console.error('No se pudo obtener el resultado del escaneo.');
      this.alertaPermisoCamara('Error', 'No se obtuvo ningún resultado del escaneo.');
    }
  }

  async aqui() {
    const alerta = await this.alertController.create({
      header: 'Alerta',
      message: 'Alumno presente',
      buttons: ['OK']
    });
    await alerta.present();
  }

  async alertaPermisoCamara(header: string, message: string) {
    const alerta = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alerta.present();
  }

  controlescaneo() {
    this.mostrarScaner = !this.mostrarScaner;
  }

  volver() {
    this.router.navigate(['/paginaestudiante']);
  }
}
