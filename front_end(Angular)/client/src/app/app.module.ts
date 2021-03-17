import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {InterceptorService} from '../services/interceptor/interceptor.service';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: InterceptorService,
        multi: true
    }],
    bootstrap: [AppComponent]
})
export class AppModule {}
