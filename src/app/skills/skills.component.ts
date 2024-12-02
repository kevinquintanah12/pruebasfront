import { Component, OnInit } from '@angular/core';
import { GraphqlSkillService } from '../services/skills.service';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit {
  name: string = '';
  level: string = '';
  description: string = '';
  token: string = '';
  skills: any[] = [];

  isEditMode: boolean = false; // Indica si estamos editando
  currentSkillId: number | null = null; // ID de la habilidad actual (en caso de edición)

  constructor(
    private skillService: GraphqlSkillService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.storageService.getSession('token');
    if (!this.token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
      this.router.navigate(['/login']);
    } else {
      this.fetchSkills();
    }

    // Detectar si estamos en modo edición basado en el parámetro de la URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.currentSkillId = +id; // Convertir el ID a número
        this.isEditMode = true;
        this.loadSkillDetails(this.currentSkillId); // Cargar los datos de la habilidad
      }
    });
  }

  /**
   * Cargar la lista de habilidades desde el servidor.
   */
  fetchSkills(): void {
    if (!this.token) return;

    this.skillService.getSkills(this.token).subscribe(
      (response: any) => {
        this.skills = response.data.skills;
        console.log('Habilidades cargadas:', this.skills);
      },
      (error) => {
        console.error('Error al cargar habilidades:', error);
        alert('Error al cargar habilidades.');
      }
    );
  }

  /**
   * Guardar o actualizar una habilidad.
   */
  saveSkill(): void {
    if (!this.token) {
      alert('Token no encontrado. Inicia sesión nuevamente.');
      return;
    }

    if (!this.name || !this.level || !this.description) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const skillData: any = {
      name: this.name,
      level: this.level,
      description: this.description,
    };

    // Si estamos en modo edición, añadimos el idSkill
    if (this.isEditMode && this.currentSkillId) {
      skillData.idSkill = this.currentSkillId; // Añadir el ID si estamos en modo edición
      this.skillService.updateSkill(skillData, this.token).subscribe(
        (response: any) => {
          console.log('Habilidad actualizada:', response.data.updateSkill);
          alert('Habilidad actualizada exitosamente.');
          this.resetForm();
          this.router.navigate(['/skills']);
        },
        (error) => {
          console.error('Error al actualizar habilidad:', error);
          alert('Error al actualizar la habilidad.');
        }
      );
    } else {
      this.skillService.createSkill(skillData, this.token).subscribe(
        (response: any) => {
          console.log('Habilidad creada:', response.data.createSkill);
          alert('Habilidad creada exitosamente.');
          this.resetForm();
          this.fetchSkills();
        },
        (error) => {
          console.error('Error al crear habilidad:', error);
          alert('Error al crear la habilidad.');
        }
      );
    }
  }

  /**
   * Cargar los detalles de una habilidad específica para editarla.
   * @param id ID de la habilidad a cargar.
   */
  loadSkillDetails(id: number): void {
    if (!this.token) return;

    this.skillService.getSkillById(id, this.token).subscribe(
      (response: any) => {
        const skillData = response.data.skillById;
        if (skillData) {
          this.name = skillData.name;
          this.level = skillData.level;
          this.description = skillData.description;
        }
      },
      (error) => {
        console.error('Error al cargar detalles de la habilidad:', error);
        alert('No se pudo cargar los datos de la habilidad.');
      }
    );
  }

  /**
   * Restablecer los campos del formulario.
   */
  resetForm(): void {
    this.name = '';
    this.level = '';
    this.description = '';
    this.isEditMode = false;
    this.currentSkillId = null;
  }
}
