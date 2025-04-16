import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entry-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './entry-detail.page.html',
  styleUrls: ['./entry-detail.page.scss']
})
export class EntryDetailPage {
  entry: any;
  reflection: string = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.entry = nav?.extras.state?.['entry'] || {};
  }

  saveEntry() {
    console.log('Saved reflection:', this.reflection);
  }
}
