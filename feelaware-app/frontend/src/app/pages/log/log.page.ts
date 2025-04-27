import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// define the log page component
@Component({
  selector: 'app-log',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss']
})
export class LogPage implements OnInit, OnDestroy {
  // list to hold mood log entries
  moodLogs: any[] = [];
  // subscription to router events
  routerSubscription!: Subscription;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // load mood entries when page initializes
    this.loadMoodEntries();
  
    // listen for router navigation events to reload entries
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.startsWith('/log')) {
          // check if url has ?refresh=true
          const url = new URL(window.location.href);
          const refresh = url.searchParams.get('refresh');
  
          if (refresh === 'true') {
            this.loadMoodEntries();
          }
        }
      });
  }

  // called when the view is about to enter
  ionViewWillEnter() {
    this.loadMoodEntries();
  }

  // clean up the subscription when component is destroyed
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // method to fetch mood entries from the server
  loadMoodEntries() {
    this.http.get<any[]>('http://localhost:4000/api/moods').subscribe(
      (data) => {
        this.moodLogs = data;
      },
      (error) => {
        console.error('error loading mood entries:', error);
      }
    );
  }

  // method to save a new mood
  saveMood(mood: string) {
    const date = new Date().toISOString().split('T')[0]; // get current date in yyyy-mm-dd format

    this.http.post('http://localhost:4000/api/moods', { date, mood }).subscribe(
      (response) => {
        console.log('mood saved:', response);
        this.loadMoodEntries(); // refresh list after saving
      },
      (error) => {
        console.error('error saving mood:', error);
      }
    );
  }

  // method to navigate to entry detail page
  openLogDetail(entry: any) {
    this.router.navigate(['/entry-detail'], { state: { entry } });
  }

  // method to handle segment control change
  segmentChanged(event: any) {
    const selected = event.detail.value;
    if (selected === 'write') {
      this.router.navigate(['/mood-decider']);
    }
  }
}
