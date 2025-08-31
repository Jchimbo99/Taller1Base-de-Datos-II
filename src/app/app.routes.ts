import { Routes } from '@angular/router';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { ProductosComponent } from './componentes/productos/productos.component';
import { ComprasComponent } from './componentes/compras/compras.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductosDisponiblesComponent } from './componentes/productos-disponibles/productos-disponibles.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'productos', component: ProductosComponent },
   { path: 'comprar', component: ComprasComponent },
   { path: 'productos-disponibles', component: ProductosDisponiblesComponent },

  { path: '', redirectTo: '/clientes', pathMatch: 'full' }
];
