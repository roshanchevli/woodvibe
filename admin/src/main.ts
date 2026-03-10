//import 'zone.js';   // 👈 REQUIRED

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { initializeApp } from 'firebase/app';

import { App } from './app/app';
import { routes } from './app/app.routes';
import { firebaseConfig } from './app/firebase.config';

initializeApp(firebaseConfig);

bootstrapApplication(App, {
  providers: [provideRouter(routes)]
});