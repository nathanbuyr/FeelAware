import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

  constructor(private router: Router, private http: HttpClient) {
    const nav = this.router.getCurrentNavigation();
    this.entry = nav?.extras.state?.['entry'] || {};
    this.reflection = this.entry.reflection || '';
  }

  // Save the reflection for the selected entry
  saveEntry() {
    const updatedEntry = { ...this.entry, reflection: this.reflection };
    this.http.put(`http://localhost:4000/api/moods/${this.entry._id}`, updatedEntry)
      .subscribe(
        () => {
          // Navigate back to the log page after saving
          this.router.navigate(['/log']);
        },
        (error) => {
          console.error('Error saving entry:', error);
        }
      );
  }

  deleteEntry(entryId: string) {
    this.http.delete(`http://localhost:4000/api/moods/${entryId}`).subscribe(
      (response) => {
        console.log('Mood deleted successfully:', response);
        this.router.navigate(['/log']); // Navigate back to the log page after deletion
      },
      (error) => {
        console.error('Error deleting mood:', error);
      }
    );
  }
}
