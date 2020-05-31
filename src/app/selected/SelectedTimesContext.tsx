import {noop, without} from 'lodash-es';
import {ComponentChildren, createContext, h, VNode} from 'preact';
import {useCallback, useContext, useEffect, useState} from 'preact/hooks';
import {BehaviorSubject} from 'rxjs';
import {StaticConf} from '../conf';
import {distinctWithInitial} from '../util/distinctWithInitial';
import {Settable} from '../util/Settable';

type Ctx = Settable<number[]>;

export const SELECTED_TIMES$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(((): number[] => {
  const str = localStorage.getItem(StaticConf.KEY_SELECTED_TIMES);
  if (!str) {
    return [];
  }

  try {
    const parsed: number[] = JSON.parse(str);
    if (!Array.isArray(parsed)) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error('');
    }

    return parsed;
  } catch {
    localStorage.removeItem(StaticConf.KEY_SELECTED_TIMES);

    return [];
  }
})());

const SelectedTimesContext = createContext<Ctx>([SELECTED_TIMES$.value, noop]);

export function SelectedTimesProvider({children}: { children: ComponentChildren }): VNode {
  const [state, setState] = useState(SELECTED_TIMES$.value);
  useEffect(() => {
    const sub = SELECTED_TIMES$
      .pipe(distinctWithInitial(state))
      .subscribe(setState);

    return () => {
      sub.unsubscribe();
    };
  }, [setState]);
  const setStateCb = useCallback((v: number[]) => {
    localStorage.setItem(StaticConf.KEY_SELECTED_TIMES, JSON.stringify(v));

    SELECTED_TIMES$.next(v);
  }, []);

  return <SelectedTimesContext.Provider value={[state, setStateCb]}>{children}</SelectedTimesContext.Provider>;
}

export function useSelectedTimes(): Ctx {
  return useContext(SelectedTimesContext);
}

export function useTimeSelectForHour(hour: number): Settable<boolean> {
  const [times, setTimes] = useSelectedTimes();

  const callback = useCallback((selected: boolean): void => {
    if (selected) {
      if (!times.includes(hour)) {
        setTimes(times.concat(hour));
      }
    } else if (times.includes(hour)) {
      setTimes(without(times, hour));
    }
  }, [times, setTimes, hour]);

  return [times.includes(hour), callback];
}
