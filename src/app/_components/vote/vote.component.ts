import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../../_models';
import { UserService, AuthenticationService, AlertService, VotingService, VotesManagerService } from '../../_services';
import { ModalService } from '../modalWindow/modal.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private votesMgrService: VotesManagerService,
    private voteService: VotingService,
    private alertService: AlertService,
    private modalService: ModalService,
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnInit() {
    // get current votes
    this.votesMgrService.getAllVotes().then(res => {
      for (const entry of res) {
        this.allVotes.push(entry);
      }
    });
  }

  openModal(id: string, voteAddress: string) {
    this.voteOptions = [];
    this.votesMgrService.retreiveVote(voteAddress).then(res => {
      this.modalTitle = (res[0]);
      this.votedesc = (res[1]);
      for (const entry of res[2]) {
        this.voteOptions.push(entry.trim());
      }
    });
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

}
