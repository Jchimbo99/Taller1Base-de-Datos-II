import { Component } from '@angular/core';
import { InicioComponent } from "../../componentes/inicio/inicio.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InicioComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
