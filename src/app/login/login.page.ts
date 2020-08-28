import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {

  entForm: FormGroup;
  validationsList = {
    cveEnt: [
      { type:'required', message:'La clave entidad es un campo requerido.'},
    ],
    cveEnc: [
      { type:'required', message:'La clave enc es un campo requerido.'},
    ]
  };
  errorMessage: string;


  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private storage: Storage
  ) {
    this.entForm = this.fb.group({
      cveEnt: new FormControl('', Validators.compose([Validators.required])),
      cveEnc: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  loginKeys(credentials) {
    // console.log(credentials);
    this.errorMessage = '';
    this.storage.set('isKeysRegistered', credentials);
    this.navController.navigateForward('/menu/home');
  }


}
