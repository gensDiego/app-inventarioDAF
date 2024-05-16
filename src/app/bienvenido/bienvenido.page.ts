import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.page.html',
  styleUrls: ['./bienvenido.page.scss'],
})
export class BienvenidoPage implements OnInit {
  currentUser: any;
  images = [
    { url: '\assets\images\pattern.png', alt: 'Image 1' },
    { url: '\assets\images\pattern.png', alt: 'Image 2' },
    { url: '\assets\images\pattern.png', alt: 'Image 3' }
  ];

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
  }

}
