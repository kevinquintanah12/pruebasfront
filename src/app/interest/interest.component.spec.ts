import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterestComponent } from './interest.component';
import { GraphqlInterestService } from '../services/interest.services';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { throwError } from 'rxjs';

class MockGraphqlInterestService {
  getInterests(token: string) {
    return of({
      data: {
        interests: [
          { id: 1, name: 'Music', description: 'Loves music' },
          { id: 2, name: 'Sports', description: 'Enjoys soccer' },
        ],
      },
    });
  }

  getInterestById(id: number, token: string) {
    return of({
      data: {
        interestById: { id, name: 'Music', description: 'Loves music' },
      },
    });
  }

  saveInterest(interestData: any, token: string) {
    if (interestData.idInterest) {
      return of({
        data: { updateInterest: { ...interestData } },
      });
    } else {
      return of({
        data: { createInterest: { id: 3, ...interestData } },
      });
    }
  }

  deleteInterest(id: number, token: string) {
    return of({ data: { deleteInterest: true } });
  }
}

class MockStorageService {
  getSession(key: string) {
    return 'mock-token';
  }
}

describe('InterestComponent', () => {
  let component: InterestComponent;
  let fixture: ComponentFixture<InterestComponent>;
  let mockInterestService: MockGraphqlInterestService;
  let mockStorageService: MockStorageService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockInterestService = new MockGraphqlInterestService();
    mockStorageService = new MockStorageService();
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = { paramMap: of({ get: () => null }) } as any;

    await TestBed.configureTestingModule({
      declarations: [InterestComponent],
      providers: [
        { provide: GraphqlInterestService, useValue: mockInterestService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el token al inicializar', () => {
    expect(component.token).toBe('mock-token');
  });

  it('debería cargar la lista de intereses al inicializar', () => {
    const fetchInterestsSpy = spyOn(component, 'fetchInterests').and.callThrough();
    component.ngOnInit();
    expect(fetchInterestsSpy).toHaveBeenCalled();
    expect(component.interests.length).toBe(2);
  });

  it('debería cargar los detalles de un interés si hay un ID en los parámetros', () => {
    mockActivatedRoute = { paramMap: of({ get: () => '1' }) } as any;
    const fetchInterestByIdSpy = spyOn(component, 'fetchInterestById').and.callThrough();
    component.ngOnInit();
    expect(fetchInterestByIdSpy).toHaveBeenCalledWith(1);
    expect(component.name).toBe('Music');
  });

  it('debería guardar un nuevo interés correctamente', () => {
    const saveInterestSpy = spyOn(mockInterestService, 'saveInterest').and.callThrough();
    component.name = 'Reading';
    component.description = 'Loves reading books';

    component.saveInterest();
    expect(saveInterestSpy).toHaveBeenCalledWith(
      { name: 'Reading', description: 'Loves reading books' },
      'mock-token'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/interest']);
  });

  it('debería actualizar un interés existente correctamente', () => {
    const saveInterestSpy = spyOn(mockInterestService, 'saveInterest').and.callThrough();
    component.interestId = 1;
    component.name = 'Updated Interest';
    component.description = 'Updated description';

    component.saveInterest();
    expect(saveInterestSpy).toHaveBeenCalledWith(
      { idInterest: 1, name: 'Updated Interest', description: 'Updated description' },
      'mock-token'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/interest']);
  });

  it('debería eliminar un interés correctamente', () => {
    const deleteInterestSpy = spyOn(mockInterestService, 'deleteInterest').and.callThrough();
    component.deleteInterest(1);
    expect(deleteInterestSpy).toHaveBeenCalledWith(1, 'mock-token');
  });

  it('debería restablecer el formulario correctamente', () => {
    component.name = 'Interest';
    component.description = 'Description';
    component.resetForm();
    expect(component.name).toBe('');
    expect(component.description).toBe('');
    expect(component.interestId).toBeNull();
  });


// Ajustar la prueba para manejar el flujo de error:
  it('debería manejar el error al cargar intereses', () => {
    spyOn(mockInterestService, 'getInterests').and.returnValue(throwError(() => new Error('Error de carga')));
    const consoleSpy = spyOn(console, 'error');
    
    component.fetchInterests();
    
    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar intereses:', jasmine.any(Error));
  });

});
