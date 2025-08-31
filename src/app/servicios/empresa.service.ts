import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes`);
  }

  agregarCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, cliente);
  }

  actualizarCliente(cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clientes/${cliente.cliente_id}`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${id}`);
  }

 
  getProductos() { return this.http.get(`${this.apiUrl}/productos`); }
  agregarProducto(prod: any) { return this.http.post(`${this.apiUrl}/productos`, prod); }
  actualizarProducto(prod: any) { return this.http.put(`${this.apiUrl}/productos/${prod.producto_id}`, prod); }

 
  registrarPedido(pedido: any) { return this.http.post(`${this.apiUrl}/pedidos`, pedido); }

 
  actualizarStock(productoId: number, delta: number) {
    return this.http.put(`${this.apiUrl}/inventario/${productoId}`, { delta });
  }

  
  getVentasPorCliente(clienteId: number) { return this.http.get(`${this.apiUrl}/consultas/ventas/${clienteId}`); }
}
