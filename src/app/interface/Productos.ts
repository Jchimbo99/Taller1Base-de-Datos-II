interface Producto {
  producto_id?: number;          
  codigo: string;                
  descripcion: string;          
  precio: number;                
  iva_incluido: boolean;         
  cantidad?: number;             
  cantidad_disponible?: number;  
}
