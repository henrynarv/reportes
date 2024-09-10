import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.interface';

@Component({
  selector: 'app-modal-usuarios',
  templateUrl: './modal-usuarios.component.html',
  styleUrls: ['./modal-usuarios.component.css']
})
export class ModalUsuariosComponent {


  @Input() isOpen = false; //controla si el mosal esta abierto
  @Input() usuario: Usuario | null = null;
  @Output() close = new EventEmitter<void>() //evento para cerrar el  modal

  closeModal() {
    this.close.emit(); //emite el evento para cerrar el modal
  }

}
