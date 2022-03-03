import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SignupPayload } from '@fedex/shared/models/sign-up-payload';
import { SignedupUserResponse } from '@fedex/shared/models/signed-up-user-response';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private fedexApi = environment.apiUrl;

  constructor(private http: HttpClient) {}

  signUp(payload: SignupPayload): Observable<Array<SignedupUserResponse>> {
    return this.http
      .post<Array<SignedupUserResponse>>(this.fedexApi, payload)
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened. please try again later.')
    );
  }
}
