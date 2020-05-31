import {MonoTypeOperatorFunction, pipe} from 'rxjs';
import {distinctUntilChanged, skip, startWith} from 'rxjs/operators';

export function distinctWithInitial<T>(value: T): MonoTypeOperatorFunction<T> {
  return pipe(
    startWith<T>(value),
    distinctUntilChanged<T>(),
    skip<T>(1)
  );
}
