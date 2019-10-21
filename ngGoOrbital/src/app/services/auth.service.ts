import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { TravelerDTO } from '../models/traveler-dto';
import { CompanyDTO } from '../models/company-dto';
import { throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  USER_NAME_SESSION_ATTRIBUTE_NAME = 'inSessionUser';
  USER_NAME_SESSION_ATTRIBUTE_ID;
  USER_NAME_SESSION_ATTRIBUTE_ROLE = 'inSessionRole';

  private baseUrl = 'http://localhost:8085/';
  public username: string;
  public password: string;
  public id: number;
  public role: string;

  constructor(private http: HttpClient, private userServ: UserService) {
  }
  authenticationService(username: string, password: string) {
    return this.http.get(`http://localhost:8085/auth`,
      { headers: { authorization: this.createBasicAuthToken(username, password) } }).pipe(map((res) => {
        this.username = username;
        this.password = password;

        this.registerSuccessfulLogin(username);
      }));
  }

  createBasicAuthToken(username: string, password: string) {
    return 'Basic ' + window.btoa(username + ':' + password);
  }

  registerSuccessfulLogin(username) {
    sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, username);
    this.userServ.getUserByName(username).subscribe({
  next(user) { console.log('Current User ', user);
               const currentUser: User = user;
               sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_ID, currentUser.id.toString());
               sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_ROLE, currentUser.role);
},
  error(msg) { console.log('Error Getting user: ', msg); }
});

  }

  logout() {
    sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_ID);
    sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_ROLE);
    this.username = null;
    this.password = null;
  }

  isUserLoggedIn() {
    const user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    if (user === null) { return false ; } else {
      return true;
  }
  }

  getLoggedInUserName() {
    const user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    if (user === null) { return '' ; }
    return user;
  }

//    login(username, password) {
//     // Make credentials
//     const credentials = this.generateBasicAuthCredentials(username, password);
//     // Send credentials as Authorization header (this is spring security convention for basic auth)
//     const httpOptions = {
//       headers: new HttpHeaders({
//         Authorization: `Basic ${credentials}`,
//         "X-Requested-With": "XMLHttpRequest"
//       })
//     };

registerTraveler(dto: TravelerDTO) {
    console.log('inside of register traveler method');

    // create request to register a new account
    return this.http.post(this.baseUrl + 'register/traveler', dto).pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError(
          'AuthService.registerTraveler(): error registering traveler.'
        );
      })
    );
  }


  registerCompany(dto: CompanyDTO) {
    // create request to register a new account
    console.log('inside of register company method auth service');

    return this.http.post(this.baseUrl + 'register/company', dto).pipe(
      catchError((err: any) => {
        console.log(err);
        return throwError(
          'AuthService.registerCompany(): error registering company.'
        );
      })
    );
  }


}
