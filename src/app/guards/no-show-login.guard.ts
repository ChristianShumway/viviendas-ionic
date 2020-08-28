import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class NoShowLoginGuard implements CanActivate {
  
  constructor(
    private storage: Storage,
    private router: Router
  ){}
  
  async canActivate(){
    const isKeysRegistered = await this.storage.get('isKeysRegistered');

    if(!isKeysRegistered) {
      return true;
    } else {
      this.router.navigateByUrl('/menu');
    }
  }
  
}
