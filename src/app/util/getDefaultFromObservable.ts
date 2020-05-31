import {Observable} from 'rxjs';
import {runIfSync} from './runIfSync';

export function getDefaultFromObservable<T>(ob: Observable<T>, defaultIfAsync: T): T {
  let out = defaultIfAsync;
  runIfSync(ob, v => {
    out = v;
  });

  return out;
}
