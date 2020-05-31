import moment from 'moment-timezone';
import {Observable, of, timer} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, switchMap} from 'rxjs/operators';
import {NEXT_DATE_BF_ADJUST$} from './next-date';

function reducer(acc: string[], num: number): string[] {
  if (num) {
    acc.push(num.toString().padStart(2, '0'));
  }

  return acc;
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
          .reduce(reducer, [])
          .join(':');
      })
    );
  }),
  distinctUntilChanged(),
  shareReplay(1)
);
