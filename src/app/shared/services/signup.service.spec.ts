import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

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
  const responseMock = [
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
    })

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
});
