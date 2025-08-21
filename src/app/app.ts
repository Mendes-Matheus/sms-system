import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ 
      RouterOutlet,
      RouterLink,
      CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('sms-system-front');
  menuOpen = false;
}
