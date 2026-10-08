import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonToast,
} from '@ionic/angular';
import { CounterComponent } from '../components/counter/counter.component';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CounterComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonToast,
  ],
})
export class Tab1Page {
  private readonly counterService = inject(CounterService);

  toastOpen = false;
toastMessage = '';

async onSaved(counter: SavedCounter): Promise<void> {
  try {
    await this.counterService.add(counter);
    this.toastMessage = 'Počítadlo bylo uloženo.';
  } catch {
    this.toastMessage = 'Počítadlo se nepodařilo uložit.';
  }

  this.toastOpen = true;
}
}