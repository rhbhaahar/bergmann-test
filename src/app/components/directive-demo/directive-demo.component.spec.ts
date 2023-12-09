import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectiveDemoComponent } from './directive-demo.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DirectiveDemoComponent', () => {
  let component: DirectiveDemoComponent;
  let fixture: ComponentFixture<DirectiveDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DirectiveDemoComponent, RouterTestingModule, BrowserAnimationsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(DirectiveDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
