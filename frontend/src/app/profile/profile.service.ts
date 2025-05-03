import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from './profile';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _httpClient:HttpClient) { }

  private baseUrl:String="/core/profiles"

  getProfiles():Observable<Profile[]>{
    return this._httpClient.get<Profile[]>(`${environment.coreurl}${this.baseUrl}`);
  }

  createProfile(data:Profile){
    return this._httpClient.post<Profile>(`${environment.coreurl}${this.baseUrl}/`,data);
  }

  updateProfile(modifiedData:Profile){
    return this._httpClient.put<Profile>(`${environment.coreurl}${this.baseUrl}/${modifiedData.id}/`,modifiedData);
  }

  deleteProfile(id:Number){
    return this._httpClient.delete<Profile>(`${environment.coreurl}${this.baseUrl}/${id}/`);
  }


}
