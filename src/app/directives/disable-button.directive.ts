
import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[checkAccess]',
  providers: [MatTooltip]
})
export class DisableButtonDirective implements OnChanges {
  @Input() isViewerDisabled: boolean = false;
  @Input() viewerTooltip: string = 'No access'

  constructor(private el: ElementRef, 
              private matButton: MatButton,
              private tooltip: MatTooltip,
              private renderer: Renderer2) {
    
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.isViewerDisabled) {
      this.tooltip.position = 'above';
      this.tooltip.message = this.viewerTooltip;
      this.tooltip.show();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.tooltip.hide();
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes?.['isViewerDisabled']){
      this.updateState();
    }
  }

  updateState() {
    if (this.isViewerDisabled) {
      this.matButton.disabled = true;
      this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'unset')
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed')
    } else {
      this.matButton.disabled = false;
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer')
    }
  }
}
