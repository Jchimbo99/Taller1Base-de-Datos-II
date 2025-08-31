import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface ProductoInventario {
  producto_id?: number;
  codigo: string;
  descripcion: string;
  precio: number;
  iva_incluido: boolean;
  cantidad_disponible: number;
  cantidad_pedir?: number; 
}

interface DetallePedido {
  producto_id: number;
  descripcion: string;
  cantidad: number;
  precio_unit: number;
  sub_total: number;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './inventario.component.html'
})
export class InventarioComponent implements OnInit {
  inventario: ProductoInventario[] = [];
  detallePedido: DetallePedido[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario() {
    this.http.get<ProductoInventario[]>('http://localhost:3000/inventario')
      .subscribe({
        next: res => this.inventario = res,
        error: err => console.error('Error al cargar inventario', err)
      });
  }

  agregarAlPedido(p: ProductoInventario) {
    if (!p.cantidad_pedir || p.cantidad_pedir <= 0) {
      alert('Debes ingresar una cantidad válida');
      return;
    }
    if (p.cantidad_pedir > p.cantidad_disponible) {
      alert('Stock insuficiente');
      return;
    }

    const precioFinal = p.iva_incluido ? p.precio : p.precio * 1.12;

    const detalle: DetallePedido = {
      producto_id: p.producto_id!,
      descripcion: p.descripcion,
      cantidad: p.cantidad_pedir,
      precio_unit: precioFinal,
      sub_total: p.cantidad_pedir * precioFinal
    };

    this.detallePedido.push(detalle);

  
    p.cantidad_disponible -= p.cantidad_pedir;
    p.cantidad_pedir = 0;
  }

  calcularTotal(): number {
    return this.detallePedido.reduce((acc, d) => acc + d.sub_total, 0);
  }

  confirmarPedido() {
    if (this.detallePedido.length === 0) {
      alert('No hay productos en el pedido');
      return;
    }

    const pedido = {
      cliente_id: 1, 
      usuario: 'admin',
      items: this.detallePedido
    };

    this.http.post('http://localhost:3000/pedidos', pedido).subscribe({
      next: res => {
        alert('Pedido registrado con éxito');
        this.detallePedido = [];
        this.cargarInventario();
      },
      error: err => {
        console.error('Error al registrar pedido', err);
        alert('Error al registrar pedido');
      }
    });
  }
}
