import { Component, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-sheet',
  imports: [],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss'
})
export class BottomSheetComponent implements OnInit {

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<MatBottomSheetRef>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { component: Component }
  ) {}

  ngOnInit(): void {
    if (this.data?.component) {
      this.loadComponent(this.data.component);
    }
  }

  loadComponent(component: any): void {
    this.container.clear();
    this.container.createComponent(component);
  }

  closeSheet(): void {
    this.bottomSheetRef.dismiss();
  }

}
