import { Component, inject, ViewChild } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { CreateReportsComponent } from '../create-reports/create-reports.component';
import { CreateTripsComponent } from '../create-trips/create-trips.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sheet-create',
  imports: [MatBottomSheetModule],
  templateUrl: './sheet-create.component.html',
  styleUrl: './sheet-create.component.scss'
})
export class SheetCreateComponent {

  private _bottomSheetRef =
    inject<MatBottomSheetRef<SheetCreateComponent>>(MatBottomSheetRef);

    constructor(
      private route: Router
    ) {}

  openTrip(event: MouseEvent) {
    this.route.navigate(['/createTrip'])
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  openReports(event: MouseEvent) {
    this.route.navigate(['/createReport'])
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
