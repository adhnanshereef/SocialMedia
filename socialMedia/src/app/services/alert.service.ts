import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new BehaviorSubject<string[]>([]);
  alert$ = this.alertSubject.asObservable();
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setAlert(message: string, status?: number) {
    if (this.isBrowser) {
      const currentAlerts = this.alertSubject.getValue();
      const newAlerts = [...currentAlerts, message];
      if (status === 500) {
        if (!currentAlerts.includes(message)) {
          this.alertSubject.next(newAlerts);
        }
      } else {
        this.alertSubject.next(newAlerts);
      }
    }
  }

  removeFirstAlert() {
    const currentAlerts = this.alertSubject.getValue();
    if (currentAlerts.length > 0) {
      const newAlerts = currentAlerts.slice(1);
      this.alertSubject.next(newAlerts);
    }
  }

  // ngOnDestroy() {
  //   clearInterval(this.timer);
  // }
}
