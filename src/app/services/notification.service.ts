import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBarRef
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  snackBarConfig: MatSnackBarConfig;
  snackBarRef: MatSnackBarRef<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  snackBarAutoHide = '1500';

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message, success) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = this.horizontalPosition;
    this.snackBarConfig.verticalPosition = this.verticalPosition;
    this.snackBarConfig.duration = parseInt(this.snackBarAutoHide, 0);
    if(success == 1) {
    this.snackBarConfig.panelClass = 'success-snackbar';
    } else {
      this.snackBarConfig.panelClass = 'error-snackbar';
    }
    this.snackBarRef = this.snackBar.open(message, '', this.snackBarConfig);
}
}
