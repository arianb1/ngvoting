import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../../_models';
import { UserService, AuthenticationService, AlertService, VotesManagerService } from '../../_services';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './managevotes.component.html',
  styleUrls: ['./managevotes.component.css']
})

export class ManageVotesComponent implements OnInit {
  currentUser: User;
  allVotes: string[] = [];
  loading = false;
  submitted = false;


  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private votesService: VotesManagerService,
    private alertService: AlertService,
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
      this.alertService.success('Votes successfully retreived', true);
    });
  }


}
