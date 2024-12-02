import { Component, OnInit } from '@angular/core';
import { GraphqlLanguageService } from '../services/languages.servive';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css'],
})
export class LanguageComponent implements OnInit {
  name: string = '';
  proficiency: string = '';
  startDate: string = '';
  endDate: string = '';
  token: string = '';
  languages: any[] = [];

  isEditMode: boolean = false; // Indica si estamos editando
  currentLanguageId: number | null = null; // ID del título actual (en caso de edición)


  constructor(
    private languageService: GraphqlLanguageService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute // Inyectar ActivatedRoute

  ) {}

  ngOnInit(): void {
    this.token = this.storageService.getSession('token');
    if (!this.token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
    } else {
      this.fetchLanguages();
    }
  

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.currentLanguageId = +id; // Convertir a número
        this.isEditMode = true;
        this.loadLanguageDetails(this.currentLanguageId); // Cargar datos existentes
      }
    });

    this.fetchLanguages();
  }

  /**
   * Cargar la lista de lenguas desde el servidor.
   */
  fetchLanguages(): void {
    if (!this.token) return;

    this.languageService.getLanguages(this.token).subscribe(
      (response: any) => {
        this.languages = response.data.languages;
        console.log('Lenguas cargadas:', this.languages);
      },
      (error) => {
        console.error('Error al cargar lenguas:', error);
      }
    );
  }

  /**
   * Guardar una nueva lengua.
   */
  saveLanguage(): void {
    if (!this.token) {
      alert('Token no encontrado. Inicia sesión nuevamente.');
      return;
    }

    const newLanguage: any = {
      name: this.name,
      proficiency: this.proficiency,
      startDate: this.startDate,
      endDate: this.endDate,
    };


    // Si estamos en modo de edición, añadir el ID
    if (this.isEditMode && this.currentLanguageId) {
      newLanguage.id = this.currentLanguageId; // Agregar el ID solo si estamos editando
    }

    this.languageService.createOrUpdateLanguage(newLanguage, this.token).subscribe(
      (response: any) => {
        console.log('Lengua creada:', response.data.createLanguage);
        alert('Lengua creada exitosamente');
        this.resetForm();
        this.fetchLanguages();
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error al crear lengua:', error);
        alert('Hubo un error al crear la lengua.');
      }
    );
  }

  /**
   * Eliminar una lengua.
   * @param id ID de la lengua a eliminar.
   */
  deleteLanguage(id: number): void {
    if (!this.token) return;

    this.languageService.deleteLanguage(id, this.token).subscribe(
      (response: any) => {
        console.log('Lengua eliminada:', response.data.deleteLanguage);
        alert('Lengua eliminada exitosamente');
        this.fetchLanguages();
      },
      (error) => {
        console.error('Error al eliminar lengua:', error);
        alert('Hubo un error al eliminar la lengua.');
      }
    );
  }


  loadLanguageDetails(id: number): void {
    if (!this.token) return;
  
    this.languageService.getLanguageById(id, this.token).subscribe(
      (response: any) => {
        const languageData = response.data.languageById;
        if (languageData) {
          this.name = languageData.name; // Cambiar a 'name'
          this.proficiency = languageData.proficiency; // Cambiar a 'proficiency'
          this.startDate = languageData.startDate; // Cambiar a 'startDate'
          this.endDate = languageData.endDate; // Cambiar a 'endDate'
        }
      },
      (error) => {
        console.error('Error al cargar detalles del idioma:', error);
        alert('No se pudo cargar los datos del idioma.');
      }
    );
  }
  

  /**
   * Restablecer los campos del formulario.
   */
  resetForm(): void {
    this.name = '';
    this.proficiency = '';
    this.startDate = '';
    this.endDate = '';
  }
}
