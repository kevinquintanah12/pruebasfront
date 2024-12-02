import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { Credential } from '../models/user/Credential';

class MockUserService {
  tokenAuth(credential: Credential) {
    if (credential.username === 'test' && credential.password === 'password') {
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

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUserService: MockUserService;
  let mockStorageService: MockStorageService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockUserService = new MockUserService();
    mockStorageService = new MockStorageService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería hacer login exitoso con credenciales correctas', () => {
    const setSessionSpy = spyOn(mockStorageService, 'setSession').and.callThrough();
    const navigateSpy = spyOn(mockRouter, 'navigate').and.callThrough();

    component.username = 'test';
    component.password = 'password';

    component.callLogin();

    expect(setSessionSpy).toHaveBeenCalledWith('user', 'test');
    expect(setSessionSpy).toHaveBeenCalledWith('token', 'mock-token');
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('debería manejar el error al hacer login con credenciales incorrectas', () => {
    const alertSpy = spyOn(window, 'alert');
    component.username = 'wrongUser';
    component.password = 'wrongPassword';

    component.callLogin();

    expect(alertSpy).toHaveBeenCalledWith('Error: Invalid credentials');
  });

  it('debería restablecer los campos de usuario y contraseña en caso de error', () => {
    component.username = 'wrongUser';
    component.password = 'wrongPassword';

    component.callLogin();

    expect(component.username).toBe('');
    expect(component.password).toBe('');
  });
});
