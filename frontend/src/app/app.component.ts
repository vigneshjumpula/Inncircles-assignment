import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { HelperDetailsService } from './services/helper-details.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  constructor(private helperDetailsService: HelperDetailsService) {}
  ngOnInit(){
    this.helperDetailsService.loadHelpers();
    //console.log(this.helperDetailsService.getHelpers());
  }
}
