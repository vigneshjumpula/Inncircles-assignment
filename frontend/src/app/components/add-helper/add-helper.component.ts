import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { SteppersComponent } from '../steppers/steppers.component';
@Component({
  selector: 'app-add-helper',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SteppersComponent],
  templateUrl: './add-helper.component.html',
  styleUrls: ['./add-helper.component.scss']
})
export class AddHelperComponent {
  constructor(private router: Router) {}

  backToHelper() {
    this.router.navigate(['/main']);
  }
}
