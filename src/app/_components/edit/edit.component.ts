import { Component, OnInit } from '@angular/core';
import { UserService, AuthenticationService } from '../../_services';
import { User } from '../../_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'pm-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  registerForm: FormGroup;
  currentUser: User;
  loading = false;
  submitted = false;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      id: this.currentUser.id,
      firstName: [this.currentUser.firstName, Validators.required],
      lastName: [this.currentUser.lastName, Validators.required],
      username: [this.currentUser.username, Validators.required],
      password: [
        this.currentUser.password,
        [Validators.required, Validators.minLength(6)]
      ]
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    this.userService
      .editUser(this.currentUser.id, this.registerForm.value)
      .subscribe(
        (result: User) => {
          this.router.navigate(['/profile']);
        },
        error => {
          this.loading = false;
        }
      );
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnDestroy() {
    // this.authenticationService
    //   .login(this.f.username.value, this.f.password.value)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       this.router.navigate(['/profile']);
    //     },
    //     error => {
    //       console.log(error);
    //       this.loading = false;
    //     }
    //   );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }
}
