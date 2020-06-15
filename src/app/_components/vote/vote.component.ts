import { Component, OnInit } from '@angular/core';
import { ManageService, AuthenticationService, TestService, AlertService } from '../../_services';
import { User, Vote } from '../../_models';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  voteForm: FormGroup;
  currentUser: User;
  currentVote: Vote = new Vote();
  newOpt: string;
  loading = false;
  submitted = false;
  isEmpty = false;
  currentState: number;
  newState: number;

  constructor(
    private authenticationService: AuthenticationService,
    private manageService: ManageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private testService: TestService,
    private alertService: AlertService,
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnInit() {
    this.voteForm = this.formBuilder.group({
      id: this.currentUser.id,
      votetitle: [this.currentVote.voteTitle, Validators.required],
      votedesc: [this.currentVote.voteDesc, [Validators.required, Validators.minLength(6)]],
      // voteopsX: this.formBuilder.array([]),
      voteOptions: [ this.currentVote.voteOptions ],
      newOpt: [''],
      newState: [0, Validators.required],
    });

    // get current state/property of contract
    this.testService.retreiveNumber().then(res => {
      this.currentState = res;
      this.newState = this.currentState;
      this.alertService.success('Current contract state: ' + this.currentState, true);
    });
  }


  addOption() {
    if (this.voteForm.controls.newOpt.value === '') {
      this.isEmpty = true;
    } else {
      console.log('adding...');
      this.currentVote.voteOptions.push(this.voteForm.controls.newOpt.value);
      this.voteForm.controls.newOpt.setValue('');
      this.isEmpty = false;
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.voteForm.invalid) {
      console.log('invalid...');
      return;
    }

    this.loading = true;
    // get account number first (login )
    let account: any = null;
    console.log('step 1');
    this.testService.getAccount().then(res => {
      console.log('step 2');
      account = res;
      console.log(account);
      if (account) {
        console.log('step 3');
        this.testService.storeNumber(this.f.newState.value).then(res1 => {
          this.currentState = res1;
          console.log('success:' + res1);
          // move next 3 lines below once adding event notification
          this.loading = false;
          this.alertService.success('Voting submitted', true);
          this.router.navigate(['/home']);
        }).catch(error => {
          this.loading = false;
          console.log('error:' + error);
          this.alertService.error('Error...', true);
        });
        // move success here
      }
      else {
        console.log('step 4');
        this.alertService.error('Login failed...', true);
        this.loading = false;
      }
    });


    // console.log('calling...');
    // this.manageService
    //   .createVote(this.voteForm.value)
    //   .subscribe(
    //     (result: User) => {
    //       this.router.navigate(['/home']);
    //     },
    //     error => {
    //       this.loading = false;
    //     }
    //   );
    // this.authenticationService.currentUser.subscribe(
    //   x => (this.currentUser = x)
    // );
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
    return this.voteForm.controls;
  }

  // get voteoptsX(): FormArray {
  //   return this.voteForm.get('voteoptsX') as FormArray;
  // }

}
