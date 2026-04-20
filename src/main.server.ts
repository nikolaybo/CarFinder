import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Angular 19.2: the SSR engine passes { platformRef } as context so bootstrapApplication
// reuses the server platform it already created. Without forwarding context, NG0401 is thrown.
const bootstrap = (context?: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
