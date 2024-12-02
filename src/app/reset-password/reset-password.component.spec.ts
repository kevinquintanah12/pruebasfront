import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from '../services/user.service';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockActivatedRoute: any;

  beforeEach(() => {
    // Creando un espía para el servicio UserService
    mockUserService = jasmine.createSpyObj('UserService', ['validateToken', 'resetPassword']);

    // Mock de ActivatedRoute para simular los parámetros
    mockActivatedRoute = {
      snapshot: { params: { email: 'test@example.com', token: 'valid-token' } }
    };

    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct email and token from the route', () => {
    expect(component.email).toBe('test@example.com');
    expect(component.token).toBe('valid-token');
  });


  it('should not call resetPassword if the passwords do not match', () => {
    component.password = 'newPassword123';
    component.confirmpassword = 'differentPassword123';  // Contraseña no coincide

    spyOn(console, 'log');  // Espiamos la llamada a console.log

    component.callResetPassword();

    // Verificamos que no se haya llamado al método resetPassword
    expect(mockUserService.resetPassword).not.toHaveBeenCalled();

    // Verificamos que el mensaje de error se haya registrado en la consola
    expect(console.log).toHaveBeenCalledWith('Passwords do not match.');
  });

  
});
