import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Injectable} from "@angular/core";
import {LoginService} from "../services/login.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SellerGuard implements CanActivate {
  constructor(private login: LoginService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.login.isLoggedIn() && this.login.getUserRole() == 'SELLER') {
      return true;
    }

    this.router.navigate(['']);
    return false;
  }
}
