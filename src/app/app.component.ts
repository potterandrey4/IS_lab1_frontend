import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {HeaderModule} from '../header/header.module';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, RouterLink, HeaderModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'Lab1';
}
