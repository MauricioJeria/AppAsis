import { IonicModule } from '@ionic/angular';
import { Component, OnInit} from '@angular/core';
import { HeaderComponent } from 'src/app/compartidos/header/header.component';
import { FooterComponent } from 'src/app/compartidos/footer/footer.component';
import * as QRCode from 'qrcode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qrgenerate',
  templateUrl: './qrgenerate.component.html',
  styleUrls: ['./qrgenerate.component.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent, FooterComponent, CommonModule]
})
export class QrgenerateComponent implements OnInit {
  imagensrc: string = 'URL_QR_CODE_IMAGE_HERE';
  fechaAct: string = '';
  horaAct: string = '';

  constructor() { }

  ngOnInit(){
    this.actualiFechaHora();
    setInterval(() => {
      this.actualiFechaHora();
    }, 1000);
  }

  actualiFechaHora(){
    const hoy = new Date();
    this.fechaAct = hoy.toLocaleDateString();
    this.horaAct = hoy.toLocaleTimeString();
  }

  rerollimage(){
    const idrandom = Math.random().toString(36).substring(2,15);
    const data = `registro-${idrandom}`;
    QRCode.toDataURL(data), (err: Error | null, url: string) => {
      if(err) {
        return;
  }
  this.imagensrc = url;
  }
  }
}
