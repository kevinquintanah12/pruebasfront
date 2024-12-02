import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillsComponent } from './skills.component';
import { GraphqlSkillService } from '../services/skills.service';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

class MockGraphqlSkillService {
  getSkills(token: string) {
    return of({
      data: {
        skills: [
          { name: 'JavaScript', level: 'Advanced', description: 'JavaScript skills' },
          { name: 'Angular', level: 'Intermediate', description: 'Angular framework' },
        ],
      },
    });
  }

  createSkill(skill: any, token: string) {
    return of({
      data: {
        createSkill: skill,
      },
    });
  }

  updateSkill(skill: any, token: string) {
    return of({
      data: {
        updateSkill: skill,
      },
    });
  }

  getSkillById(id: number, token: string) {
    return of({
      data: {
        skillById: { name: 'JavaScript', level: 'Advanced', description: 'JavaScript skills' },
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
  paramMap = of({ get: (key: string) => '1' });
}

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;
  let mockSkillService: MockGraphqlSkillService;
  let mockStorageService: MockStorageService;
  let mockRouter: MockRouter;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(async () => {
    mockSkillService = new MockGraphqlSkillService();
    mockStorageService = new MockStorageService();
    mockRouter = new MockRouter();
    mockActivatedRoute = new MockActivatedRoute();

    await TestBed.configureTestingModule({
      declarations: [SkillsComponent],
      providers: [
        { provide: GraphqlSkillService, useValue: mockSkillService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las habilidades al iniciar', () => {
    const spyFetchSkills = spyOn(component, 'fetchSkills').and.callThrough();
    component.ngOnInit();
    expect(spyFetchSkills).toHaveBeenCalled();
    expect(component.skills.length).toBeGreaterThan(0);
  });

  it('debería crear una nueva habilidad', () => {
    const setSessionSpy = spyOn(mockStorageService, 'setSession').and.callThrough();
    const navigateSpy = spyOn(mockRouter, 'navigate').and.callThrough();
    const alertSpy = spyOn(window, 'alert');

    component.name = 'TypeScript';
    component.level = 'Beginner';
    component.description = 'TypeScript skills';
    component.saveSkill();

    expect(alertSpy).toHaveBeenCalledWith('Habilidad creada exitosamente.');
    expect(navigateSpy).toHaveBeenCalledWith(['/skills']);
    expect(setSessionSpy).not.toHaveBeenCalled(); // No se utiliza setSession para esta operación
  });

  it('debería manejar error al crear una habilidad', () => {
    spyOn(mockSkillService, 'createSkill').and.returnValue(throwError(() => new Error('Error al crear habilidad')));
    const alertSpy = spyOn(window, 'alert');

    component.name = 'TypeScript';
    component.level = 'Beginner';
    component.description = '';
    component.saveSkill();

    expect(alertSpy).toHaveBeenCalledWith('Error al crear la habilidad.');
  });

  it('debería editar una habilidad existente', () => {
    component.isEditMode = true;
    component.currentSkillId = 1;
    component.name = 'JavaScript';
    component.level = 'Advanced';
    component.description = 'Updated JavaScript skills';
    const alertSpy = spyOn(window, 'alert');
    const navigateSpy = spyOn(mockRouter, 'navigate').and.callThrough();

    component.saveSkill();

    expect(alertSpy).toHaveBeenCalledWith('Habilidad actualizada exitosamente.');
    expect(navigateSpy).toHaveBeenCalledWith(['/skills']);
  });

  it('debería cargar los detalles de una habilidad para edición', () => {
    const spyLoadSkillDetails = spyOn(component, 'loadSkillDetails').and.callThrough();
    component.ngOnInit();
    expect(spyLoadSkillDetails).toHaveBeenCalled();
    expect(component.name).toBe('JavaScript');
    expect(component.level).toBe('Advanced');
    expect(component.description).toBe('JavaScript skills');
  });

  it('debería manejar error al cargar los detalles de una habilidad', () => {
    spyOn(mockSkillService, 'getSkillById').and.returnValue(throwError(() => new Error('Error al cargar detalles de habilidad')));
    const alertSpy = spyOn(window, 'alert');
    component.loadSkillDetails(1);
    expect(alertSpy).toHaveBeenCalledWith('No se pudo cargar los datos de la habilidad.');
  });

  it('debería redirigir al login si no hay token', () => {
    spyOn(mockStorageService, 'getSession').and.returnValue(null);
    const navigateSpy = spyOn(mockRouter, 'navigate');
    component.ngOnInit();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
