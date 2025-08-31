import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  nuevoCliente = { nombre: '', email: '' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.http.get<any[]>('http://localhost:3000/clientes')
      .subscribe({
        next: data => this.clientes = data,
        error: err => console.error('Error al cargar clientes:', err)
      });
  }

  agregarCliente() {
    if (!this.nuevoCliente.nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    this.http.post<any>('http://localhost:3000/clientes', this.nuevoCliente)
      .subscribe({
        next: (res) => {
          console.log('Cliente agregado:', res);
          this.clientes.push(res); 
          this.nuevoCliente = { nombre: '', email: '' }; 
        },
        error: err => {
          console.error('Error al agregar cliente:', err);
          alert('Ocurrió un error al agregar el cliente');
        }
      });
  }
}
