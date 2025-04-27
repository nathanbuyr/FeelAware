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
        await this.showDecisionAlert(`Based on your input, you're feeling: ${mood}`, mood);
        this.userPrompt = ''; // clear the field
      },
      async (err) => {
        console.error(err);
        await this.showAlert('Sorry, something went wrong while detecting your mood.');
      }
    );
  }

  async showDecisionAlert(message: string, mood?: string) {
    const alert = await this.alertController.create({
      header: 'Mood Decided!',
      message,
      buttons: [
        {
          text: 'Back to Log',
          role: 'cancel',
          handler: () => {
            this.router.navigate(['/log']);
          },
        },
        {
          text: 'Retry',
          handler: () => {
            this.userPrompt = '';
          },
        },
        ...(mood
          ? [
              {
                text: 'Yes, Save it!',
                handler: () => {
                  this.saveMood(mood);
                },
              },
            ]
          : []),
      ],
    });

    await alert.present();
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Notice',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async saveMood(mood: string) {
    const date = new Date().toISOString().split('T')[0];
    this.http.post('http://localhost:4000/api/moods', { date, mood }).subscribe(
      async () => {
        console.log('Mood saved successfully');
        await this.showSuccessAlert();
      },
      async (error) => {
        console.error('Error saving mood:', error);
        await this.showAlert('Error saving mood 😢');
      }
    );
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success!',
      message: 'Your mood has been saved! 🙌',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/log'], { queryParams: { refresh: 'true' } });
          },
        },
      ],
    });

    await alert.present();
  }

  segmentChanged(event: any) {
    const selected = event.detail.value;
    if (selected === 'diary') {
      this.router.navigate(['/log']);
    }
  }
}
