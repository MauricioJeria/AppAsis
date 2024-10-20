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
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      console.log('ACCESO CONSEDIDO', stream);
      this.setupDevices();
    }catch (err){
      console.error('ERROR AL ACCEDER A LA CÁMARA', err);
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
      }
    } catch (err) {
      console.error('Error al enumerar dispositivos:', err);
    }
  }

  escanear(resultado: string){
    this.resultado = resultado;
    this.aqui();
    this.router.navigate(['/paginaestudiante']  );
  }

  async aqui(){
    const alerta = await this.alertController.create({
      header: 'alerta',
      message: 'Alumno presente',
      buttons: ['OK']
    });
    await alerta.present();
    }

    controlescaneo(){
      this.mostrarScaner = !this.mostrarScaner;
    }


  volver(){
    this.router.navigate(['/paginaestudiante']  );
  }

}
