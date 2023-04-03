import { Component,OnInit,ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Servidor } from '../../classes/servidor';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { DataSharingService } from '../../services/data-sharing.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('f', { read: NgForm }) formF: any;

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  servidores: Servidor[] = [];

  constructor(private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    private router: Router,private dataSharingService: DataSharingService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.router.navigateByUrl('/header', { skipLocationChange: true }).then(() => {
        this.router.navigate(['monitoreo']); // navigate to same route
    });
    }
    else{
      console.log('Error no token login');

    }
  }
  onFocus(){
    
  }

  onSubmit(): void {
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.servidores = this.tokenStorage.getUser().servidores;
        this.dataSharingService.isUserLoggedIn.next(true);
        this.router.navigateByUrl('/header', { skipLocationChange: true }).then(() => {
            this.router.navigate(['monitoreo']); // navigate to same route
        }); 
        
      },
      err => {
        this.errorMessage = "Usuario o contraseña no válidos";
        this.isLoginFailed = true;
      }
    );
  }

}
