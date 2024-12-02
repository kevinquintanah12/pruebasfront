import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from "./login/login.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { NewUserComponent } from "./new-user/new-user.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { WorkexperienceComponent } from './workexperience/workexperience.component';
import { EducationComponent } from './education/education.component';
import { SkillsComponent } from './skills/skills.component';
import { InterestComponent } from './interest/interest.component';
import { LanguageComponent } from './language/language.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'home', component: DashboardComponent }, 
  { path: 'header', component: HeaderComponent }, 
  { path: 'header/:id', component: HeaderComponent }, 

  { path: 'education/:id', component: EducationComponent },
  { path: 'language/:id', component: LanguageComponent }, 
  { path: 'skills/:id', component: SkillsComponent }, 
  { path: 'interest/:id', component: InterestComponent }, 

  { path: 'workexperience/:id', component: WorkexperienceComponent }, 
  { path: 'workexperience', component: WorkexperienceComponent }, 
  { path: 'education', component: EducationComponent }, 
  { path: 'skills', component: SkillsComponent }, 
  { path: 'interest', component: InterestComponent }, 
  { path: 'language', component: LanguageComponent }, 

  { path: 'login', component: LoginComponent }, 
  { path: 'forgot-password', component: ForgotPasswordComponent }, 
  { path: 'newuser', component: NewUserComponent }, 
  { path: 'reset-password/:email/:token', component: ResetPasswordComponent }, 
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
