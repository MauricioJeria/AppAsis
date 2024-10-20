import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from 'src/app/compartidos/footer/footer.component';
import { HeaderComponent } from 'src/app/compartidos/header/header.component';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent,FooterComponent],
})
export class NotFoundComponent   {



}
