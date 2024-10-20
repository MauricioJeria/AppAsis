import { IonicModule } from '@ionic/angular';
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


  constructor(private router: Router){ }

  ngOnInit(): void {
    const usuarioCompletoSub = this.authService.usuarioCompleto$.subscribe(usuarioCompleto => {
      this.usuarioCompleto = usuarioCompleto;
      this.usuario = usuarioCompleto ? usuarioCompleto.usuario : '';
    });
    this.suscripcion.add(usuarioCompletoSub);
  }

  cerrarSesion(): void {
    this.authService.salirsesion();
    this.router.navigate(['/iniciosesion']);
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
  }

}


