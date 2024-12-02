import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GraphqlHeaderService } from '../services/header.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // Propiedades del formulario
  name: string = '';
  description: string = '';
  imageUrl: string = '';
  email: string = '';
  phoneNumber: string = '';
  location: string = '';
  github: string = '';

  token: string = '';
  isEditMode: boolean = false; // Indica si estamos en modo edición
  currentHeaderId: number | null = null; // ID del header actual (en caso de edición)

  constructor(
    private headerService: GraphqlHeaderService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtén el token desde el almacenamiento de sesión
    this.token = this.storageService.getSession('token');
    if (!this.token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
      this.router.navigate(['/login']);
    }

    // Detectar si estamos en modo edición basado en el parámetro de la URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.currentHeaderId = +id; // Convertir el ID a número
        this.isEditMode = true;
        this.loadHeaderDetails(this.currentHeaderId); // Cargar los datos del header
      }
    });
  }

  /**
   * Maneja la acción de guardar o actualizar un header.
   */
  saveHeader(): void {
    if (!this.token) {
      alert('Token no encontrado. Inicia sesión nuevamente.');
      return;
    }

    const headerData: any = {
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl || null,
      email: this.email,
      phoneNumber: this.phoneNumber || null,
      location: this.location || null,
      github: this.github || null,
    };

    if (this.isEditMode && this.currentHeaderId) {
      headerData.idHeader = this.currentHeaderId; // Añadir el ID si estamos en modo edición
      this.headerService.updateHeader(headerData, this.token).subscribe(
        (response: any) => {
          console.log('Header actualizado:', response.data.updateHeader);
          alert('Header actualizado exitosamente.');
          this.resetForm();
          this.router.navigate(['/dashboard']); // Redirigir al dashboard
        },
        (error) => {
          console.error('Error al actualizar header:', error);
          alert('Error al actualizar el header.');
        }
      );
    } else {
      this.headerService.createHeader(headerData, this.token).subscribe(
        (response: any) => {
          console.log('Header creado:', response.data.createHeader);
          alert('Header creado exitosamente.');
          this.resetForm();
          this.router.navigate(['/dashboard']); // Redirigir al dashboard
        },
        (error) => {
          console.error('Error al crear header:', error);
          alert('Error al crear el header.');
        }
      );
    }
  }

  /**
   * Cargar los detalles de un header específico para editarlo.
   * @param id ID del header a cargar.
   */
  loadHeaderDetails(id: number): void {
    if (!this.token) return;

    this.headerService.getHeaderById(id, this.token).subscribe(
      (response: any) => {
        const headerData = response.data.headerById;
        if (headerData) {
          this.name = headerData.name;
          this.description = headerData.description;
          this.imageUrl = headerData.imageUrl;
          this.email = headerData.email;
          this.phoneNumber = headerData.phoneNumber;
          this.location = headerData.location;
          this.github = headerData.github;
        }
      },
      (error) => {
        console.error('Error al cargar detalles del header:', error);
        alert('No se pudo cargar los datos del header.');
      }
    );
  }

  /**
   * Restablece los campos del formulario.
   */
  resetForm(): void {
    this.name = '';
    this.description = '';
    this.imageUrl = '';
    this.email = '';
    this.phoneNumber = '';
    this.location = '';
    this.github = '';
    this.isEditMode = false;
    this.currentHeaderId = null;
  }
}
