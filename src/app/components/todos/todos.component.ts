import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthInterceptorService } from '../../services/auth-interceptor.service';
import { Token } from '@angular/compiler';
import { UrlService } from '../../services/url.service';

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
  inputText: string = '';
  
  constructor(private http: HttpClient, private urlService: UrlService) {}

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
    // let headers = new HttpHeaders();
    // headers = headers.set('Authorization', 'Token ' + localStorage.getItem('token'));
    return lastValueFrom(this.http.get(url));
    // return lastValueFrom(this.http.get(url, {
    //   headers: headers
    // }));
  }


  createTodo() {
    if (this.inputText) {
      const url = environment.baseUrl + '/todos/';
      const getUserID = +localStorage.getItem('userID')!;

      const body = {
        text: this.inputText,
        created_at: new Date().toISOString().split('T')[0],
        author: getUserID,
        done: false
      };
  
      this.http.post(url, body)
        .pipe(
          catchError(error => {
            console.error('Fehler beim Speichern des ToDos:', error);
            return throwError(() => error);
          })
        )
        .subscribe(response => {
          console.log('ToDo erfolgreich gespeichert:', response);
          this.todos.push(response);
        });
  
      this.inputText = '';
    }
  }


  deleteTodo(id: number){
    if (id) {
      const getTodo = this.todos.filter((todo:any) => todo.id === id);
      const url = environment.baseUrl + '/todos/';

      this.http.delete(url, getTodo[0].id)
        .pipe(
          catchError(error => {
            console.error('Fehler beim löschen des ToDos:', error);
            return throwError(() => error);
          })
        )
        .subscribe(response => {
          console.log('ToDo erfolgreich gelöscht:', response);
        });
  
    }
  }
  
  
}
