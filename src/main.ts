import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { AuthService } from './app/core/services/auth/auth.service';
import { ApplicationRef } from '@angular/core';

async function initializeApp(appRef: ApplicationRef) {
  const injector = appRef.injector;
  const authService = injector.get(AuthService);
  await authService.initializeAuth();
}

bootstrapApplication(App, appConfig)
  .then(initializeApp)
  .catch((err) => console.error(err));
