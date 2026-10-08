import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonToast,
  IonAlert,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTitle,
    IonToolbar,
    IonToast,
    IonAlert,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);

  readonly search = signal('');
  readonly sort = signal('newest');
  clearAlertOpen = false;
toastOpen = false;
toastMessage = '';

readonly clearAlertButtons = [
  {
    text: 'Zrušit',
    role: 'cancel',
  },
  {
    text: 'Vymazat',
    role: 'confirm',
  },
];

  readonly total = computed(() =>
    this.counterService.counters().reduce(
      (sum, counter) => sum + counter.value,
      0,
    ),
  );

  readonly valueCounts = computed(() => {
    let positive = 0;
    let negative = 0;
    let zero = 0;

    for (const counter of this.counterService.counters()) {
      if (counter.value > 0) {
        positive++;
      } else if (counter.value < 0) {
        negative++;
      } else {
        zero++;
      }
    }

    return { positive, negative, zero };
  });

  readonly visibleCounters = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('cs');

    const counters = this.counterService.counters().filter((counter) =>
      counter.name.toLocaleLowerCase('cs').includes(query),
    );

    switch (this.sort()) {
      case 'oldest':
        return counters.sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        );
      case 'name':
        return counters.sort((a, b) =>
          a.name.localeCompare(b.name, 'cs'),
        );
      case 'valueAsc':
        return counters.sort((a, b) => a.value - b.value);
      case 'valueDesc':
        return counters.sort((a, b) => b.value - a.value);
      default:
        return counters.sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        );
    }
  });

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
  try {
    await this.counterService.remove(id);
    this.showToast('Záznam byl odstraněn.');
  } catch {
    this.showToast('Záznam se nepodařilo odstranit.');
  }
}

clear(): void {
  this.clearAlertOpen = true;
}

async confirmClear(role: string | undefined): Promise<void> {
  this.clearAlertOpen = false;

  if (role !== 'confirm') {
    return;
  }

  try {
    await this.counterService.clear();
    this.showToast('Historie byla vymazána.');
  } catch {
    this.showToast('Historii se nepodařilo vymazat.');
  }
}

private showToast(message: string): void {
  this.toastMessage = message;
  this.toastOpen = true;
}
}