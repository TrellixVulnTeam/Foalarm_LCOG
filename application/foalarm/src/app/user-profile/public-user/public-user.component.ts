import { Component, OnChanges, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user.service';

@Component({
  selector: 'app-public-user',
  templateUrl: './public-user.component.html',
  styleUrls: ['./public-user.component.css']
})
export class PublicUserComponent implements OnChanges {

  @Input() uid: any; // The UID of the user
  @Input() user: any; // The UID of auth user
  user$: Observable<{}> | Observable<any>;

  constructor(
    private userService: UserService
  ) { }

  ngOnChanges() {
    this.user$ = this.userService.getUser(this.uid);
  }

  /**
   * Request friend, returns promise
   * @param uid
   * @param fullName
   */
  addFriend(uid: string, fullName: string) {
    console.log('Added friend', uid, ' By', this.user);
    return this.userService.requestFriend(this.user, {uid: this.uid, fullName: fullName}, this.uid);
  }

}
