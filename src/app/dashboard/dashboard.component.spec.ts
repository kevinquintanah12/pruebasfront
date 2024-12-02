import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { GraphqlHeaderService } from '../services/header.service';
import { GraphqlWorkExperienceService } from '../services/workexperience.service';
import { GraphqlSkillService } from '../services/skills.service';
import { GraphqlLanguageService } from '../services/languages.servive';
import { GraphqlInterestService } from '../services/interest.services';
import { Router } from '@angular/router';
import { of } from 'rxjs';

// Mocks de los servicios
class MockUserService {
  getCurrentUser(token: string) {
    return of({ data: { currentUser: { name: 'John Doe' } } });
  }
}

class MockStorageService {
  getSession(key: string) {
    return 'mockToken';
  }
}

class MockGraphqlService {
  getHeaders(query: string, token: string) {
    return of({ data: { headers: [{ id: 1, title: 'Header 1' }] } });
  }
  getSkills(token: string) {
    return of({ data: { skills: [{ id: 1, name: 'JavaScript' }] } });
  }
  getLanguages(token: string) {
    return of({ data: { languages: [{ id: 1, name: 'English' }] } });
  }
  getInterests(token: string) {
    return of({ data: { interests: [{ id: 1, name: 'Reading' }] } });
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let userService: UserService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: StorageService, useClass: MockStorageService },
        { provide: GraphqlHeaderService, useClass: MockGraphqlService },
        { provide: GraphqlSkillService, useClass: MockGraphqlService },
        { provide: GraphqlLanguageService, useClass: MockGraphqlService },
        { provide: GraphqlInterestService, useClass: MockGraphqlService },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user data on init', () => {
    spyOn(userService, 'getCurrentUser').and.callThrough();
    component.ngOnInit();
    expect(userService.getCurrentUser).toHaveBeenCalled();
    expect(component.currentUser).toEqual({ name: 'John Doe' });
  });

  it('should navigate to login if no token is available', () => {
    spyOn(component['storageService'], 'getSession').and.returnValue(null);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load skills and display them correctly', () => {
    component.ngOnInit();
    expect(component.skills).toEqual([{ id: 1, name: 'JavaScript' }]);
  });

  it('should load languages and display them correctly', () => {
    component.ngOnInit();
    expect(component.languages).toEqual([{ id: 1, name: 'English' }]);
  });

  it('should load interests and display them correctly', () => {
    component.ngOnInit();
    expect(component.interests).toEqual([{ id: 1, name: 'Reading' }]);
  });

  it('should call router.navigate on onCreateNew() when there are headers', () => {
    component.headers = [{ id: 1, title: 'Header 1' }];
    component.onCreateNew();
    expect(router.navigate).toHaveBeenCalledWith(['/header']);
  });

  it('should ask for confirmation before creating a new header when one exists', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.headers = [{ id: 1, title: 'Header 1' }];
    component.onCreateNew();
    expect(router.navigate).toHaveBeenCalledWith(['/header']);
  });

  it('should not create a new header when confirmation is false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.headers = [{ id: 1, title: 'Header 1' }];
    component.onCreateNew();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
