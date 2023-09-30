import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/auth';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | undefined>(undefined);
  
  // Expose the user as an observable
  user$: Observable<User | undefined> = this.userSubject.asObservable();
  constructor() { }
  updateUser(user: User|undefined) {
    this.userSubject.next(user);
  }
}
