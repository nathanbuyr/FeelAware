import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss']
})
export class LogPage implements OnInit, OnDestroy {
  moodLogs: any[] = [];
  routerSubscription!: Subscription;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Load initially
    this.loadMoodEntries();

    // Reload when navigating back to this page
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/log') {
          this.loadMoodEntries();
        }
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

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

  saveMood(mood: string) {
    const date = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

    this.http.post('http://localhost:4000/api/moods', { date, mood }).subscribe(
      (response) => {
        console.log('Mood saved:', response);
        this.loadMoodEntries(); // Refresh after save
      },
      (error) => {
        console.error('Error saving mood:', error);
      }
    );
  }

  openLogDetail(entry: any) {
    this.router.navigate(['/entry-detail'], { state: { entry } });
  }
}
