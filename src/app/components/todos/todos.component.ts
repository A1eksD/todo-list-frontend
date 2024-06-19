import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent {
  todos:any = [];
  error: string = '';
  
  constructor(private http: HttpClient) {}

  async ngOnInit(){
    try{
      this.todos = await this.loadTodos();
      console.log(this.todos);
    } catch(e) {
      console.error(e);
      this.error = 'Fehler bim laden';
    }
    
  }

  loadTodos(){
    const url = environment.baseUrl + '/todos/';
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Token ' + localStorage.getItem('token'));
    return lastValueFrom(this.http.get(url, {
      headers: headers
    }));
  }
}
