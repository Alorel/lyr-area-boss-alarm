import {useEffect} from 'preact/hooks';
import {Subscription, timer} from 'rxjs';
import {INITIAL_TITLE} from './conf';
import {TIME_TO_NEXT_BOSS$} from './time-sequence/time-to-next-boss';

export function useTitleUpdater(initialised: boolean, playing: boolean): void {
  useEffect(() => {
    let sub: Subscription;
    if (initialised) {
      if (playing) {
        sub = timer(0, 1 / 3).subscribe(v => {
          let tit = ` ${INITIAL_TITLE}`;
          const num = v % 4;
          for (let i = 0; i < num; i++) {
            tit = '#' + tit;
          }

          document.title = tit;
        });
      } else {
        sub = TIME_TO_NEXT_BOSS$.subscribe(v => {
          document.title = v ? `${v} - ${INITIAL_TITLE}` : INITIAL_TITLE;
        });
      }
    } else {
      sub = timer(0, 500).subscribe(t => {
        const segments = [INITIAL_TITLE];
        if (t % 2) {
          segments.unshift('## CLICK ##');
        }

        document.title = segments.join(' - ');
      });
    }

    return () => {
      sub.unsubscribe();
      document.title = INITIAL_TITLE;
    };
  }, [initialised, playing]);
}
