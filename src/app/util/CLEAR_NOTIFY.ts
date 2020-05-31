import {fromEvent, merge, Observable} from 'rxjs';
import {mapTo, share} from 'rxjs/operators';

export const CLEAR_NOTIFY$: Observable<void> = merge(fromEvent(window, 'focus'), fromEvent(document, 'click'))
  .pipe(
    mapTo(undefined),
    share()
  );
