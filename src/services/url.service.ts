import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(private http: HttpClient) { }
  // localUrl:string = 'http://localhost:4200';
  // baseUrl:string = 'http://api.domain.com';

  
  loginWithUsernameAndPassword(userName:string, password:string){
    const url = environment.baseUrl + '/login/';
    const body = {
      username: userName,
      password: password,
    };
    return lastValueFrom(this.http.post(url, body));
  }
}
