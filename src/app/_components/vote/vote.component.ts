import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../../_models';
import { UserService, AuthenticationService, AlertService, VotesManagerService } from '../../_services';
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

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private votesService: VotesManagerService,
    private alertService: AlertService,
    private modalService: ModalService,
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnInit() {
    // get current votes
    this.votesService.getAllVotes().then(res => {
      for (const entry of res) {
        this.allVotes.push(entry);
      }
    });
  }

  openModal(id: string, title: string) {
    this.modalTitle = title;
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

}
