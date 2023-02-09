import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {
  constructor(private user:UserService,private _router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log(this.user.userDetails,'in auth');
      
      if(this.user.userDetails.email){
        console.log(this.user.userDetails);
        return false
      }
      else{
        return this.navigate();
      }
  }
  navigate() {
    this._router.navigate(['/login']);
    return Promise.resolve(false);
  }
  
}
