import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlarmService } from '../../alarm/alarm.service';
import { Alarm } from '../../alarm';

@Component({
  selector: 'app-alarm-link',
  templateUrl: './alarm-link.component.html',
  styleUrls: ['./alarm-link.component.css']
})
export class AlarmLinkComponent implements OnInit {

  @Input() report: any;
  alarm$: Observable<Alarm> | Observable<{}> | null;

  constructor(private alarmService: AlarmService) { }

  ngOnInit() {
    this.alarm$ = this.alarmService.getAlarm(this.report.alarmId);
  }
}
