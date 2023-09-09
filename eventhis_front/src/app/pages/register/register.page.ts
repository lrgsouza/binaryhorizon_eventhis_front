import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from 'src/app/config/auth-constants';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  postData = {
    name: '',
    email: '',
    password: '',
    company: '',
    linkedin: '',
    phone: '',
    photo: ''
  };

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private router: Router
    ) {}

  ngOnInit() {
  }

  validateInputs() {
    console.log(this.postData);
    let name = this.postData.name.trim();
    let password = this.postData.password.trim();
    let email = this.postData.email.trim();

    return (
      this.postData.name &&
      this.postData.password &&
      this.postData.email &&
      name.length > 0 &&
      email.length > 0 &&
      password.length > 0
    );
  }
  signAction() {
    if (this.validateInputs()) {
      this.authService.signup(this.postData).subscribe({
        next: (res: any) => {
          if (res.userData) {
            // Storing the User data.
            this.storageService
            .store(AuthConstants.AUTH, res.userData)
            .then(res => {
              this.router.navigate(['home/feed']);
            });
          } else {
            this.toastService.presentToast(
              'Data alreay exists, please enter new details.'
            );
          }
        },
        error: (error: any) => {
          this.toastService.presentToast('Network Issue.');
        }
      });
    } else {
      this.toastService.presentToast(
        'Please enter email, username or password.'
      );
    }
  }
}
