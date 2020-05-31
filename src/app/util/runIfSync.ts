import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

export function runIfSync<T>(input: Observable<T>, fn: (value: T) => void): void {
  let isSynchronous = true;
  input.pipe(take(1))
    .subscribe(v => {
      if (isSynchronous) {
        fn(v);
      }
    });

  isSynchronous = false;
}
