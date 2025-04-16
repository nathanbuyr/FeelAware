import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss']
})
export class LogPage {
  moodLogs = [
    { id: 1, date: '2025-04-14', mood: '😀 Happy' },
    { id: 2, date: '2025-04-13', mood: '😢 Sad' },
    { id: 3, date: '2025-04-12', mood: '😴 Tired' },
  ];

  constructor(private router: Router) {}

  openLogDetail(entry: any) {
    this.router.navigate(['/entry-detail'], { state: { entry } });
  }
}
