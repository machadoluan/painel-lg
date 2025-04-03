import { Component, inject, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router, RouterLink } from '@angular/router';
import { SheetCreateComponent } from '../sheet-create/sheet-create.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slidebar-mobile',
  imports: [RouterLink, CommonModule],
  templateUrl: './slidebar-mobile.component.html',
  styleUrl: './slidebar-mobile.component.scss'
})
export class SlidebarMobileComponent {
  private _bottomSheet = inject(MatBottomSheet);

  constructor(private router: Router) { }

  openBottomSheet(): void {
    this._bottomSheet.open(SheetCreateComponent);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

}
