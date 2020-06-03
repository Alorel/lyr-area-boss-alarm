import moment from 'moment-timezone';
import {Observable, of, timer} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, switchMap} from 'rxjs/operators';
import {NEXT_DATE_BF_ADJUST$} from './next-date';

function innerMapper(n: number): string {
  return n.toString().padStart(2, '0');
}

export const TIME_TO_NEXT_BOSS$: Observable<string | null> = NEXT_DATE_BF_ADJUST$.pipe(
  switchMap(d => {
    if (!d) {
      return of(null);
    }

    return timer(0, 1000).pipe(
      map(() => {
        const dur = moment.duration(d.diff(moment(), 'seconds'), 'seconds');

        return [dur.hours(), dur.minutes(), dur.seconds()]
          .map(innerMapper)
          .join(':');
      })
    );
  }),
  distinctUntilChanged(),
  shareReplay(1)
);
