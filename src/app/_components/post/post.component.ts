import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { first } from 'rxjs/operators';

import { User, Post, Follow } from '../../_models';
import { UserService, AuthenticationService, PostsService } from '../../_services';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './post.component.html'
})
export class PostComponent implements OnInit {
  public pageTitle = 'Post';
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
    private postsService: PostsService,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );

    this.postsService.currentPost.subscribe(x => (this.currentPost = x));
  }

  ngOnInit() {
    // this.getPosts();
    this.allPosts = this.postsService.myGetPosts();
  }

  private getPosts() {
    this.postsService
      .getFollowedPosts(this.currentUser.id)
      .pipe(first())
      .subscribe(posts => {
        this.allPosts = posts;
      });
  }

  addPost(): void {
    if (!this.inputContent) {
      this.isEmpty = true;
    } else {
      console.log('adding');
      // this.postsService
      //   .addPost(this.currentUser.id, this.inputContent)
      //   .pipe(first())
      //   .subscribe(
      //     data => {
      //       this.getPosts();
      //     },
      //     error => {
      //       console.log(error);
      //     }
      //   );
      this.postsService.myAddPost(this.currentUser.username, this.inputContent);
      this.inputContent = null;
      this.isEmpty = false;
    }
  }

  deletePost(postId: number) {
    this.postsService
      .delete(this.currentUser.id, postId)
      .pipe(first())
      .subscribe(
        data => {
          this.getPosts();
        },
        error => {
          console.log(error);
        }
      );
  }
}
