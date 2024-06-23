import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
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
  todos: any = [];
  error: string = '';
  inputText: string = '';
  editTextValue: string = '';
  currenTaskValue: string = '';
  currentTaskID: string = '';
  openEditWidow: boolean = false;

  constructor(private http: HttpClient, private urlService: UrlService) {}

  async ngOnInit() {
    try {
      this.todos = await this.loadTodos();
      console.log(this.todos);
    } catch (e) {
      console.error(e);
      this.error = 'Fehler bim laden';
    }
  }

  loadTodos() {
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
        done: false,
      };

      this.http
        .post(url, body)
        .pipe(
          catchError((error) => {
            console.error('Fehler beim Speichern des ToDos:', error);
            return throwError(() => error);
          })
        )
        .subscribe((response) => {
          console.log('ToDo erfolgreich gespeichert:', response);
          this.todos.push(response);
        });

      this.inputText = '';
    }
  }


  deleteTodo(id: number): void {
    if (id) {
      const url = `${environment.baseUrl}/todos/${id}`;
      this.http
        .delete(url)
        .pipe(
          catchError((error) => {
            console.error('Error deleting todo:', error);
            return throwError(() => error);
          })
        )
        .subscribe((response) => {
          console.log('Todo deleted successfully:', response);
          this.todos = this.todos.filter((todo: any) => todo.id !== id);
        });
    }
  }

  editTodo(id: number){
    let task = this.todos.filter((todo: any) => todo.id === id);
    this.currentTaskID = id.toString();
    this.currenTaskValue = task[0].text;
    this.editTextValue = task[0].text;
    this.openEditWidow = !this.openEditWidow;
  }

  closeEdit(){
    this.openEditWidow = !this.openEditWidow;
    this.editTextValue = '';
  }


  
  saveChanges() {
    if (this.editTextValue.length > 0 && this.editTextValue !== this.currenTaskValue) {
      const url = `${environment.baseUrl}/todos/${Number(this.currentTaskID)}`;
      const getAuthorID = +localStorage.getItem('userID')!;
      const body = {
        author: getAuthorID,
        text: this.editTextValue
      };

      this.http
        .put(url, body)
        .pipe(
          catchError((error) => {
            console.error('Fehler beim Speichern des ToDos:', error);
            return throwError(() => error);
          })
        )
        .subscribe((response) => {
          console.log('ToDo erfolgreich gespeichert:', response);
          const updatedTodoIndex = this.todos.findIndex((todo: any) => todo.id ===  Number(this.currentTaskID));
          if (updatedTodoIndex !== -1) {
            this.todos[updatedTodoIndex] = response;
          }
        });
    } else {
      alert('Please enter a value greater than 0 and different from the current task.');
    }

    this.closeEdit();
  }
  
}
