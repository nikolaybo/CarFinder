import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
})
export class BottomSheetComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true })
  readonly container!: ViewContainerRef;

  private readonly bottomSheetRef = inject(MatBottomSheetRef<MatBottomSheetRef>);
  readonly data = inject<{ component: Type<unknown> }>(MAT_BOTTOM_SHEET_DATA);

  ngOnInit(): void {
    if (this.data?.component) {
      this.loadComponent(this.data.component);
    }
  }

  loadComponent(component: Type<unknown>): void {
    this.container.clear();
    this.container.createComponent(component);
  }

  closeSheet(): void {
    this.bottomSheetRef.dismiss();
  }
}
