import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[forceNumericKeyboard]'
})
export class ForceNumericKeyboardDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const input = this.el.nativeElement.querySelector('input');
    if (input) {
      input.setAttribute('inputmode', 'numeric'); // Força o teclado numérico
      input.setAttribute('pattern', '[0-9]*'); // Aceita só números
      input.setAttribute('type', 'tel'); // Abre o teclado numérico em mais dispositivos
    }
  }
}
