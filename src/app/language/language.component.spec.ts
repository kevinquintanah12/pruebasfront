import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageComponent } from './language.component';
import { GraphqlLanguageService } from '../services/languages.servive';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

class MockGraphqlLanguageService {
  getLanguages(token: string) {
    return of({
      data: {
        languages: [
          { id: 1, name: 'English', proficiency: 'Fluent', startDate: '2020-01-01', endDate: '2023-01-01' },
          { id: 2, name: 'Spanish', proficiency: 'Intermediate', startDate: '2019-01-01', endDate: '2022-01-01' },
        ],
      },
    });
  }

  getLanguageById(id: number, token: string) {
    return of({
      data: {
        languageById: { id, name: 'English', proficiency: 'Fluent', startDate: '2020-01-01', endDate: '2023-01-01' },
      },
    });
  }

  createOrUpdateLanguage(languageData: any, token: string) {
    return of({
      data: { createLanguage: { ...languageData, id: 3 } },
    });
  }

  deleteLanguage(id: number, token: string) {
    return of({ data: { deleteLanguage: true } });
  }
}

class MockStorageService {
  getSession(key: string) {
    return 'mock-token';
  }
}

describe('LanguageComponent', () => {
  let component: LanguageComponent;
  let fixture: ComponentFixture<LanguageComponent>;
  let mockLanguageService: MockGraphqlLanguageService;
  let mockStorageService: MockStorageService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockLanguageService = new MockGraphqlLanguageService();
    mockStorageService = new MockStorageService();
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = { paramMap: of({ get: () => null }) } as any;

    await TestBed.configureTestingModule({
      declarations: [LanguageComponent],
      providers: [
        { provide: GraphqlLanguageService, useValue: mockLanguageService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el token al inicializar', () => {
    expect(component.token).toBe('mock-token');
  });

  it('debería cargar la lista de lenguas al inicializar', () => {
    const fetchLanguagesSpy = spyOn(component, 'fetchLanguages').and.callThrough();
    component.ngOnInit();
    expect(fetchLanguagesSpy).toHaveBeenCalled();
    expect(component.languages.length).toBe(2);
  });

  it('debería cargar los detalles de un idioma si hay un ID en los parámetros', () => {
    mockActivatedRoute = { paramMap: of({ get: () => '1' }) } as any;
    const loadLanguageDetailsSpy = spyOn(component, 'loadLanguageDetails').and.callThrough();
    component.ngOnInit();
    expect(loadLanguageDetailsSpy).toHaveBeenCalledWith(1);
    expect(component.name).toBe('English');
  });

  it('debería guardar un nuevo idioma correctamente', () => {
    const createOrUpdateLanguageSpy = spyOn(mockLanguageService, 'createOrUpdateLanguage').and.callThrough();
    component.name = 'German';
    component.proficiency = 'Beginner';
    component.startDate = '2021-01-01';
    component.endDate = '2023-01-01';

    component.saveLanguage();
    expect(createOrUpdateLanguageSpy).toHaveBeenCalledWith(
      { name: 'German', proficiency: 'Beginner', startDate: '2021-01-01', endDate: '2023-01-01' },
      'mock-token'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería actualizar un idioma existente correctamente', () => {
    component.isEditMode = true;
    component.currentLanguageId = 1;
    component.name = 'Updated English';
    component.proficiency = 'Advanced';
    component.startDate = '2020-01-01';
    component.endDate = '2024-01-01';

    const createOrUpdateLanguageSpy = spyOn(mockLanguageService, 'createOrUpdateLanguage').and.callThrough();
    component.saveLanguage();
    expect(createOrUpdateLanguageSpy).toHaveBeenCalledWith(
      { id: 1, name: 'Updated English', proficiency: 'Advanced', startDate: '2020-01-01', endDate: '2024-01-01' },
      'mock-token'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería eliminar un idioma correctamente', () => {
    const deleteLanguageSpy = spyOn(mockLanguageService, 'deleteLanguage').and.callThrough();
    component.deleteLanguage(1);
    expect(deleteLanguageSpy).toHaveBeenCalledWith(1, 'mock-token');
  });

  it('debería restablecer el formulario correctamente', () => {
    component.name = 'French';
    component.proficiency = 'Intermediate';
    component.startDate = '2018-01-01';
    component.endDate = '2022-01-01';
    component.resetForm();
    expect(component.name).toBe('');
    expect(component.proficiency).toBe('');
    expect(component.startDate).toBe('');
    expect(component.endDate).toBe('');
  });

  it('debería manejar el error al cargar lenguas', () => {
    spyOn(mockLanguageService, 'getLanguages').and.returnValue(throwError(() => new Error('Error de carga')));
    const consoleSpy = spyOn(console, 'error');
    component.fetchLanguages();
    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar lenguas:', jasmine.any(Error));
  });
});
