import { Component, OnInit } from '@angular/core';
import { GraphqlWorkExperienceService } from '../services/workexperience.service';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router'; // Importar Router y ActivatedRoute

@Component({
  selector: 'app-workexperience',
  templateUrl: './workexperience.component.html',
  styleUrls: ['./workexperience.component.css'],
})
export class WorkexperienceComponent implements OnInit {
  role: string = '';
  company: string = '';
  accomplishments: string = '';
  startDate: string = '';
  endDate: string = '';
  location: string = '';
  id: number | null = null; // Usar `id` para identificar creación o edición

  token: string = '';

  constructor(
    private workExperienceService: GraphqlWorkExperienceService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute // Para obtener parámetros de la ruta
  ) {}

  ngOnInit(): void {
    this.token = this.storageService.getSession('token');
    if (!this.token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
    }

    // Verificar si estamos editando una experiencia
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.id = +params['id'];
        this.loadWorkExperience(this.id);
      }
    });
  }

  /**
   * Cargar los datos de una experiencia laboral para edición.
   * @param id ID de la experiencia laboral.
   */
  loadWorkExperience(id: number): void {
    if (!this.token) {
      alert('Token no encontrado. Inicia sesión nuevamente.');
      return;
    }
  
    this.workExperienceService.getWorkExperienceById(id, this.token).subscribe(
      (response: any) => {
        const experience = response.data.experienceById;
        if (experience) {
          this.role = experience.role;
          this.company = experience.company;
          this.accomplishments = experience.accomplishments.join(', ');
          this.startDate = experience.startDate;
          this.endDate = experience.endDate;
          this.location = experience.location;
        } else {
          alert('No se encontró la experiencia laboral.');
        }
      },
      (error) => {
        console.error('Error al cargar la experiencia laboral:', error);
        alert('Hubo un error al cargar la experiencia laboral.');
      }
    );
  }
  

  /**
   * Guardar o actualizar una experiencia laboral.
   */
  saveWorkExperience(): void {
    if (!this.token) {
      alert('Token no encontrado. Inicia sesión nuevamente.');
      return;
    }

    const workExperience = {
      role: this.role,
      company: this.company,
      accomplishments: this.accomplishments.split(','),
      startDate: this.startDate,
      endDate: this.endDate,
      location: this.location,
    };

    if (this.id) {
      // Actualizar experiencia existente
      this.workExperienceService
        .updateExperience(this.id, workExperience, this.token)
        .subscribe(
          (response: any) => {
            console.log('Experiencia laboral actualizada:', response.data.updateWorkExperience);
            alert('Experiencia laboral actualizada exitosamente');
            this.router.navigate(['/workexperience']);
          },
          (error) => this.handleError(error)
        );
    } else {
      // Crear nueva experiencia
      this.workExperienceService.createExperience(workExperience, this.token).subscribe(
        (response: any) => {
          console.log('Experiencia laboral creada:', response.data.createWorkExperience);
          alert('Experiencia laboral creada exitosamente');
          this.resetForm();
          this.router.navigate(['/workexperience']);
        },
        (error) => this.handleError(error)
      );
    }
  }

  /**
   * Manejar errores de las operaciones.
   */
  handleError(error: any): void {
    if (error.graphQLErrors?.length) {
      console.error('GraphQL Errors:', error.graphQLErrors);
      alert(`Error de GraphQL: ${error.graphQLErrors[0].message}`);
    } else if (error.networkError) {
      console.error('Network Error:', error.networkError);
      alert('Error de red: No se pudo conectar al servidor.');
    } else {
      console.error('Error desconocido:', error);
      alert('Ocurrió un error desconocido.');
    }
  }

  /**
   * Restablecer el formulario.
   */
  resetForm(): void {
    this.role = '';
    this.company = '';
    this.accomplishments = '';
    this.startDate = '';
    this.endDate = '';
    this.location = '';
    this.id = null; // Resetear el ID
  }
}
