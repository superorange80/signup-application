import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { SignedupUserResponse } from '../models/signed-up-user-response';

import { SignupService } from './signup.service';

describe('SignupService', () => {
  let service: SignupService;
  let httpMock: HttpTestingController;

  const requestPayloadMock = {
    firstName: 'John',
    lastName: 'Lennon',
    email: 'john.lennon@test.com',
    password: 'helloWorld2!@3',
  };
  const responseMock: Array<SignedupUserResponse> = [
    {
      _id: '2ec1d5a7-2836-4c87-9228-88e2b29ad4d1',
      email: 'john.lennon@test.com',
      firstName: 'John',
      lastName: 'Lennon',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.get(SignupService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be able to post signup form data to the api', () => {
    service.signUp(requestPayloadMock).subscribe((response) => {
      expect(response).toEqual(responseMock);
    });
    const request = httpMock.expectOne(environment.apiUrl);
    expect(request.request.method).toBe('POST');
    request.flush(responseMock);
  });

  it('should return custom error message when error is thrown by the api', () => {
    service.signUp(requestPayloadMock).subscribe(
      (data) => fail('Should have failed with 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.message).toEqual('Something bad happened. please try again later.');
      }
    );
    httpMock.expectOne(environment.apiUrl).flush(null, {status: 400, statusText: "Bad Request"});
  });
});
