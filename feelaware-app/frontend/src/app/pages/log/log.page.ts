import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
export class LogPage implements OnInit {
  moodLogs: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadMoodEntries();
  }

  // Fetch mood entries from backend (MongoDB)
  loadMoodEntries() {
    this.http.get<any[]>('http://localhost:4000/api/moods').subscribe(
      (data) => {
        this.moodLogs = data;
      },
      (error) => {
        console.error('Error loading mood entries:', error);
      }
    );
  }

  // Save the selected mood to MongoDB (backend)
  saveMood(mood: string) {
    const date = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format

    this.http.post('http://localhost:4000/api/moods', { date, mood }).subscribe(
      (response) => {
        console.log('Mood saved successfully:', response);
        this.loadMoodEntries(); // Reload the mood entries after saving
      },
      (error) => {
        console.error('Error saving mood:', error);
      }
    );
  }

  // Navigate to the detail page with the selected entry
  openLogDetail(entry: any) {
    this.router.navigate(['/entry-detail'], { state: { entry } });
  }
}
