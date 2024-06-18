import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UrlService } from '../../../services/url.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userName: string = '';
  password: string = '';

  constructor(private urlService: UrlService, private http: HttpClient){}

  async login() {

    try{
      let response = await this.loginWithUsernameAndPassword(this.userName, this.password);
      console.log('response', response);
      
    } catch (e){
      console.error('error', e);
    }
  }

  loginWithUsernameAndPassword(userName:string, password:string){
    const url = environment.baseUrl + '/login/';
    const body = {
      username: userName,
      password: password,
    };
    return lastValueFrom(this.http.post(url, body));
  }
}
