import {Unsubscribable} from 'rxjs';

export function unsub(s: Unsubscribable): () => void {
  return () => {
    s.unsubscribe();
  };
}
