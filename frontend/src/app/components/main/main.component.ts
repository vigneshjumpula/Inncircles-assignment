import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { LeftComponent } from '../left/left.component';
import { RouterOutlet } from '@angular/router';
import { RightComponent } from '../right/right.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, LeftComponent, RouterOutlet, RightComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent {

}
