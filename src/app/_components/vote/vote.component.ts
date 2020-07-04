import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../../_models';
import { UserService, AuthenticationService, AlertService, VotesManagerService } from '../../_services';
import { ModalService } from '../modalWindow/modal.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})

export class VoteComponent implements OnInit {
  currentUser: User;
  allVotes: string[] = [];
  loading = false;
  submitted = false;
  modalTitle: string;
  voteOptions: string[] = [];
  votedesc: string;
  voteForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private votesMgrService: VotesManagerService,
    private alertService: AlertService,
    private modalService: ModalService,
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnInit() {

    this.voteForm  = new FormGroup({
      voteOption: new FormControl('', Validators.required),
      voteAddress: new FormControl('', Validators.required),
    });

    // get current votes
    this.votesMgrService.getAllVotes().then(res => {
      for (const entry of res) {
        this.allVotes.push(entry);
      }
    });
  }

  openModal(id: string, selectedVoteAddress: string) {
    console.log(selectedVoteAddress);
    this.submitted = false;
    this.voteOptions = [];
    this.votesMgrService.retreiveVote(selectedVoteAddress).then(res => {
      this.modalTitle = (res[0]);
      this.votedesc = (res[1]);
      for (const entry of res[2]) {
        this.voteOptions.push(entry.trim());
      }
    });
    this.voteForm.patchValue({
      voteAddress: selectedVoteAddress
    });
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  onSubmit() {
    this.submitted = true;
    if (this.voteForm.invalid){
      return;
    }
    this.loading = true;
    console.log(this.voteForm.get('voteOption').value);

    this.votesMgrService.castVote(this.voteForm.get('voteAddress').value, this.voteForm.get('voteOption').value).then(res => {
      this.alertService.success('Vote successfuly submited', true);
      this.router.navigate(['/']);
    });

  }

  get f() {
    return this.voteForm.controls;
  }

}
