import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewUserComponent } from './new-user/new-user.component';
import {FormsModule } from "@angular/forms";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FakeProductComponent } from './fake-product/fake-product.component';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { WorkexperienceComponent } from './workexperience/workexperience.component';
import { EducationComponent } from './education/education.component';
import { SkillsComponent } from './skills/skills.component';
import { InterestComponent } from './interest/interest.component';
import { LanguageComponent } from './language/language.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    LoginComponent,
    ForgotPasswordComponent,
    NewUserComponent,
    ResetPasswordComponent,
    FakeProductComponent,
    WorkexperienceComponent,
    EducationComponent,
    SkillsComponent,
    InterestComponent,
    LanguageComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }