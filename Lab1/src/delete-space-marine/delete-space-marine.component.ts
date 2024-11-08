import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpaceMarineService } from '../services/space-marine.service';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
	selector: 'app-delete-space-marine',
	templateUrl: './delete-space-marine.component.html',
	styleUrls: ['./delete-space-marine.component.css'],
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
	]
})
export class DeleteSpaceMarineComponent {
	spaceMarineId!: number;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private spaceMarineService: SpaceMarineService
	) {
		const id = this.route.snapshot.paramMap.get('id');
		this.spaceMarineId = id ? Number(id) : NaN;
		if (isNaN(this.spaceMarineId)) {
			this.toastr.error('Неверный идентификатор SpaceMarine');
			this.router.navigate(['/control-panel']);
		}
	}

	onDelete() {
		if (!confirm('Вы уверены, что хотите удалить этого SpaceMarine?')) {
			return;
		}

		this.spaceMarineService.delete(this.spaceMarineId).subscribe(
			() => {
				this.toastr.success('SpaceMarine успешно удален');
				this.router.navigate(['/control-panel']);
			},
			error => {
				this.toastr.error('Ошибка при удалении SpaceMarine');
			}
		);
	}
}
