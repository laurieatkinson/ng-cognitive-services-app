import { Component } from '@angular/core';
import { Router, RouterEvent, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cognitive Services App';
  menuOpened = false;

  constructor(private router: Router) {
    router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.closeMenu();
      }
    });
  }

  toggleMenu () {
    this.menuOpened = !this.menuOpened;
  }

  closeMenu () {
    this.menuOpened = false;
  }
}
