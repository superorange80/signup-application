import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SignupPayload } from '@fedex/shared/models/sign-up-payload';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private fedexApi = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  // TODO: add type to respone body
  signUp(
    payload: SignupPayload,
  ): Observable<any> {
    console.log('payload::', payload);
    return this.http.post<any>(
      this.fedexApi,
      payload,
    );
  }
}
