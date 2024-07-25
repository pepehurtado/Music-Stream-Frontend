import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/user/service/user.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements AfterViewInit, OnInit {
  public showSearch = false;
  public userName: string = '';
  public userImage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    const token = localStorage.getItem('jwt');
    console.log('Token:', token);
    if (token) {
      // Decoding token to get the username (assuming the token contains the username)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const username = payload.sub; // Adjust based on your token structure

      this.userService.getUserDetails(username).subscribe(user => {
        this.userName = user.username;
        this.userImage = user.image;
      }, error => {
        console.error('Error fetching user details:', error);
      });
    }
  }

  ngAfterViewInit() {}

  logout() {
    localStorage.removeItem('jwt');
    window.location.href = '/user'; // Redirect to login page
  }
}
