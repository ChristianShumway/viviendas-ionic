import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage   {

  constructor(
    private navController: NavController,
    private menuController: MenuController,
    private storage: Storage
  ){}

  closeMenu() {
    this.menuController.close();
  }

  logOut() {
    this.closeMenu();
    this.storage.remove('isKeysRegistered');
    this.navController.navigateRoot('/login');
  }

}
