import {noop} from 'lodash-es';
import {ComponentChildren, createContext, h, VNode} from 'preact';
import {useCallback, useContext, useState} from 'preact/hooks';
import {StaticConf} from '../conf';
import {Settable} from '../util/Settable';

type IUsesLocalTimezoneContext = Settable<boolean>;

const UsesLocalTimezoneContext = createContext<IUsesLocalTimezoneContext>([
  localStorage.getItem(StaticConf.KEY_USE_LOCAL_TIME) === '1',
  noop
]);

export function UsesLocalTimezoneProvider({children}: { children: ComponentChildren }): VNode {
  const [state, setState] = useState(localStorage.getItem(StaticConf.KEY_USE_LOCAL_TIME) === '1');
  const setStateCb = useCallback((v: boolean) => {
    if (v) {
      localStorage.setItem(StaticConf.KEY_USE_LOCAL_TIME, '1');
    } else {
      localStorage.removeItem(StaticConf.KEY_USE_LOCAL_TIME);
    }

    setState(v);
  }, [setState]);

  return <UsesLocalTimezoneContext.Provider value={[state, setStateCb]}>{children}</UsesLocalTimezoneContext.Provider>;
}

export function useUsesLocalTimezone(): IUsesLocalTimezoneContext {
  return useContext(UsesLocalTimezoneContext);
}
