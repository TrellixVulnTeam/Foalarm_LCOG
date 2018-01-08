import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AlertHandlerService } from '../alert-handler.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Alarm } from '../alarm';

@Injectable()
export class AlarmService {

  alarms$: Observable<Alarm[]> | Observable<any>;
  activeAlarms$: Observable<Alarm[]> | Observable<any>;
  availAlarms$: Observable<Alarm[]> | Observable<any>;

  constructor(
    private db: FirestoreService,
    private alert: AlertHandlerService,
    private router: Router
  ) {

    // Define the alarms variables
    // All alarms
    this.alarms$ = this.db.col$('alarms', ref => ref.where('deleted', '==', false));
    // Alarms that are assigned to a horse
    this.activeAlarms$ = this.db.col$('alarms', ref => ref.where('state', '==', true).where('deleted', '==', false));
    // Alarms that are not assigned to a horse
    this.availAlarms$ = this.db.col$('alarms', ref => ref.where('state', '==', false).where('deleted', '==', false));
  }

  // Get all alarms
  get alarms(): Observable<Alarm[]> {
    return this.alarms$;
  }

  // Get all active alarms
  get activeAlarms(): Observable<Alarm[]> {
    return this.activeAlarms$;
  }

  get availAlarms(): Observable<Alarm[]> {
    return this.availAlarms$;
  }

  // Get an alarm instance by alarmID
  getAlarm(key: any) {
    return this.db.doc$(`alarms/${key}`);
  }

  // Firestore non-destructive update
  updateAlarmData(key: any, data: any) {
    console.log('Updating alarm: ', key);
    return this.db.update('alarms', key, data)
    .then(_ => this.router.navigate(['/profile/alarm-list']))
    .catch(error => console.log(error));
  }

  // Firstore set
  saveAlarmData(key: any, data: any) {
    console.log('Saving new alarm' + key);
    return this.db.set('alarms', data)
    .then(_ => this.router.navigate(['/profile/alarm-list']))
    .catch(error =>
      console.log(error));
  }

  // Delete alarm from Firestore - sets deleted to true
  deleteAlarm(alarm: Alarm) {
    console.log('Deleteing alarm' + alarm.id);
    if (alarm.state) {
      this.db.col('horses', a => a.where('alarmId', '==', alarm.id).where('deleted', '==', false).where('state', '==', true))
      .ref
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          const data = doc.data();
          if (data.alarmId === alarm.id) {
            doc.ref.update({alarmId: '', state: false});
          }
        });
      });
    }
    return this.db.delete('alarms', alarm.id)
    .then(_ => this.router.navigate(['/profile/alarm-list'])).catch(error => console.log(error));
  }

  testAlarm(key: any, data: any) {
    console.log('Testing Alarm SMS ', key);
    return this.db.update('data', key, data)
    .catch(error => console.log(error));
  }

}
