import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';
// import { AuthGuard } from './_helpers';
import { ManageVoteComponent } from './_components/managevotes/managevote.component';
import { ManageVotesComponent } from './_components/managevotes/managevotes.component';
import { VoteComponent } from './_components/vote/vote.component';

const routes: Routes = [
  {path:  '', pathMatch:  'full', redirectTo:  'home'},
  {path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'newvote/:addr', component: ManageVoteComponent },
  { path: 'managevotes', component: ManageVotesComponent },
  { path: 'vote', component: VoteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
