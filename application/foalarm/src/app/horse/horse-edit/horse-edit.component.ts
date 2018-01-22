import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { Horse } from '../../horse';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { HorseService } from '../horse.service';
import { AuthService } from '../../core/auth.service';
import { User } from '../../user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertHandlerService } from '../../alert-handler.service';
import { FirestoreService } from '../../firestore.service';

@Component({
  selector: 'app-horse-edit',
  templateUrl: './horse-edit.component.html',
  styleUrls: ['./horse-edit.component.css']
})
export class HorseEditComponent implements OnInit {

  horseForm: FormGroup;

  public horseObject = {} as Horse;
  isNewHorse: boolean;
  horseKey: string;
  horse$: Observable<Horse> | Observable<any>;
  public alertString: string;
  public loading = false as Boolean;
  public loaded = true as Boolean;

  constructor(
    // private router: Router,
    private activatedRoute: ActivatedRoute,
    private horseService: HorseService,
    public authService: AuthService,
    public fb: FormBuilder,
    private alertHandler: AlertHandlerService,
    private db: FirestoreService
  ) { }

  ngOnInit() {
    // Get the key from the URL param
    this.horseKey = this.activatedRoute.snapshot.params['id'];
    // Is it a new horse
    this.isNewHorse = this.horseKey === 'new';
    // Retrieve the horse instance OR create a new object observable
    !this.isNewHorse ? this.getHorse() : this.horse$ = Observable.of({}) as Observable<Horse>;
    console.log(this.horseKey);

    // Subscribe to alertHandler for firebase registration errors
    this.alertHandler.registrationError$.subscribe((data) =>
      this.alertString = data);

    // Create horse form
    this.horseForm = this.fb.group({
      'displayName': ['', []],
      'owner': ['', []],
      'dueDate': ['', []],
      'camera': ['', []],
      'color': ['', []],
      'photoURL': ['', []]
    });
  }

  // Form Getters
  get displayName() { return this.horseForm.get('displayName'); }
  get owner() { return this.horseForm.get('owner'); }
  get dueDate() { return this.horseForm.get('dueDate'); }
  get camera() { return this.horseForm.get('camera'); }
  get color() { return this.horseForm.get('color'); }
  get photoURL() { return this.horseForm.get('photoURL'); }

  // Returns an observable of type Horse
  getHorse() {
    this.horse$ = this.horseService.getHorse(this.horseKey);
  }

  // Save a new horse Horse
  saveHorse(user: User, horse: Horse) {
    return this.horseService.saveHorseData(user, this.horseKey, {
      displayName: this.displayName.value,
      owner: this.owner.value,
      dueDate: this.dueDate.value,
      camera: this.camera.value,
      color: this.color.value,
      photoURL: this.horseObject.photoURL,
      alarmId: this.horseObject.alarmId ? this.horseObject.alarmId : '' ,
      state: this.horseObject.alarmId ? true : false,
      ownerUID: user.uid
    });
  }

  // Update an existing horse
  updateHorse(user: User, horse: Horse, currentAlarmId?: string) {
    return this.horseService.updateHorseData(user, this.horseKey,  {
      displayName: this.displayName.value,
      owner: this.owner.value,
      dueDate: this.dueDate.value,
      camera: this.camera.value,
      color: this.color.value,
      alarmId: this.horseObject.alarmId ? this.horseObject.alarmId : horse.alarmId,
      state: this.horseObject.alarmId ? true : horse.state,
    }, currentAlarmId);
  }

  save(user: User, horse: Horse, currentAlarmId?: string) {
    const save = this.isNewHorse ?
      this.saveHorse(user, horse)
      : this.updateHorse(user, horse, currentAlarmId);
  }

  uploadFile(horse: Horse, event: any) {
    this.loaded = false;
    this.loading = true;
    const time = new Date();
    const file = event.srcElement.files[0];
    const storageRef = firebase.storage().ref(`horses/${time.getTime()}`);
    storageRef.put(file)
      .then(uploadTask => this.horseObject.photoURL = uploadTask.downloadURL)
      .then(_ => {
        this.loaded = true;
      });
  }

  receiveSelectedOption($event) {
    this.horseObject.alarmId = $event;
  }

  delete(horse: Horse) {
    return this.horseService.deleteHorse(horse);
  }

}
