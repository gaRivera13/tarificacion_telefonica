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
import { DepartamentoService, Facultad, Departamento } from '../../servicios/departamento.service';
import { AlertaService } from '../../alerta-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
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
  modoEdicion: boolean = false;

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(
    private profileService: ProfileService,
    private deptoService: DepartamentoService,
    private alertaService: AlertaService
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

  facultades: any[] = [];
  unidades: any[] = [];

  private soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

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
    this.resetFormulario();
    this.modoEdicion = false;
    this.mostrarModalAgregarUsuario = true;
  }

  cerrarModalAgregarUsuario() {
    this.mostrarModalAgregarUsuario = false;
    this.modoEdicion = false;
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
    this.profile.id = 0;
  }

  agregarNuevoUsuario() {
    if (
      !this.validarSoloLetras(this.nuevoNombre) ||
      (this.nuevoSNombre && !this.validarSoloLetras(this.nuevoSNombre)) ||
      !this.validarSoloLetras(this.nuevoApellidoP) ||
      !this.validarSoloLetras(this.nuevoApellidoM)
    ) {
      this.alertaService.mostrar('Por favor, ingrese solo letras y espacios en nombres y apellidos.');
      return;
    }

    const correoExistente = this.profiles.some(
      (p) =>
        p.correo.trim().toLowerCase() === this.nuevoCorreo.trim().toLowerCase() &&
        (!this.modoEdicion || p.id !== this.profile.id)
    );
    const usernameExistente = this.profiles.some(
      (p) =>
        p.username.trim().toLowerCase() === this.nuevoUsername.trim().toLowerCase() &&
        (!this.modoEdicion || p.id !== this.profile.id)
    );

    if (correoExistente || usernameExistente) {
      this.alertaService.mostrar('Este correo o usuario ya existe, vuelve a intentarlo.');
      return;
    }

    const nuevoProfile: Profile = {
      id: this.profile.id,
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

    if (this.modoEdicion) {
      this.profileService.updateProfile(nuevoProfile).subscribe({
        next: () => {
          console.log('Usuario actualizado con éxito');
          this.cargarPerfiles();
          this.cerrarModalAgregarUsuario();
        },
        error: (err) => {
          console.error(err);
          this.alertaService.mostrar('Error al actualizar usuario');
        },
      });
    } else {
      this.profileService.createProfile(nuevoProfile).subscribe({
        next: () => {
          console.log('Nuevo perfil creado con éxito');
          this.cargarPerfiles();
          this.cerrarModalAgregarUsuario();
        },
        error: (err) => {
          console.error(err);
          this.alertaService.mostrar('Error al crear usuario');
        },
      });
    }
  }

  deleteProfile(id: number) {
    const isConfirm = window.confirm('¿Estás seguro que deseas eliminar este usuario?');
    if (isConfirm) {
      this.profileService.deleteProfile(id).subscribe(() => {
        this.profiles = this.profiles.filter((item) => item.id !== id);
        this.cargarPerfiles();
      });
    }
  }

  setProfile(profile: Profile) {
    this.profile = { ...profile };
    this.modoEdicion = true;
    this.mostrarModalAgregarUsuario = true;

    this.nuevoNombre = profile.nombre;
    this.nuevoSNombre = profile.s_nombre;
    this.nuevoApellidoP = profile.apellido_p;
    this.nuevoApellidoM = profile.apellido_m;
    this.nuevoCorreo = profile.correo;
    this.nuevaFacultadId = profile.id_facultad;
    this.nuevaUnidadId = profile.id_unidad;
    this.nuevoUsername = profile.username;
    this.nuevoPassword = profile.password;
    this.nuevoRol = profile.rol;
  }

  searchProfile(input: string) {
    const lowerInput = input.toLowerCase();

    this.filteredProfiles = this.profiles.filter((item) =>
      item.nombre.toLowerCase().includes(lowerInput) ||
      item.s_nombre?.toLowerCase().includes(lowerInput) ||
      item.apellido_p?.toLowerCase().includes(lowerInput) ||
      item.apellido_m?.toLowerCase().includes(lowerInput) ||
      item.correo.toLowerCase().includes(lowerInput)
    );

    this.dataSource = new MatTableDataSource<Profile>(this.filteredProfiles);
  }

  cargarFacultades() {
    this.deptoService.obtenerFacultades().subscribe((data) => {
      this.facultades = data;
    });
  }

  cargarDepartamentos() {
    this.deptoService.obtenerDepartamentos().subscribe((data) => {
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

  validarSoloLetras(valor: string): boolean {
    return this.soloLetrasRegex.test(valor || '');
  }
}
