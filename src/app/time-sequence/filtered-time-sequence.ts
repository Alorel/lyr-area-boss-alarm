import {isEqual} from 'lodash-es';
import {Observable, of} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, switchMap} from 'rxjs/operators';
import {SELECTED_TIMES$} from '../selected/SelectedTimesContext';
import {TIME_SEQUENCE$} from './timeSequence';

export const FILTERED_TIME_SEQUENCE$: Observable<number[]> = SELECTED_TIMES$.pipe(
  switchMap((selectedTimes): Observable<number[]> => {
    if (!selectedTimes.length) {
      return of([]);
    }

    return TIME_SEQUENCE$.pipe(
      map(timeSeq => timeSeq.filter(hour => selectedTimes.includes(hour)))
    );
  }),
  distinctUntilChanged(isEqual),
  shareReplay(1)
);
