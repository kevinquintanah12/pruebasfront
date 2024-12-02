import { Component, OnInit } from '@angular/core';
import { GraphqlEducationService } from '../services/education.service';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router'; // Importar Router y ActivatedRoute

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
})
export class EducationComponent implements OnInit {
  degree: string = '';
  university: string = '';
  startDate: string = '';
  endDate: string = '';
  token: string = '';
  degrees: any[] = [];
  isEditMode: boolean = false; // Indica si estamos editando
  currentEducationId: number | null = null; // ID del título actual (en caso de edición)

  constructor(
    private educationService: GraphqlEducationService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute // Inyectar ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.storageService.getSession('token');
    if (!this.token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
      return;
    }

    // Verificar si hay un ID en los parámetros de la URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.currentEducationId = +id; // Convertir a número
        this.isEditMode = true;
        this.loadEducationDetails(this.currentEducationId); // Cargar datos existentes
      }
    });

    this.fetchDegrees();
  }

  /**
   * Cargar la lista de títulos desde el servidor.
   */
  fetchDegrees(): void {
    if (!this.token) return;

    this.educationService.getDegrees(null, this.token).subscribe(
      (response: any) => {
        this.degrees = response.data.degrees;
        console.log('Títulos cargados:', this.degrees);
      },
      (error) => {
        console.error('Error al cargar títulos:', error);
      }
    );
  }

  /**
   * Guardar un título académico (crear o actualizar).
   */
  saveEducation(): void {
    if (!this.token) {
      alert('Token no encontrado. Inicia sesión nuevamente.');
      return;
    }
  
    // Crea el objeto de datos de educación
    const educationData: any = {
      degree: this.degree,
      university: this.university,
      startDate: this.startDate,
      endDate: this.endDate,
    };
  
    // Si estamos en modo de edición, añadir el ID
    if (this.isEditMode && this.currentEducationId) {
      educationData.id = this.currentEducationId; // Agregar el ID solo si estamos editando
    }
  
    // Llamar al servicio para guardar o actualizar el título académico
    this.educationService.createOrUpdateEducation(educationData, this.token).subscribe(
      (response: any) => {
        console.log('Título académico guardado:', response.data.createOrUpdateEducation);
        alert('Título académico guardado exitosamente');
        this.resetForm();
        this.fetchDegrees();
        this.router.navigate(['/education']); // Navegar a la lista
      },
      (error) => {
        console.error('Error al guardar título académico:', error);
        alert('Hubo un error al guardar el título académico.');
      }
    );
  }
  

  /**
   * Restablecer los campos del formulario.
   */
  resetForm(): void {
    this.degree = '';
    this.university = '';
    this.startDate = '';
    this.endDate = '';
    this.isEditMode = false;
    this.currentEducationId = null;
  }

  /**
   * Eliminar un título académico.
   * @param id ID del título a eliminar.
   */
  deleteEducation(id: number): void {
    if (!this.token) return;

    this.educationService.deleteEducation(id, this.token).subscribe(
      (response: any) => {
        console.log('Título eliminado:', response.data.deleteEducation);
        alert('Título eliminado exitosamente');
        this.fetchDegrees();
      },
      (error) => {
        console.error('Error al eliminar título académico:', error);
        alert('Hubo un error al eliminar el título académico.');
      }
    );
  }

  loadEducationDetails(id: number): void {
    if (!this.token) return;
  
    this.educationService.getDegreeById(id, this.token).subscribe(
      (response: any) => {
        const degreeData = response.data.degreeById;
        if (degreeData) {
          this.degree = degreeData.degree;
          this.university = degreeData.university;
          this.startDate = degreeData.startDate;
          this.endDate = degreeData.endDate;
        }
      },
      (error) => {
        console.error('Error al cargar detalles del título:', error);
        alert('No se pudo cargar los datos del título.');
      }
    );
  }
}
