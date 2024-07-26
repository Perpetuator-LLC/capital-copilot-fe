import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [NgIf],
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
})
export class CookieBannerComponent implements OnInit {
  showBanner = false;

  ngOnInit(): void {
    // Load the value from localStorage
    localStorage.removeItem('cookieConsent');
    const cookieConsent = localStorage.getItem('cookieConsent');
    // TODO: Load the value from the backend once the user is authenticated
    // this.authService.getCookieConsent().subscribe(consent => {
    //   cookieConsent = consent;
    // });
    if (!cookieConsent) {
      this.showBanner = true;
    }
  }

  acceptCookies(): void {
    localStorage.setItem('cookieConsent', 'accepted');
    // TODO: Send the value to the backend once the user is authenticated
    this.showBanner = false;
  }

  declineCookies(): void {
    localStorage.setItem('cookieConsent', 'declined');
    // TODO: Send the value to the backend once the user is authenticated
    this.showBanner = false;
  }
}
