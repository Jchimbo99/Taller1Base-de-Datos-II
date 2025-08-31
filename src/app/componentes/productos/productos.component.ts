import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

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
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  nuevoProducto: Producto = { codigo: '', descripcion: '', precio: 0, cantidad: 0, iva_incluido: false };
  editando: boolean = false;
  productoEditandoId?: number;
  iva = 0.15; // 15% IVA

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

  agregarProducto() {
    if (this.editando && this.productoEditandoId) {
      this.http.put<Producto>(`http://localhost:3000/productos/${this.productoEditandoId}`, this.nuevoProducto)
        .subscribe({
          next: (res) => {
            const index = this.productos.findIndex(p => p.producto_id === this.productoEditandoId);
            if (index !== -1) this.productos[index] = { ...res, cantidad: res.cantidad_disponible ?? 0 };
            this.cancelarEdicion();
          },
          error: (err) => console.error('Error al actualizar producto:', err)
        });
    } else {
      this.http.post<Producto>('http://localhost:3000/productos', this.nuevoProducto)
        .subscribe({
          next: (res) => {
            this.productos.push({ ...res, cantidad: res.cantidad_disponible ?? 0 });
            this.resetForm();
          },
          error: (err) => console.error('Error al agregar producto:', err)
        });
    }
  }

  editarProducto(p: Producto) {
    this.nuevoProducto = { ...p, cantidad: p.cantidad_disponible ?? 0 };
    this.editando = true;
    this.productoEditandoId = p.producto_id;
  }

  eliminarProducto(id?: number) {
    if (!id) return;
    this.http.delete(`http://localhost:3000/productos/${id}`)
      .subscribe({
        next: () => this.productos = this.productos.filter(p => p.producto_id !== id),
        error: (err) => console.error('Error al eliminar producto:', err)
      });
  }

  cancelarEdicion() {
    this.resetForm();
    this.editando = false;
    this.productoEditandoId = undefined;
  }

  private resetForm() {
    this.nuevoProducto = { codigo: '', descripcion: '', precio: 0, cantidad: 0, iva_incluido: false };
  }

  precioConIva(producto: Producto) {
    return producto.iva_incluido ? producto.precio : producto.precio * (1 + this.iva);
  }
}
