import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { GraphqlHeaderService } from '../services/header.service';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class MockGraphqlHeaderService {
  createHeader(headerData: any, token: string) {
    return of({ data: { createHeader: { id: 1, ...headerData } } });
  }

  updateHeader(headerData: any, token: string) {
    return of({ data: { updateHeader: headerData } });
  }

  getHeaderById(id: number, token: string) {
    return of({
      data: {
        headerById: {
          id,
          name: 'Test Name',
          description: 'Test Description',
          imageUrl: 'https://example.com/image.png',
          email: 'test@example.com',
          phoneNumber: '123456789',
          location: 'Test Location',
          github: 'https://github.com/test',
        },
      },
    });
  }
}

class MockStorageService {
  getSession(key: string) {
    return 'mock-token';
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockHeaderService: MockGraphqlHeaderService;
  let mockStorageService: MockStorageService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockHeaderService = new MockGraphqlHeaderService();
    mockStorageService = new MockStorageService();
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = { paramMap: of({ get: () => '1' }) } as any;

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: GraphqlHeaderService, useValue: mockHeaderService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el token al inicializar', () => {
    expect(component.token).toBe('mock-token');
  });

  it('debería cargar los detalles del header si hay un ID en los parámetros', () => {
    const loadHeaderDetailsSpy = spyOn(component, 'loadHeaderDetails').and.callThrough();
    component.ngOnInit();
    expect(loadHeaderDetailsSpy).toHaveBeenCalledWith(1);
  });

  it('debería guardar un nuevo header correctamente', () => {
    const createHeaderSpy = spyOn(mockHeaderService, 'createHeader').and.callThrough();
    component.name = 'New Header';
    component.description = 'Description';
    component.email = 'email@example.com';

    component.saveHeader();
    expect(createHeaderSpy).toHaveBeenCalledWith(
      {
        name: 'New Header',
        description: 'Description',
        imageUrl: null,
        email: 'email@example.com',
        phoneNumber: null,
        location: null,
        github: null,
      },
      'mock-token'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debería actualizar un header existente correctamente', () => {
    const updateHeaderSpy = spyOn(mockHeaderService, 'updateHeader').and.callThrough();
    component.isEditMode = true;
    component.currentHeaderId = 1;
    component.name = 'Updated Header';
    component.description = 'Updated Description';
    component.email = 'updated@example.com';

    component.saveHeader();
    expect(updateHeaderSpy).toHaveBeenCalledWith(
      {
        idHeader: 1,
        name: 'Updated Header',
        description: 'Updated Description',
        imageUrl: null,
        email: 'updated@example.com',
        phoneNumber: null,
        location: null,
        github: null,
      },
      'mock-token'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debería resetear el formulario correctamente', () => {
    component.name = 'Header';
    component.description = 'Description';
    component.resetForm();
    expect(component.name).toBe('');
    expect(component.description).toBe('');
    expect(component.isEditMode).toBeFalse();
  });

  it('debería redirigir al usuario al login si no hay token', () => {
    spyOn(mockStorageService, 'getSession').and.returnValue(null);
    const navigateSpy = spyOn(mockRouter, 'navigate');
    component.ngOnInit();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('debería cargar los datos del header al llamar a loadHeaderDetails', () => {
    component.loadHeaderDetails(1);
    expect(component.name).toBe('Test Name');
    expect(component.description).toBe('Test Description');
    expect(component.email).toBe('test@example.com');
  });
});
