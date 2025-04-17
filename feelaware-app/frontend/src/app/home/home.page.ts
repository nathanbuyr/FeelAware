import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  moods = [
    { emoji: '😀', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😠', label: 'Angry' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😍', label: 'Loved' },
    { emoji: '🤔', label: "I'm not sure!", redirect: '/mood-decider' }
  ];

  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private http: HttpClient
  ) {}

  async openMoodSelector() {
    const buttons = this.moods.map(mood => ({
      text: `${mood.emoji} ${mood.label}`,
      handler: () => {
        if (mood.redirect) {
          this.router.navigate([mood.redirect]);
        } else {
          this.thankUser(mood);
        }
      }
    }));
  
    const alert = await this.alertCtrl.create({
      header: 'How are you feeling?',
      buttons,
    });
  
    await alert.present();
  }

  async thankUser(mood: any) {
    const thankYou = await this.alertCtrl.create({
      header: `Thanks for checking in 🙇‍♂️`,
      message: `You selected <strong>${mood.label}</strong>.`,
      buttons: [
        {
          text: 'Check Entries',
          handler: () => {
            this.router.navigate(['/log']);
          }
        }
      ]
    });

    await thankYou.present();

    // Save the mood to MongoDB after the user selects it
    this.saveMood(mood);
  }

  // Send the selected mood to MongoDB
  saveMood(mood: any) {
    const date = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
    this.http
      .post('http://localhost:4000/api/moods', { date, mood: mood.label })
      .subscribe(
        (response) => {
          console.log('Mood saved successfully:', response);
        },
        (error) => {
          console.error('Error saving mood:', error);
        }
      );
  }
}
