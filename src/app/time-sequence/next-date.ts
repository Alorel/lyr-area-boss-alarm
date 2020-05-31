import {stubFalse} from 'lodash-es';
import moment from 'moment-timezone';
import {Observable, of, timer} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, switchMap} from 'rxjs/operators';
import {StaticConf} from '../conf';
import {NOTIFY_ON$} from '../notification/NotificationTimeCtx';
import {NEXT_HOUR$} from './next-hour';

const partialIsSame = {isSame: stubFalse};

export const NEXT_DATE$: Observable<moment.Moment | null> = NEXT_HOUR$.pipe(
  map((hr): moment.Moment | null => {
    if (hr == null) {
      return null;
    }

    const next = moment.tz(StaticConf.GAME_TIMEZONE).hour(hr).startOf('hour');
    if (moment().startOf('hour').isAfter(next)) {
      next.add(1, 'day');
    }

    return next;
  }),
  switchMap(next => {
    if (!next) {
      return of(next);
    }

    return NOTIFY_ON$.pipe(
      switchMap(([notifyBefore, notifyOnStart]) => {
        if (!notifyBefore && !notifyOnStart) {
          return of(null);
        }
        const notifPeriods: (moment.Moment)[] = [];
        if (notifyBefore) {
          notifPeriods.push(next.clone().subtract(5, 'minute'));
        }
        if (notifyOnStart) {
          notifPeriods.push(next);
        }

        return timer(0, 1000).pipe(
          map(() => {
            const now = moment();
            for (const p of notifPeriods) {
              if (now.isSameOrBefore(p, 'second')) {
                return p;
              }
            }

            return null;
          })
        );
      })
    );
  }),
  distinctUntilChanged((a, b) => {
    if (a === b || (!a && !b)) {
      return true;
    } else if ((a && !b) || (b && !a)) {
      return false;
    } else {
      return (a || partialIsSame).isSame(b);
    }
  }),
  shareReplay(1)
);
