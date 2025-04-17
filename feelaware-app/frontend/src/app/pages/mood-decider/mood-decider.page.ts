import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-mood-decider',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './mood-decider.page.html',
  styleUrls: ['./mood-decider.page.scss']
})
export class MoodDeciderPage {
  userPrompt: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {}

  decideMood() {
    if (!this.userPrompt.trim()) {
      this.showAlert('Please enter something about your day!');
      return;
    }

    this.http.post<any>('http://localhost:4000/api/decide-mood', {
      prompt: this.userPrompt
    }).subscribe(
      async (res) => {
        const mood = res.mood;
        await this.showAlert(`Based on your input, you're feeling: ${mood}`, mood);
        this.userPrompt = ''; // clear the field
      },
      async (err) => {
        console.error(err);
        await this.showAlert('Sorry, something went wrong while detecting your mood.');
      }
    );
  }

  async showAlert(message: string, mood?: string) {
    const alert = await this.alertController.create({
      header: 'Mood Decided!',
      message,
      buttons: [
        {
          text: 'Back to Log',
          role: 'cancel',
          cssClass: 'danger-button',
          handler: () => {
            this.router.navigate(['/log']);
          },
        },
        {
          text: 'Retry',
          cssClass: 'warning-button',
          handler: () => {
            this.userPrompt = ''; // Clear the prompt to try again
          },
        },
        ...(mood
          ? [
              {
                text: 'Yes, Save it!',
                cssClass: 'success-button',
                handler: () => {
                  this.saveMood(mood);
                  this.router.navigate(['/log']); // Navigate to the log page after saving
                },
              },
            ]
          : []),
      ],
    });

    await alert.present();
  }

  saveMood(mood: string) {
    const date = new Date().toISOString().split('T')[0];
    this.http.post('http://localhost:4000/api/moods', { date, mood }).subscribe(
      (response) => {
        console.log('Mood saved:', response);
      },
      (error) => {
        console.error('Error saving mood:', error);
      }
    );
  }
}
