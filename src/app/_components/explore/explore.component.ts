import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User, Follow } from '../../_models';
import { UserService, AuthenticationService } from '../../_services';

@Component({ templateUrl: 'explore.component.html' })
export class ExploreComponent implements OnInit {
  users: User[] = [
    {id: 1, username: 'dave', password: 'xx', firstName: 'dave', lastName: 'last', token: 'xx' },
    {id: 2, username: 'rayn', password: 'xx', firstName: 'dave', lastName: 'last', token: 'xx' },
    {id: 3, username: 'adi', password: 'xx', firstName: 'dave', lastName: 'last', token: 'xx' }
  ];
  currentUser: User;
  follow: Follow;
  clickedUsers: number[] = [];

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnInit() {
    // this.userService
    //   .explore(this.currentUser.id)
    //   .pipe(first())
    //   .subscribe(users => {
    //     this.users = users;
    //   });
  }

  followUser(userToFollowId: number): void {
    this.userService
      .follow(this.currentUser.id, userToFollowId)
      .pipe(first())
      .subscribe(
        data => {
          this.clickedUsers.push(userToFollowId);
        },
        error => {
          console.log(error);
        }
      );
  }

  isClicked(userId: number): boolean {
    return this.clickedUsers.includes(userId);
  }
}
