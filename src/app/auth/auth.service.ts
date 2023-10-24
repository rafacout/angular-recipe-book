import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, Subject, tap, throwError} from "rxjs";
import {User} from "./user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiredIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {
  }
  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDUepPT-NCdeLbIATwbiDZeXEc9LGkfsQk',
      {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(catchError(this.handleError), tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiredIn);
      }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDUepPT-NCdeLbIATwbiDZeXEc9LGkfsQk',
    {
        email: email,
        password: password,
        returnSecureToken: true
    })
    .pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiredIn);
    }));
  }

  private handleAuthentication(email: string, userId: string, token: string, expireIn: number) {
    const expirationDate = new Date(new Date().getTime() + expireIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate);

    this.user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exists';
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct';
    }
    return throwError(errorMessage);
  }
}
