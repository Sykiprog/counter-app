import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  const initializeMock = vi.fn();
  const removeMock = vi.fn();
  const clearMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    initializeMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);
    clearMock.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: CounterService,
          useValue: {
            counters: signal<SavedCounter[]>([]).asReadonly(),
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

  it('should clear history through the service', async () => {
    await component.clear();

    expect(clearMock).toHaveBeenCalledTimes(1);
  });
});