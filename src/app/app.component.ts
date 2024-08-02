import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private translate: TranslateService) {
    // Establecer el idioma predeterminado
    translate.setDefaultLang('es');

    // Cambiar el idioma actual a español
    translate.use('en');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
