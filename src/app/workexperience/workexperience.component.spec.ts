import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkexperienceComponent } from './workexperience.component';
import { GraphqlWorkExperienceService } from '../services/workexperience.service';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

class MockGraphqlWorkExperienceService {
  getWorkExperienceById(id: number, token: string) {
    return of({
      data: {
        experienceById: {
          role: 'Developer',
          company: 'Tech Corp',
          accomplishments: ['Project A', 'Project B'],
          startDate: '2021-01-01',
          endDate: '2023-01-01',
          location: 'Remote',
        },
      },
    });
  }

  createExperience(workExperience: any, token: string) {
    return of({
      data: {
        createWorkExperience: workExperience,
      },
    });
  }

  updateExperience(id: number, workExperience: any, token: string) {
    return of({
      data: {
        updateWorkExperience: workExperience,
      },
    });
  }
}

class MockStorageService {
  getSession(key: string) {
    return 'mock-token';
  }

  setSession(key: string, value: string) {}
}

class MockRouter {
  navigate(path: string[]) {}
}

class MockActivatedRoute {
  params = of({ id: '1' });
}

describe('WorkexperienceComponent', () => {
  let component: WorkexperienceComponent;
  let fixture: ComponentFixture<WorkexperienceComponent>;
  let mockWorkExperienceService: MockGraphqlWorkExperienceService;
  let mockStorageService: MockStorageService;
  let mockRouter: MockRouter;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(async () => {
    mockWorkExperienceService = new MockGraphqlWorkExperienceService();
    mockStorageService = new MockStorageService();
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    await TestBed.configureTestingModule({
      declarations: [WorkexperienceComponent],
      providers: [
        { provide: GraphqlWorkExperienceService, useValue: mockWorkExperienceService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkexperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los datos de la experiencia laboral para edición si se proporciona un ID', () => {
    const spyLoadWorkExperience = spyOn(component, 'loadWorkExperience').and.callThrough();
    component.ngOnInit();
    expect(spyLoadWorkExperience).toHaveBeenCalledWith(1);
    expect(component.role).toBe('Developer');
    expect(component.company).toBe('Tech Corp');
    expect(component.accomplishments).toBe('Project A, Project B');
  });

  it('debería manejar el caso cuando no se encuentra la experiencia laboral al cargarla', () => {
    spyOn(mockWorkExperienceService, 'getWorkExperienceById').and.returnValue(of({ data: { experienceById: null } }));
    const alertSpy = spyOn(window, 'alert');
    component.loadWorkExperience(1);
    expect(alertSpy).toHaveBeenCalledWith('No se encontró la experiencia laboral.');
  });

  it('debería crear una nueva experiencia laboral', () => {
    component.role = 'Frontend Developer';
    component.company = 'Web Inc';
    component.accomplishments = 'Project X, Project Y';
    component.startDate = '2022-01-01';
    component.endDate = '2023-12-31';
    component.location = 'Hybrid';

    const setSessionSpy = spyOn(mockStorageService, 'setSession').and.callThrough();
    const navigateSpy = spyOn(mockRouter, 'navigate').and.callThrough();
    const alertSpy = spyOn(window, 'alert');

    component.saveWorkExperience();

    expect(alertSpy).toHaveBeenCalledWith('Experiencia laboral creada exitosamente');
    expect(navigateSpy).toHaveBeenCalledWith(['/workexperience']);
    expect(setSessionSpy).not.toHaveBeenCalled(); // No se utiliza setSession para esta operación
  });

  it('debería manejar error al crear una experiencia laboral', () => {
    spyOn(mockWorkExperienceService, 'createExperience').and.returnValue(throwError(() => new Error('Error al crear experiencia')));
    const alertSpy = spyOn(window, 'alert');

    component.saveWorkExperience();

    expect(alertSpy).toHaveBeenCalledWith('Ocurrió un error desconocido.');
  });

  it('debería actualizar una experiencia laboral existente', () => {
    component.id = 1;
    component.role = 'Senior Developer';
    component.company = 'Tech Corp';
    component.accomplishments = 'Lead Project, Mentoring';
    component.startDate = '2020-01-01';
    component.endDate = '2023-12-31';
    component.location = 'Remote';

    const alertSpy = spyOn(window, 'alert');
    const navigateSpy = spyOn(mockRouter, 'navigate').and.callThrough();

    component.saveWorkExperience();

    expect(alertSpy).toHaveBeenCalledWith('Experiencia laboral actualizada exitosamente');
    expect(navigateSpy).toHaveBeenCalledWith(['/workexperience']);
  });

  it('debería manejar error al actualizar una experiencia laboral', () => {
    spyOn(mockWorkExperienceService, 'updateExperience').and.returnValue(throwError(() => new Error('Error al actualizar experiencia')));
    const alertSpy = spyOn(window, 'alert');

    component.saveWorkExperience();

    expect(alertSpy).toHaveBeenCalledWith('Ocurrió un error desconocido.');
  });

  it('debería manejar errores de red al cargar la experiencia laboral', () => {
    spyOn(mockWorkExperienceService, 'getWorkExperienceById').and.returnValue(throwError(() => new Error('Error de red')));
    const alertSpy = spyOn(window, 'alert');
    component.loadWorkExperience(1);
    expect(alertSpy).toHaveBeenCalledWith('Error de red: No se pudo conectar al servidor.');
  });

  it('debería manejar errores de GraphQL al cargar la experiencia laboral', () => {
    spyOn(mockWorkExperienceService, 'getWorkExperienceById').and.returnValue(throwError(() => ({ graphQLErrors: [{ message: 'Error GraphQL' }] })));
    const alertSpy = spyOn(window, 'alert');
    component.loadWorkExperience(1);
    expect(alertSpy).toHaveBeenCalledWith('Error de GraphQL: Error GraphQL');
  });

  it('debería redirigir al login si no hay token', () => {
    spyOn(mockStorageService, 'getSession').and.returnValue(null);
    const navigateSpy = spyOn(mockRouter, 'navigate');
    component.ngOnInit();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('debería restablecer el formulario después de crear o actualizar la experiencia', () => {
    const resetFormSpy = spyOn(component, 'resetForm').and.callThrough();
    component.saveWorkExperience();
    expect(resetFormSpy).toHaveBeenCalled();
  });
});
