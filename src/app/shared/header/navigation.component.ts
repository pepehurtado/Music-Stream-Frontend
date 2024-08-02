import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from 'src/app/user/service/user.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgbDropdownModule, TranslateModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
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
        // Ensure that the image data starts with the correct prefix
        if (user.image) {
          this.userImage = `data:image/jpeg;base64,${user.image}`; // Adjust the MIME type if necessary
        } else {
          this.userImage = 'https://via.placeholder.com/150'; // Default placeholder
        }
      }, error => {
        console.error('Error fetching user details:', error);
      });
    }
  }

  logout() {
    localStorage.removeItem('jwt');
    window.location.href = '/auth'; // Redirect to login page
  }
}
