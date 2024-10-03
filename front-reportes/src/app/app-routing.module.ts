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
import { ReportarIncidenteComponent } from './modules/reportar/reportar-incidente/reportar-incidente.component';
import { TutorialAppComponent } from './components/tutorial-app/tutorial-app/tutorial-app.component';
import { MapaLibertadComponent } from './modules/mapa-svg-libertad/mapa-libertad/mapa-libertad.component';
import { authGuard } from './components/guard/auth.guard';
import { loginGuard } from './components/guard/login.guard';
import { adminGuard } from './components/guard/admin.guard';

import { NoAutorizadoComponent } from './components/no-autorizado/no-autorizado/no-autorizado.component';
import { ListarReportesComponent } from './modules/reportar/listar-reportes/listar-reportes.component';
import { HistorialReportesPorusuarioComponent } from './modules/historial-reportes-porusuario/historial-reportes-porusuario.component';



const routes: Routes = [
  { path: 'reportar-incidente', component: ReportarIncidenteComponent, canActivate: [authGuard] },
  { path: 'listar-reportes', component: ListarReportesComponent, canActivate: [authGuard] },
  { path: 'historial-reportes', component: HistorialReportesPorusuarioComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'forgot-password', component: PasswordRecoveryComponent },
  { path: 'reset-password', component: ResetearPasswordComponent },
  { path: 'registrar-usuario', component: RegistrarComponent },
  { path: 'listar-usuarios', component: ListarUsuariosComponent, canActivate: [adminGuard] },
  { path: 'actualizar-usuario', component: ActualizarUsuarioComponent },
  { path: 'actualizar-usuarioF', component: ActualizarUsuarioAutenticationFaceComponent },
  { path: 'var', component: NavbarComponent },
  { path: 'imagen-banner-upload', component: ImagenUploadComponent },
  { path: 'tutorial', component: TutorialAppComponent },
  { path: 'mapa-iteractivo', component: MapaLibertadComponent, canActivate: [adminGuard] },
  { path: 'no-autorizado', component: NoAutorizadoComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
