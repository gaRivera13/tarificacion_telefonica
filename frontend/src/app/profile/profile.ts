export interface Profile { 
    id: number,
    nombre: string,
    s_nombre: string,
    apellido_p: string,
    apellido_m: string,
    correo: string,
    id_facultad: number | null,
    id_unidad: number | null,
    username: string,
    password: string,
    rol: string,
    unidad_detalle?: Departamento,   
    facultad_detalle?: Facultad,   
}

export interface ProveedorTelefono {
  id_proveedor: number;
  siglas_proveedor: string;
  nombre_proveedor: string;
  costo_seg_cel: number;
  costo_seg_sim: number;
  costo_seg_idi: number;
}

export interface Facultad {
  id_facultad: number;
  nombre_facultad: string;
  siglas_facultad: string;
  id_proveedor: number;          
  proveedor_detalle: ProveedorTelefono;  
}

export interface Departamento {
  id_unidad: number;
  nombre_depto: string;
  siglas_depto: string;
  id_facultad: number;              
  facultad_detalle: Facultad;      
}