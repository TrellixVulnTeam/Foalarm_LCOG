import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Horse } from '../../horse';
import { HorseService } from '../../horse/horse.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-camera-view',
  templateUrl: './camera-view.component.html',
  styleUrls: ['./camera-view.component.css']
})
export class CameraViewComponent implements OnInit {

  private horseKey: any;
  public horse$: Observable<Horse> | Observable<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hs: HorseService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.horseKey = this.activatedRoute.snapshot.params['id'];
    this.horse$ = this.hs.getHorse(this.horseKey);
  }

  /**
   * Santizes the videoURL to bypass XSS security
   * @param videoURL
   */
  public getSource(videoURL) {
    let source = `${videoURL}`;
    source = source.replace('watch?v=', 'v/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(source);
  }

}
