import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  imagePreview: string | ArrayBuffer | null = null; // This will hold the image preview URL
  selectedFile: File | null = null;
  
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    const nav = this.router.getCurrentNavigation();
    this.entry = nav?.extras.state?.['entry'] || {};
    this.reflection = this.entry.reflection || '';
  }

  ngOnInit() {
    // Fetch the entry details by ID (assuming it's passed as a route param)
    const entryId = this.route.snapshot.paramMap.get('id');
    if (entryId) {
      this.http.get(`http://localhost:4000/api/moods/${entryId}`).subscribe(
        (response: any) => {
          this.entry = response.entry;
          this.reflection = this.entry.reflection;
          // If there is already an image, display it
          this.imagePreview = this.entry.image || null;  // If image is already saved, set it as preview
        },
        (error) => {
          console.error('Error fetching entry:', error);
        }
      );
    }
  }

  saveEntry() {
    // If an image is selected, create a FormData object to send the file to the backend
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
  
      // First upload the image
      this.http.post<any>('http://localhost:4000/api/upload', formData).subscribe(
        (response) => {
          const imageUrl = response.imageUrl; // Image URL returned by the backend
  
          // Once the image is uploaded, update the entry with the image URL
          const updatedEntry = { 
            ...this.entry, 
            reflection: this.reflection, 
            image: imageUrl 
          };
  
          // Save the updated entry (with the reflection and image)
          this.http.put(`http://localhost:4000/api/moods/${this.entry._id}`, updatedEntry)
            .subscribe(
              () => {
                this.router.navigate(['/log']); // Navigate back to the log page after saving
              },
              (error) => {
                console.error('Error saving entry:', error);
              }
            );
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    } else {
      // If no image was selected, just save the entry without the image
      const updatedEntry = { 
        ...this.entry, 
        reflection: this.reflection 
      };
  
      this.http.put(`http://localhost:4000/api/moods/${this.entry._id}`, updatedEntry)
        .subscribe(
          () => {
            this.router.navigate(['/log']);
          },
          (error) => {
            console.error('Error saving entry:', error);
          }
        );
    }
  }
  
  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
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
