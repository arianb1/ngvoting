import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { first } from 'rxjs/operators';

import { User, Post, Follow } from '../../_models';
import { UserService, AuthenticationService } from '../../_services';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public pageTitle = 'Home';
  currentUser: User = new User();
  currentPost: Post;
  users: User[] = [];
  allPosts: Post[] = [];
  post: Post = new Post();
  newPost: Post;
  isRequesting: string;
  follows: Follow[] = [];
  followings: string[] = [];
  isEmpty = false;

  _inputContent: string;
  get inputContent(): string {
    return this._inputContent;
  }
  set inputContent(value: string) {
    this._inputContent = value;
    this.isEmpty = this.inputContent ? false : true;
  }

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnInit() {
  }


}
