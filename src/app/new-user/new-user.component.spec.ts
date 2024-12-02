import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewUserComponent } from './new-user.component';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../models/user/User';
import { Credential } from '../models/user/Credential';

class MockUserService {
  createUser(user: User) {
    if (user.username === 'newUser') {
      return of({
        data: {
          createUser: {
            username: 'newUser',
            password: 'password123',
            email: 'newuser@example.com',
          },
        },
      });
    }
    return throwError(() => new Error('Error creating user'));
  }

  tokenAuth(credential: Credential) {
    if (credential.username === 'newUser' && credential.password === 'password123') {
      return of({
        data: {
          tokenAuth: {
            token: 'mock-token',
          },
        },
      });
    }
    return throwError(() => new Error('Invalid credentials'));
  }
}

class MockStorageService {
  setSession(key: string, value: string) {
    // Mock implementation of setSession
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;
  let mockUserService: MockUserService;
  let mockStorageService: MockStorageService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockUserService = new MockUserService();
    mockStorageService = new MockStorageService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      declarations: [NewUserComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería crear un nuevo usuario y hacer login exitoso', () => {
    const setSessionSpy = spyOn(mockStorageService, 'setSession').and.callThrough();
    const navigateSpy = spyOn(mockRouter, 'navigate').and.callThrough();
    const alertSpy = spyOn(window, 'alert');

    // Set up user details
    component.myPayloadUser.username = 'newUser';
    component.myPayloadUser.password = 'password123';
    component.myPayloadUser.email = 'newuser@example.com';

    component.createUser();

    expect(setSessionSpy).toHaveBeenCalledWith('user', 'newUser');
    expect(setSessionSpy).toHaveBeenCalledWith('token', 'mock-token');
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    expect(alertSpy).toHaveBeenCalledWith('User created : {"tokenAuth":{"token":"mock-token"}}');
  });

  it('debería manejar error al crear un usuario', () => {
    const alertSpy = spyOn(window, 'alert');
    component.myPayloadUser.username = 'invalidUser';
    component.myPayloadUser.password = 'password123';
    component.myPayloadUser.email = 'invaliduser@example.com';

    component.createUser();

    expect(alertSpy).toHaveBeenCalledWith('Error creating user');
    expect(component.myPayloadUser.username).toBe('');
    expect(component.myPayloadUser.email).toBe('');
    expect(component.myPayloadUser.password).toBe('');
  });

  it('debería manejar error al hacer login después de crear un usuario', () => {
    const alertSpy = spyOn(window, 'alert');
    component.myPayloadUser.username = 'newUser';
    component.myPayloadUser.password = 'wrongPassword'; // Incorrect password

    component.createUser();

    expect(alertSpy).toHaveBeenCalledWith('Invalid credentials');
  });
});
