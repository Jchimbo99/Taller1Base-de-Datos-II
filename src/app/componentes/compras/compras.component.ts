import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface Producto {
  producto_id: number;
  codigo: string;
  descripcion: string;
  precio: number;
  iva_incluido: boolean;
  cantidad_disponible: number;
  cantidad_pedir?: number; 
}

interface Cliente {
  cliente_id: number;
  nombre: string;
  email: string;
}

interface ItemPedido {
  producto_id: number;
  descripcion: string;
  cantidad: number;
  precio_unit: number;
  sub_total: number;
}

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  clientes: Cliente[] = [];
  clienteSeleccionado?: Cliente;

  productos: Producto[] = [];
  carrito: ItemPedido[] = [];

  iva = 0.15; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarProductos();
  }

  cargarClientes() {
    this.http.get<Cliente[]>('http://localhost:3000/clientes')
      .subscribe({
        next: res => this.clientes = res,
        error: err => console.error('Error al cargar clientes', err)
      });
  }

  cargarProductos() {
    this.http.get<Producto[]>('http://localhost:3000/inventario')
      .subscribe({
        next: res => this.productos = res,
        error: err => console.error('Error al cargar productos', err)
      });
  }

  agregarAlCarrito(producto: Producto) {
    if (!producto.cantidad_pedir || producto.cantidad_pedir < 1) {
      alert('Ingrese una cantidad válida');
      return;
    }
    if (producto.cantidad_pedir > producto.cantidad_disponible) {
      alert('Stock insuficiente');
      return;
    }

    const precioFinal = producto.iva_incluido ? producto.precio : producto.precio * (1 + this.iva);
    const subTotal = precioFinal * producto.cantidad_pedir;

  
    const itemExistente = this.carrito.find(i => i.producto_id === producto.producto_id);
    if (itemExistente) {
      itemExistente.cantidad += producto.cantidad_pedir;
      itemExistente.sub_total += subTotal;
    } else {
      this.carrito.push({
        producto_id: producto.producto_id,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad_pedir,
        precio_unit: precioFinal,
        sub_total: subTotal
      });
    }

    
    producto.cantidad_disponible -= producto.cantidad_pedir;
    producto.cantidad_pedir = 0; 
  }

  quitarDelCarrito(item: ItemPedido) {
    
    const producto = this.productos.find(p => p.producto_id === item.producto_id);
    if (producto) producto.cantidad_disponible += item.cantidad;

    this.carrito = this.carrito.filter(i => i.producto_id !== item.producto_id);
  }

  calcularSubtotal(item: ItemPedido) {
    return item.sub_total;
  }

  calcularTotal() {
    return this.carrito.reduce((sum, item) => sum + item.sub_total, 0);
  }

  calcularTotalIva() {
    return this.carrito.reduce((sum, item) => {
      const ivaUnit = item.precio_unit * this.iva / (item.precio_unit / (1 + this.iva) + 0.00001);
      return sum + ivaUnit * item.cantidad;
    }, 0);
  }

  validarCantidad(item: ItemPedido) {
    const producto = this.productos.find(p => p.producto_id === item.producto_id);
    if (producto && item.cantidad > producto.cantidad_disponible) {
      item.cantidad = producto.cantidad_disponible;
      alert('Se ajustó la cantidad al stock disponible.');
    } else if (item.cantidad < 1) {
      item.cantidad = 1;
    }
  }

  confirmarPedido() {
    if (!this.clienteSeleccionado) {
      alert('Debe seleccionar un cliente');
      return;
    }
    if (this.carrito.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }

    const pedido = {
      cliente_id: this.clienteSeleccionado.cliente_id,
      usuario: 'admin', 
      items: this.carrito.map(i => ({
        producto_id: i.producto_id,
        cantidad: i.cantidad,
        precio_unit: i.precio_unit
      }))
    };

    this.http.post('http://localhost:3000/pedidos', pedido).subscribe({
      next: res => {
        alert('Pedido registrado con éxito');
        this.carrito = [];
        this.cargarProductos(); 
      },
      error: err => {
        console.error('Error al registrar pedido', err);
        alert('Error al registrar pedido: ' + (err.error?.detalle || err.message));
      }
    });
  }
}
