import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let countersState: WritableSignal<SavedCounter[]>;

  const initializeMock = vi.fn();
  const removeMock = vi.fn();
  const clearMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    initializeMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);
    clearMock.mockResolvedValue(undefined);
    countersState = signal<SavedCounter[]>([]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: CounterService,
          useValue: {
            counters: countersState.asReadonly(),
            initialized: signal(true).asReadonly(),
            initialize: initializeMock,
            remove: removeMock,
            clear: clearMock,
          },
        },
      ],
    });

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize history', async () => {
    await fixture.whenStable();

    expect(component).toBeTruthy();
    expect(initializeMock).toHaveBeenCalledTimes(1);
  });

  it('should pass the selected id to the service', async () => {
    await component.remove('first');

    expect(removeMock).toHaveBeenCalledWith('first');
  });

  it('should clear history only after confirmation', async () => {
  component.clear();

  expect(component.clearAlertOpen).toBe(true);
  expect(clearMock).not.toHaveBeenCalled();

  await component.confirmClear('confirm');

  expect(clearMock).toHaveBeenCalledTimes(1);
  expect(component.clearAlertOpen).toBe(false);
  expect(component.toastOpen).toBe(true);
});

it('should keep history when clearing is cancelled', async () => {
  component.clear();

  await component.confirmClear('cancel');

  expect(clearMock).not.toHaveBeenCalled();
  expect(component.clearAlertOpen).toBe(false);
});
it('should update totals and variant C when data changes', () => {
  const positive: SavedCounter = {
    id: 'positive',
    name: 'Kladné',
    value: 5,
    createdAt: '2026-10-08T08:00:00.000Z',
  };
  const negative: SavedCounter = {
    id: 'negative',
    name: 'Záporné',
    value: -2,
    createdAt: '2026-10-08T09:00:00.000Z',
  };
  const zero: SavedCounter = {
    id: 'zero',
    name: 'Nulové',
    value: 0,
    createdAt: '2026-10-08T10:00:00.000Z',
  };

  countersState.set([positive, negative, zero]);

  expect(component.total()).toBe(3);
  expect(component.valueCounts()).toEqual({
    positive: 1,
    negative: 1,
    zero: 1,
  });

  countersState.set([negative, zero]);

  expect(component.total()).toBe(-2);
  expect(component.valueCounts()).toEqual({
    positive: 0,
    negative: 1,
    zero: 1,
  });

  countersState.set([]);

  expect(component.total()).toBe(0);
  expect(component.valueCounts()).toEqual({
    positive: 0,
    negative: 0,
    zero: 0,
  });
});

it('should search and sort without changing stored data', () => {
  const zebra: SavedCounter = {
    id: 'zebra',
    name: 'Zebra',
    value: 5,
    createdAt: '2026-10-08T08:00:00.000Z',
  };
  const alfa: SavedCounter = {
    id: 'alfa',
    name: 'Alfa',
    value: 2,
    createdAt: '2026-10-08T09:00:00.000Z',
  };

  countersState.set([zebra, alfa]);

  expect(component.visibleCounters()).toEqual([alfa, zebra]);

  component.sort.set('oldest');
  expect(component.visibleCounters()).toEqual([zebra, alfa]);

  component.sort.set('name');
  expect(component.visibleCounters()).toEqual([alfa, zebra]);

  component.sort.set('valueAsc');
  expect(component.visibleCounters()).toEqual([alfa, zebra]);

  component.sort.set('valueDesc');
  expect(component.visibleCounters()).toEqual([zebra, alfa]);

  component.search.set('  ALF  ');
  expect(component.visibleCounters()).toEqual([alfa]);

  // Vyhledávání nemění statistiky celé historie.
  expect(component.total()).toBe(7);

  component.search.set('nenalezeno');
  expect(component.visibleCounters()).toEqual([]);

  expect(countersState()).toEqual([zebra, alfa]);
});
});