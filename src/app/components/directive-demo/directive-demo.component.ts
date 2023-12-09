import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import DirectivesModule from 'src/app/directives/directives.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-directive-demo',
  standalone: true,
  templateUrl: './directive-demo.component.html',
  styleUrls: ['./directive-demo.component.scss'],
  imports: [DirectivesModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, MatCardModule, MatSlideToggleModule, FormsModule, MatInputModule]
})
export class DirectiveDemoComponent {
  userHasAccess = true;
  tooltipMessage = 'Нет доступа';
}
