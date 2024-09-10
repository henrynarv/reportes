import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home/home.component';
import { ActualizarUsuarioComponent } from './modules/usuarios/actualizar-usuario/actualizar-usuario.component';
import { ListarUsuariosComponent } from './modules/usuarios/listar-usuarios/listar-usuarios.component';
import { RegistrarComponent } from './modules/autenticacion/registrar/registrar.component';
import { LoginComponent } from './modules/autenticacion/login/login.component';
import { PasswordRecoveryComponent } from './modules/password-recovery/password-recovery/password-recovery.component';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
import { ActualizarUsuarioAutenticationFaceComponent } from './modules/usuarios/actualizar-usuario-autentication-face/actualizar-usuario-autentication-face.component';
import { ResetearPasswordComponent } from './modules/password-recovery/resetear-password/resetear-password.component';
import { ImagenUploadComponent } from './modules/imagenes-banner/imagen-upload/imagen-upload.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: PasswordRecoveryComponent },
  { path: 'reset-password', component: ResetearPasswordComponent },
  { path: 'registrar-usuario', component: RegistrarComponent },
  { path: 'listar-usuarios', component: ListarUsuariosComponent },
  { path: 'actualizar-usuario', component: ActualizarUsuarioComponent },
  { path: 'actualizar-usuarioF', component: ActualizarUsuarioAutenticationFaceComponent },
  { path: 'var', component: NavbarComponent },
  { path: 'imagen-banner-upload', component: ImagenUploadComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
