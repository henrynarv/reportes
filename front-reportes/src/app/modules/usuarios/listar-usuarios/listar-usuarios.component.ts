import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent {
  isModalOpen: boolean = false;
  selectedUser: Usuario | null = null;

  usuarios: Usuario[] = [];



  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios;

        const url = this.usuarios.map(usuario => usuario.urlImagen);
        console.log("Usuariosssssssssssss ", url);


        // Verifica si `imageUrl` está presente en el primer objeto de usuario

        // Verifica el contenido de imageUrl en cada Usuario
        // this.usuarios.forEach(usuario => {
        //   console.log(`Usuario ${usuario.nombres}: ${usuario.urlImagen}`);
        // });

      },
      error: (error) => {
        console.log("error", error);
      }
    })
  }

  getUrlImages(): (any[] | string) {
    return this.usuarios.map(usuario => usuario.urlImagen);
  }

  openModal(usuario: Usuario) {
    this.selectedUser = usuario;
    this.isModalOpen = true;

  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

}
