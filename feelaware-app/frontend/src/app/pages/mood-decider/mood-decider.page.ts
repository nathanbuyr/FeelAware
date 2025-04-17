import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons} from '@ionic/angular/standalone';

@Component({
  selector: 'app-mood-decider',
  templateUrl: './mood-decider.page.html',
  styleUrls: ['./mood-decider.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons]
})
export class MoodDeciderPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
