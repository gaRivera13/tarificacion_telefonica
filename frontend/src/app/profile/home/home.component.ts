import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Profile } from '../profile';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProfileService } from '../profile.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DepartamentoService,Facultad,Departamento,} from '../../servicios/departamento.service';
import { MenuComponent } from "../../compartido/menu/menu.component";

@Component({
  selector: 'app-home', // Asegúrate de que este selector se use en perfil.component.html
  standalone: true,     // Verifica si es standalone o no
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MenuComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'id',
    'nombre',
    'nombreSeg',
    'apellidop',
    'apellidom',
    'email',
    'unidad',
    'facultad',
    'edit',
    'delete',
  ];
  dataSource = new MatTableDataSource<Profile>();
  filteredProfiles: Profile[] = [];

  profiles: Profile[] = [];
  mostrarModalAgregarUsuario = false;

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(
    private profileService: ProfileService,
    private deptoService: DepartamentoService
  ) {}

  profile: Profile = {
    id: 0,
    nombre: '',
    s_nombre: '',
    apellido_p: '',
    apellido_m: '',
    correo: '',
    id_facultad: null,
    id_unidad: null,
    username: '',
    password: '',
    rol: '',
  };

  // Variables para el modal de agregar usuario
  nuevoNombre: string = '';
  nuevoSNombre: string = '';
  nuevoApellidoP: string = '';
  nuevoApellidoM: string = '';
  nuevoCorreo: string = '';
  nuevaFacultadId: number | null = null;
  nuevaUnidadId: number | null = null;
  nuevoUsername: string = '';
  nuevoPassword: string = '';
  nuevoRol: string = '';

  facultades: any[] = []; // Asegúrate de cargar las facultades si las necesitas en un select
  unidades: any[] = [];    // Asegúrate de cargar las unidades si las necesitas en un select


  ngOnInit(): void {
    this.cargarPerfiles();
    this.cargarDepartamentos();
    this.cargarFacultades();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  abrirModalAgregarUsuario() {
    this.mostrarModalAgregarUsuario = true;
    this.resetFormulario();
  }

  cerrarModalAgregarUsuario() {
    this.mostrarModalAgregarUsuario = false;
  }

  resetFormulario() {
    this.nuevoNombre = '';
    this.nuevoSNombre = '';
    this.nuevoApellidoP = '';
    this.nuevoApellidoM = '';
    this.nuevoCorreo = '';
    this.nuevaFacultadId = null;
    this.nuevaUnidadId = null;
    this.nuevoUsername = '';
    this.nuevoPassword = '';
    this.nuevoRol = '';
  }

  agregarNuevoUsuario() {
    const nuevoProfile: Profile = {
      id: 0, // Para creación, el ID generalmente lo genera el backend
      nombre: this.nuevoNombre,
      s_nombre: this.nuevoSNombre,
      apellido_p: this.nuevoApellidoP,
      apellido_m: this.nuevoApellidoM,
      correo: this.nuevoCorreo,
      id_facultad: this.nuevaFacultadId,
      id_unidad: this.nuevaUnidadId,
      username: this.nuevoUsername,
      password: this.nuevoPassword,
      rol: this.nuevoRol,
    };

    this.profileService.createProfile(nuevoProfile).subscribe({
      next: (data) => {
        console.log('Nuevo perfil creado con éxito');
        this.cargarPerfiles();
        this.cerrarModalAgregarUsuario();
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear usuario');
      },
    });
  }

  deleteProfile(id: Number) {
    const isConfirm = window.confirm('Estas seguro que quieres eliminar?');
    if (isConfirm) {
      this.profileService.deleteProfile(id).subscribe((data) => {
        this.profiles = this.profiles.filter((item) => item.id != id);
        this.cargarPerfiles(); // Recargar después de eliminar
      });
    }
  }

  setProfile(profile: Profile) {
    this.profile = { ...profile };
  }

  searchProfile(input: string) {
    this.filteredProfiles = this.profiles.filter(
      (item) =>
        item.nombre.toLowerCase().includes(input.toLowerCase()) ||
        item.correo.toLowerCase().includes(input.toLowerCase())
    );
    this.dataSource = new MatTableDataSource<Profile>(this.filteredProfiles);
  }

  cargarFacultades() {
    this.deptoService.obtenerFacultades().subscribe(data => {
      this.facultades = data;
    });
  }

  cargarDepartamentos() {
    this.deptoService.obtenerDepartamentos().subscribe(data => {
      this.unidades = data;
    });
  }

  cargarPerfiles() {
    this.profileService.getProfiles().subscribe((data) => {
      this.profiles = data;
      this.dataSource = new MatTableDataSource<Profile>(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
}
