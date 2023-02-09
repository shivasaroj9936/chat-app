import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(private _router:Router,private user:UserService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.user.userDetails.email){
        return true
      }
      else{
        return this.navigate();
      }
      // return true;
  }
  canLoad(route: Route): Observable<boolean>|Promise<boolean>|boolean {
    if(this.user.userDetails.email) {
      return true;
    }
    return this.navigate();
  }
  navigate() {
    this._router.navigate(['/login']);
    return Promise.resolve(false);
  }
  
}
