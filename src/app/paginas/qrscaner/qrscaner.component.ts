import { IonicModule, AlertController } from '@ionic/angular';
import { Component,  } from '@angular/core';
import { HeaderComponent } from 'src/app/compartidos/header/header.component';
import { FooterComponent } from 'src/app/compartidos/footer/footer.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-qrscaner',
  templateUrl: './qrscaner.component.html',
  styleUrls: ['./qrscaner.component.scss'],
  standalone: true,
  imports: [IonicModule,HeaderComponent,FooterComponent, CommonModule]
})
export class QrscanerComponent  {
  constructor(private alertController: AlertController) { }


  async aqui(){
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Alumno Presente',
      buttons: ['OK']
    });
    await alert.present();
  }



}
