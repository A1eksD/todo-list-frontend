import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() { }
  // localUrl:string = 'http://localhost:4200';
  baseUrl:string = 'http://api.domain.com';

}
