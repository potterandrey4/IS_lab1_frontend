import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { SignInComponent } from '../signin/signin.component';
import { SignUpComponent } from '../signup/signup.component';
import { EditSpaceMarineComponent } from '../edit-space-marine/edit-space-marine.component';
import { CreateSpaceMarineComponent } from '../create-space-marine/create-space-marine.component';
import { DeleteSpaceMarineComponent } from '../delete-space-marine/delete-space-marine.component';
import { ControlPanelComponent } from '../control-panel/control-panel.component';
import { AuthGuard } from './auth.guard';  // Импорт AuthGuard

export const routes: Routes = [
	{ path: '', component: HomeComponent }, // Доступно всем
	{ path: 'login', component: SignInComponent }, // Доступно всем
	{ path: 'signup', component: SignUpComponent }, // Доступно всем

	// Защищённые маршруты
	{ path: 'control-panel', component: ControlPanelComponent, canActivate: [AuthGuard] },
	{ path: 'control-panel/create', component: CreateSpaceMarineComponent, canActivate: [AuthGuard] },
	{ path: 'control-panel/edit', component: EditSpaceMarineComponent, canActivate: [AuthGuard] },
	{ path: 'control-panel/delete', component: DeleteSpaceMarineComponent, canActivate: [AuthGuard] },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
