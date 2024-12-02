import { Component, OnInit } from '@angular/core';
import { GraphqlInterestService } from '../services/interest.services';
import { StorageService } from '../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css'],
})
export class InterestComponent implements OnInit {
  name: string = '';
  description: string = '';
  token: string = '';
  interests: any[] = [];
  interestId: number | null = null; // Para almacenar el id de un interés que se edita.

  constructor(
    private interestService: GraphqlInterestService,
    private storageService: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute // Para obtener parámetros de la URL.
  ) {}

  ngOnInit(): void {
    this.token = this.storageService.getSession('token');
    if (!this.token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
    } else {
      this.fetchInterests();
    }

    // Verificar si hay un id en los parámetros de la URL (indica que se quiere editar un interés).
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.interestId = +id; // Convertir el id a número
        this.fetchInterestById(this.interestId); // Cargar los datos del interés para editar.
      }
    });
  }

  /**
   * Cargar la lista de intereses desde el servidor.
   */
  fetchInterests(): void {
    if (!this.token) return;

    this.interestService.getInterests(this.token).subscribe(
      (response: any) => {
        this.interests = response.data.interests;
        console.log('Intereses cargados:', this.interests);
      },
      (error) => {
        console.error('Error al cargar intereses:', error);
      }
    );
  }

  /**
   * Cargar un interés específico por ID para editarlo.
   * @param id El ID del interés a cargar.
   */
  fetchInterestById(id: number): void {
    if (!this.token) return;

    this.interestService.getInterestById(id, this.token).subscribe(
      (response: any) => {
        const interest = response.data.interestById;
        if (interest) {
          this.name = interest.name;
          this.description = interest.description;
        }
      },
      (error) => {
        console.error('Error al cargar el interés para editar:', error);
      }
    );
  }

  /**
   * Guardar un nuevo interés o actualizar uno existente.
   */
  saveInterest(): void {
    if (!this.token) {
      alert('Token no encontrado. Inicia sesión nuevamente.');
      return;
    }

    const interestData = {
      name: this.name,
      description: this.description,
    };

    if (this.interestId) {
      // Si hay un id, actualiza el interés
      this.interestService.saveInterest(
        { idInterest: this.interestId, ...interestData },
        this.token
      ).subscribe(
        (response: any) => {
          console.log('Interés actualizado:', response.data.updateInterest);
          alert('Interés actualizado exitosamente');
          this.resetForm();
          this.fetchInterests();
          this.router.navigate(['/interest']);
        },
        (error) => {
          console.error('Error al actualizar interés:', error);
          alert('Hubo un error al actualizar el interés.');
        }
      );
    } else {
      // Si no hay id, crea un nuevo interés
      this.interestService.saveInterest(interestData, this.token).subscribe(
        (response: any) => {
          console.log('Interés creado:', response.data.createInterest);
          alert('Interés creado exitosamente');
          this.resetForm();
          this.fetchInterests();
          this.router.navigate(['/interest']);
        },
        (error) => {
          console.error('Error al crear interés:', error);
          alert('Hubo un error al crear el interés.');
        }
      );
    }
  }

  /**
   * Eliminar un interés.
   * @param id ID del interés a eliminar.
   */
  deleteInterest(id: number): void {
    if (!this.token) return;

    this.interestService.deleteInterest(id, this.token).subscribe(
      (response: any) => {
        console.log('Interés eliminado:', response.data.deleteInterest);
        alert('Interés eliminado exitosamente');
        this.fetchInterests();
      },
      (error) => {
        console.error('Error al eliminar interés:', error);
        alert('Hubo un error al eliminar el interés.');
      }
    );
  }

  /**
   * Restablecer los campos del formulario.
   */
  resetForm(): void {
    this.name = '';
    this.description = '';
    this.interestId = null;
  }
}
