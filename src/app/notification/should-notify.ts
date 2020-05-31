import moment from 'moment-timezone';
import {Observable, of, timer} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, switchMap} from 'rxjs/operators';
import {NEXT_DATE$} from '../time-sequence/next-date';

export const SHOULD_NOTIFY$: Observable<boolean> = NEXT_DATE$.pipe(
  switchMap((next): Observable<boolean> => {
    if (!next) {
      return of(false);
    }

    return timer(0, 1000).pipe(
      map(() => moment().isSameOrAfter(next, 'minute'))
    );
  }),
  distinctUntilChanged(),
  shareReplay(1)
);
