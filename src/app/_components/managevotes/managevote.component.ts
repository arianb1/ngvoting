import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthenticationService, AlertService, VotesManagerService } from '../../_services';
import { User, Vote, VoteOption } from '../../_models';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-vote',
  templateUrl: './managevote.component.html',
  styleUrls: ['./managevote.component.css']
})
export class ManageVoteComponent implements OnInit {
  voteForm: FormGroup;
  currentUser: User;
  newOpt: string;
  loading = false;
  submitted = false;
  isEmpty = false;
  voteOptions: VoteOption[] = [];
  chartlabels: string[] = [];
  chartdata: number[] = [];
  inputText: string;
  // contractAdress = '0';
  // currentState: number;
  // newState: number;

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private manageVoteService: VotesManagerService,
    private alertService: AlertService,
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }


  ngOnInit() {
    this.inputText = 'abc';
    this.voteForm = this.formBuilder.group({
      id: this.currentUser.id,
      votetitle: ['', Validators.required],
      votedesc: ['', [Validators.required, Validators.minLength(6)]],
      // voteopsX: this.formBuilder.array([]),
      newOpt: [''],
      newState: [0, Validators.required],
      contractAdress: [this.route.snapshot.paramMap.get('addr'), Validators.required],
    });

    // get current state/property of contract
    if (this.f.contractAdress.value !== '0') {
      this.manageVoteService.retreiveVote(this.f.contractAdress.value).then(res => {
        this.f.votetitle.setValue(res.voteTitle);
        this.f.votedesc.setValue(res.voteDesc);

        this.voteOptions = res.voteOptions;
        // for (const entry of res[2]) {
        //   this.voteOptions.push(entry.trim());
        // }

        // this.currentState = res;
        // this.newState = this.currentState;
        this.alertService.success('Vote info successfully retreived', true);
        // set chart data
        for (const entry of res.voteOptions) {
          this.chartlabels.push(entry.optionName.trim());
          this.chartdata.push(entry.voteCount);
        }

      });
    }
  }


  addOption() {
    if (this.voteForm.controls.newOpt.value === '') {
      this.isEmpty = true;
    } else {
      console.log('adding...');
      const newOption: VoteOption = new VoteOption();
      newOption.optionName = this.voteForm.controls.newOpt.value;
      newOption.voteCount = 0;
      this.voteOptions.push(newOption);

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
    console.log(this.voteOptions);
    this.manageVoteService.getAccount().then(res => {
      console.log('step 2');
      account = res;
      console.log(account);
      if (account) {
        console.log('step 3');
        if (this.f.contractAdress.value !== '0') {
          this.manageVoteService.updateVote(this.f.contractAdress.value, this.f.votetitle.value, 
                                            this.f.votedesc.value, this.voteOptions).then(res1 => {
            console.log('success:' + res1);
            // move next 3 lines below once adding event notification
            this.loading = false;
            this.alertService.success('Voting submitted', true);
            this.router.navigate(['/managevotes']);
          }).catch(error => {
            this.loading = false;
            console.log('error:' + error);
            this.alertService.error('Error...', true);
          });
        }
        else {
          this.manageVoteService.createVote(this.f.votetitle.value, this.f.votedesc.value, this.voteOptions).then(res1 => {
            console.log('success:' + res1);
            // move next 3 lines below once adding event notification
            this.loading = false;
            this.alertService.success('Voting submitted', true);
            this.router.navigate(['/managevotes']);
          }).catch(error => {
            this.loading = false;
            console.log('error:' + error);
            this.alertService.error('Error...', true);
          });
        }
        // move success here
      }
      else {
        console.log('step 4');
        this.alertService.error('Login failed...', true);
        this.loading = false;
      }
    });

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
