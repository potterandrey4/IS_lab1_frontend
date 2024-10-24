import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css'
})

export class ControlPanelComponent {
	constructor(private authService: AuthService, private router: Router) {}

	create_object() {
		this.router.navigate(['/control-panel/create']);
	}

	edit_object() {
		this.router.navigate(['/control-panel/edit']);
	}

	delete_object() {
		this.router.navigate(['/control-panel/delete']);
	}
}
