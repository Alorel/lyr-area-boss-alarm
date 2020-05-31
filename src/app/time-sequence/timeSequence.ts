import {isEqual} from 'lodash-es';
import moment from 'moment-timezone';
import {useEffect, useState} from 'preact/hooks';
import {Observable, timer} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {StaticConf} from '../conf';
import {distinctWithInitial} from '../util/distinctWithInitial';

export const TIME_SEQUENCE$: Observable<number[]> = timer(0, 1000).pipe(
  map((): number[] => {
    const curr = moment.tz(StaticConf.GAME_TIMEZONE).startOf('hour');
    if (!(curr.hour() % 2)) {
      curr.add(1, 'hour');
    }
    if (moment().startOf('hour').isSameOrAfter(curr)) {
      curr.add(2, 'hour');
    }

    const out: number[] = [];
    do {
      out.push(curr.hour());
      curr.add(2, 'hour');
    } while (!out.includes(curr.hour()));

    return out;
  }),
  distinctUntilChanged(isEqual),
  shareReplay(1)
);

let initialValue: number[] = [];
TIME_SEQUENCE$.subscribe(v => {
  initialValue = v;
});

export function useRawTimeSequence(): number[] {
  let [value, setValue] = useState<number[]>(initialValue);
  useEffect(() => {
    const sub = TIME_SEQUENCE$
      .pipe(distinctWithInitial(value))
      .subscribe(setValue);

    return () => {
      sub.unsubscribe();
    };
  }, [setValue]);

  return value;
}
