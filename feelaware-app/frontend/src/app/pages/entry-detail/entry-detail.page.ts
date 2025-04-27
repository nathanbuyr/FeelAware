import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// define the entry-detail page component
@Component({
  selector: 'app-entry-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './entry-detail.page.html',
  styleUrls: ['./entry-detail.page.scss']
})
export class EntryDetailPage {
  // entry object received from navigation
  entry: any;
  // user-written reflection text
  reflection: string = '';
  // image preview url or data
  imagePreview: string | ArrayBuffer | null = null;
  // selected file object for upload
  selectedFile: File | null = null;
  // caption text for the uploaded image
  imageCaption: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    // get the navigation data containing the entry
    const nav = this.router.getCurrentNavigation();
    this.entry = nav?.extras.state?.['entry'] || {};
    this.reflection = this.entry.reflection || '';
    this.imagePreview = this.entry.image || null;
    this.imageCaption = this.entry.imageCaption || '';
  }

  // method to save the updated entry
  saveEntry() {
    // if a new image was selected, upload the image first
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);

      // send post request to upload the image
      this.http.post<any>('http://localhost:4000/api/upload', formData).subscribe(
        (response) => {
          const imageUrl = response.imageUrl; // get the uploaded image url from the server

          // create updated entry with new reflection and image
          const updatedEntry = { 
            ...this.entry, 
            reflection: this.reflection, 
            image: imageUrl,
            imageCaption: this.imageCaption
          };

          // send put request to update the entry
          this.http.put(`http://localhost:4000/api/moods/${this.entry._id}`, updatedEntry)
            .subscribe(
              () => {
                this.router.navigate(['/log']); // go back to the log page after saving
              },
              (error) => {
                console.error('error saving entry:', error);
              }
            );
        },
        (error) => {
          console.error('error uploading image:', error);
        }
      );
    } else {
      // if no new image, just update reflection and caption
      const updatedEntry = { 
        ...this.entry, 
        reflection: this.reflection,
        imageCaption: this.imageCaption
      };

      // send put request to update the entry
      this.http.put(`http://localhost:4000/api/moods/${this.entry._id}`, updatedEntry)
        .subscribe(
          () => {
            this.router.navigate(['/log']); // go back to the log page after saving
          },
          (error) => {
            console.error('error saving entry:', error);
          }
        );
    }
  }

  // method to handle file selection by the user
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      // create a preview of the selected image
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // method to delete the current entry
  deleteEntry(entryId: string) {
    this.http.delete(`http://localhost:4000/api/moods/${entryId}`).subscribe(
      (response) => {
        console.log('mood deleted successfully:', response);
        this.router.navigate(['/log']); // go back to the log page after deletion
      },
      (error) => {
        console.error('error deleting mood:', error);
      }
    );
  }
}
