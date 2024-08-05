import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  public currentLanguageImage: string = '/assets/images/flags/en.png';

  constructor(private userService: UserService, private translate : TranslateService) {}

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

  changeLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('language', language);
    this.currentLanguageImage = '/assets/images/flags/' + language + '.png';
  }

  logout() {
    localStorage.removeItem('jwt');
    window.location.href = '/auth'; // Redirect to login page
  }
}
