import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { UserApi } from 'src/app/modelos/userapi.module';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class HeaderComponent implements OnInit, OnDestroy   {

  usuario: string;
  color: string;
  usuarioCompleto: UserApi | null;


  private authService = inject(AuthService);
  private suscripcion: Subscription = new Subscription();


  constructor(private router: Router,
    private alertController: AlertController
  ){ }

  ngOnInit(): void {
    const usuarioCompletoSub = this.authService.usuarioCompleto$.subscribe(usuarioCompleto => {
      this.usuarioCompleto = usuarioCompleto;
      this.usuario = usuarioCompleto ? usuarioCompleto.usuario : '';
    });
    this.suscripcion.add(usuarioCompletoSub);
  }

  //cerrarSesion(): void {
    //this.authService.salirsesion();
    //this.alertaCierreSesion('Cierre de Sesión', 'Has salido de la Aplicación');
    //this.router.navigate(['/iniciosesion']);
  //}

  //cierre sesion mas fixa
  async cerrarSesion(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Estás seguro de querer cerrar sesion?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

    }
  },
  {
    text: 'Cerrar Sesión',
    handler: () => {
      this.authService.salirsesion();
      this.router.navigate(['/iniciosesion']);
      this.alertaCierreSesion('Cierre de Sesión', 'Has salido de la Aplicación');
    }
  }
]
});
await alert.present();
}

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
  }


  async alertaCierreSesion(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']

    });
    await alert.present();
  }
}


