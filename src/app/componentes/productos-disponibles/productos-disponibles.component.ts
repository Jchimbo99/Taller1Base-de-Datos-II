import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
  producto_id?: number;
  codigo: string;
  descripcion: string;
  precio: number;
  iva_incluido: boolean;
  cantidad?: number;
  cantidad_disponible?: number;
}

@Component({
  selector: 'app-productos-disponibles',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './productos-disponibles.component.html',
  styleUrls: ['./productos-disponibles.component.css']
})
export class ProductosDisponiblesComponent implements OnInit {
  productos: Producto[] = [];
  editando: boolean = false;
  productoEditando?: Producto;
  iva = 0.15;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

cargarProductos() {
  this.http.get<Producto[]>('http://localhost:3000/inventario')
    .subscribe({
      next: res => this.productos = res.map(p => ({ ...p, cantidad: p.cantidad_disponible ?? 0 })),
      error: err => console.error('Error al cargar productos:', err)
    });
}

  precioConIva(producto: Producto) {
    return producto.iva_incluido ? producto.precio : producto.precio * (1 + this.iva);
  }

  editarProducto(p: Producto) {
    this.productoEditando = { ...p };
    this.editando = true;
  }

  guardarEdicion() {
    if (!this.productoEditando || !this.productoEditando.producto_id) return;
    this.http.put(`http://localhost:3000/productos/${this.productoEditando.producto_id}`, this.productoEditando)
      .subscribe({
        next: () => {
          this.cargarProductos();
          this.editando = false;
          this.productoEditando = undefined;
        },
        error: err => console.error('Error al actualizar producto', err)
      });
  }

  cancelarEdicion() {
    this.editando = false;
    this.productoEditando = undefined;
  }

 eliminarProducto(id?: number) {
  if (!id) return;
  this.http.delete(`http://localhost:3000/productos/${id}`)
    .subscribe({
      next: () => this.cargarProductos(), 
      error: err => console.error('Error al eliminar producto', err)
    });
}
}