import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastrService } from '../../service/toastr.service';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    RouterLink,
    MatCheckboxModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  formRegistro: FormGroup
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.formRegistro = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      termos: [false, Validators.requiredTrue]
    })
  }

  ngOnInit(): void {

  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  register() {
    this.authService.register(this.formRegistro.value).subscribe({
      next: (res: any) => {
        if (res.accessToken) {
          localStorage.setItem('token', res.accessToken)
          this.router.navigate(['/dashboard'])
          window.location.reload()
        }
      },
      error: (err: any) => {
        this.toastrService.showError(err.error.message)
      }
    });
  }
}
