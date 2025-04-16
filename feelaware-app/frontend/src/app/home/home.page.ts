import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRow, IonCol, NgFor],
})
export class HomePage {
  moods = [
    { emoji: '😀', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😠', label: 'Angry' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😍', label: 'Loved' }
  ];

  constructor(private router: Router) {}

  selectMood(mood: any) {
    console.log('Selected mood:', mood);
    this.router.navigate(['/log'], { queryParams: { mood: mood.label } });
  }
}
