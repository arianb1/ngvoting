import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { User } from '../_models';
import { Vote } from '../_models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ManageService {
  baseUrl = 'http://localhost:3000/';
  constructor(private http: HttpClient) {}

  createVote(newvote: Vote): Observable<Object> {
    return this.http.post(this.baseUrl + 'votes', newvote);
  }

}
