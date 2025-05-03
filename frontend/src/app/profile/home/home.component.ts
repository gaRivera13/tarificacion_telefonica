import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Profile } from '../profile';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import { ProfileService } from '../profile.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSort,MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatIconModule,MatButtonModule, 
    MatTableModule, FormsModule,CommonModule,MatSortModule, MatPaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'address', 'edit','delete'];
  dataSource = new MatTableDataSource<Profile>();
  filteredProfiles:Profile[]=[];
  profiles:Profile[]=[];

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  
  constructor(private profileService:ProfileService){}

  

  profile:Profile={
    id:0,
    name:'',
    email:'',
    address:''
  }

  ngAfterViewInit(): void {
      this.profileService.getProfiles().subscribe((data)=>{
        this.profiles=data;
        this.dataSource = new MatTableDataSource<Profile>(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
  }

  addUpProfile(profile:Profile){
    if (profile.id!==0){
      //update
      this.profileService.updateProfile(profile).subscribe({
        next:(data)=>{
          console.log("Actualizado");
          window.location.reload();
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }else{
      //create
      this.profileService.createProfile(profile).subscribe({
        next:(data)=>{
          console.log("Nuevo perfil creado con exito");
          window.location.reload();
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
  }

  deleteProfile(id:Number){
    const isConfirm=window.confirm("Estas seguro que quieres eliminar?");
    if (isConfirm){
      this.profileService.deleteProfile(id).subscribe((data)=>{
        this.profiles = this.profiles.filter(item=>item.id!=id); 
      })
      window.location.reload();
    }
  }

  setProfile(profile:Profile){
    this.profile.id = profile.id;
    this.profile.address = profile.address;
    this.profile.email = profile.email;
    this.profile.name = profile.name;
  }
  searchProfile(input:string){
    this.filteredProfiles=this.profiles.filter(item=>item.name.toLowerCase().includes(input.toLowerCase()) ||
    item.email.toLowerCase().includes(input.toLowerCase()) ||
    item.address.toLowerCase().includes(input.toLowerCase()))
    this.dataSource = new MatTableDataSource<Profile>(this.filteredProfiles);
  }
}
