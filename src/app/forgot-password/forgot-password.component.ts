import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../service/auth.service';
import { ToastrService } from '../service/toastr.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  token: string = '';
  showPassword = false;
  tokenExpired: boolean = false
  formNewPassword: FormGroup


  constructor(private router: Router,private authService: AuthService, private route: ActivatedRoute, private toastrService: ToastrService, private fb: FormBuilder) {
    this.formNewPassword = this.fb.group({
      newPassword: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];

    this.authService.verifyToken(this.token).subscribe({
      error: (err) => {
        this.tokenExpired = true
      }
    });
  }



  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  resetPassword() {
    this.authService.resetPassword(this.token, this.formNewPassword.value.newPassword).subscribe({

      next: () => {
        this.toastrService.showSucess('Senha redefinida!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastrService.showError(err.error.message)
      }
    });
  }
}
