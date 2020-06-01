import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { LoginComponent } from './_components/login/login.component';
import { RegisterComponent } from './_components/register/register.component';
// import { AuthGuard } from './_helpers';
import { MyProfileComponent } from './_components/my-profile/my-profile.component';
import { ExploreComponent } from './_components/explore/explore.component';
import { EditComponent } from './_components/edit/edit.component';

const routes: Routes = [
  {path:  '', pathMatch:  'full', redirectTo:  'home'},
  {path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'profile', component: MyProfileComponent },
  { path: 'edit', component: EditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
