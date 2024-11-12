import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { SignInComponent } from '../signin/signin.component';
import { SignUpComponent } from '../signup/signup.component';
import { EditSpaceMarineComponent } from '../edit-space-marine/edit-space-marine.component';
import { CreateSpaceMarineComponent } from '../create-space-marine/create-space-marine.component';
import { ControlPanelComponent } from '../control-panel/control-panel.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: SignInComponent },
	{ path: 'signup', component: SignUpComponent },

	{ path: 'control-panel', component: ControlPanelComponent, canActivate: [AuthGuard] },
	{ path: 'control-panel/create', component: CreateSpaceMarineComponent, canActivate: [AuthGuard] },
	{ path: 'control-panel/edit/:id', component: EditSpaceMarineComponent, canActivate: [AuthGuard] }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
