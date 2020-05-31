import {noop} from 'lodash-es';
import {ComponentChildren, createContext, h, VNode} from 'preact';
import {useCallback, useContext, useEffect, useState} from 'preact/hooks';
import {BehaviorSubject} from 'rxjs';
import {StaticConf} from '../conf';
import {getLocalStorageBoolean, setLocalStorageBoolean} from '../util/bool-local-storage';
import {distinctWithInitial} from '../util/distinctWithInitial';

type T = [boolean, boolean]
type Ctx = [[boolean, boolean], (notifyBefore: boolean) => void, (notifyOnStart: boolean) => void];

/** [5 min before, on start] */
export const NOTIFY_ON$: BehaviorSubject<T> = new BehaviorSubject<T>([
  getLocalStorageBoolean(StaticConf.KEY_NOTIFY_BEFORE),
  getLocalStorageBoolean(StaticConf.KEY_NOTIFY_ON_START)
]);

const Context = createContext<Ctx>([[false, false], noop, noop]);

export function NotifyOnProvider({children}: { children: ComponentChildren }): VNode {
  const [state, setState] = useState(NOTIFY_ON$.value);
  useEffect(() => {
    const sub = NOTIFY_ON$
      .pipe(distinctWithInitial(state))
      .subscribe(setState);

    return () => {
      sub.unsubscribe();
    };
  }, [setState]);
  const setNotifyBefore = useCallback((v: boolean): void => {
    if (v !== NOTIFY_ON$.value[0]) {
      setLocalStorageBoolean(StaticConf.KEY_NOTIFY_BEFORE, v);
      NOTIFY_ON$.next([v, NOTIFY_ON$.value[1]]);
    }
  }, []);
  const setNotifyOnStart = useCallback((v: boolean): void => {
    if (v !== NOTIFY_ON$.value[1]) {
      setLocalStorageBoolean(StaticConf.KEY_NOTIFY_ON_START, v);
      NOTIFY_ON$.next([NOTIFY_ON$.value[0], v]);
    }
  }, []);

  return <Context.Provider value={[state, setNotifyBefore, setNotifyOnStart]}>{children}</Context.Provider>;
}

export function useNotifyOn(): Ctx {
  return useContext(Context);
}
