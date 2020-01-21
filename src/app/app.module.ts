import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {Bulb} from './base/bulb';
import {Ground} from './base/ground';
import {LightService} from './services/light.service';
import {MaterialService} from './services/material.service';
import {provideSlot} from './services/slot.factory';
import {ContainerSlot} from './slot/container.slot';
import {BoxSlot} from './slot/box.slot';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchComponent } from './ui/search/search.component';
import {SearchContext} from './services/search.context';

@NgModule({
    declarations: [
        AppComponent,
        SearchComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
    ],
    providers: [
        provideSlot(ContainerSlot),
        provideSlot(BoxSlot, [LightService, MaterialService, SearchContext]),
        provideSlot(Ground, [MaterialService]),
        provideSlot(Bulb, [LightService, MaterialService]),

    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
