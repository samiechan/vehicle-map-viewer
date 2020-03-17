import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']  
})
export class UserListComponent implements OnInit {
  error: any;
  users: User[];  

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUserList()
      .subscribe(
        (data: User[]) => this.users = data, // success
        error => this.error = error // error
      );
  }
}
