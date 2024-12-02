import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationComponent } from './education.component';
import { GraphqlEducationService } from '../services/education.service';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class MockGraphqlEducationService {
  getDegrees(search: string | null, token: string) {
    return of({ data: { degrees: [{ id: 1, degree: 'Test Degree' }] } });
  }

  createOrUpdateEducation(data: any, token: string) {
    return of({ data: { createOrUpdateEducation: { id: 1, degree: 'Test Degree' } } });
  }

  deleteEducation(id: number, token: string) {
    return of({ data: { deleteEducation: true } });
  }

  getDegreeById(id: number, token: string) {
    return of({
      data: {
        degreeById: {
          id: 1,
          degree: 'Test Degree',
          university: 'Test University',
          startDate: '2022-01-01',
          endDate: '2024-01-01',
        },
      },
    });
  }
}

class MockStorageService {
  getSession(key: string) {
    return 'mock-token'; // Retorna un token de prueba
  }
}

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;
  let mockEducationService: MockGraphqlEducationService;
  let mockStorageService: MockStorageService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockEducationService = new MockGraphqlEducationService();
    mockStorageService = new MockStorageService();
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = { paramMap: of({ get: () => '1' }) } as any;

    await TestBed.configureTestingModule({
      declarations: [EducationComponent],
      providers: [
        { provide: GraphqlEducationService, useValue: mockEducationService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el token al inicializar', () => {
    expect(component.token).toBe('mock-token');
  });

  it('debería llamar a fetchDegrees al inicializar', () => {
    const fetchDegreesSpy = spyOn(component, 'fetchDegrees').and.callThrough();
    component.ngOnInit();
    expect(fetchDegreesSpy).toHaveBeenCalled();
  });

  it('debería cargar detalles de educación si hay un ID en los parámetros', () => {
    const loadEducationDetailsSpy = spyOn(component, 'loadEducationDetails').and.callThrough();
    component.ngOnInit();
    expect(loadEducationDetailsSpy).toHaveBeenCalledWith(1);
  });

  it('debería guardar educación correctamente', () => {
    const saveEducationSpy = spyOn(mockEducationService, 'createOrUpdateEducation').and.callThrough();
    component.degree = 'Test Degree';
    component.university = 'Test University';
    component.startDate = '2022-01-01';
    component.endDate = '2024-01-01';

    component.saveEducation();
    expect(saveEducationSpy).toHaveBeenCalled();
  });

  it('debería eliminar educación correctamente', () => {
    const deleteEducationSpy = spyOn(mockEducationService, 'deleteEducation').and.callThrough();
    component.deleteEducation(1);
    expect(deleteEducationSpy).toHaveBeenCalledWith(1, 'mock-token');
  });

  it('debería restablecer el formulario correctamente', () => {
    component.degree = 'Test';
    component.university = 'Test University';
    component.startDate = '2022-01-01';
    component.endDate = '2024-01-01';
    component.resetForm();
    expect(component.degree).toBe('');
    expect(component.university).toBe('');
    expect(component.startDate).toBe('');
    expect(component.endDate).toBe('');
    expect(component.isEditMode).toBeFalse();
  });
});
