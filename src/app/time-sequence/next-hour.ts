import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {FILTERED_TIME_SEQUENCE$} from './filtered-time-sequence';

export const NEXT_HOUR$: Observable<number | null> = FILTERED_TIME_SEQUENCE$.pipe(
  map(v => v.length ? v[0] : null),
  distinctUntilChanged(),
  shareReplay(1)
);
