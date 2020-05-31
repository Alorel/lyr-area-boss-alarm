import {Fragment, h, VNode} from 'preact';
import {Footer} from './footer/Footer';
import {NotifyOnProvider} from './notification/NotificationTimeCtx';
import {SelectedTimesProvider} from './selected/SelectedTimesContext';
import {TimesSelect} from './selected/TimesSelect';
import {UsesLocalTimezoneProvider} from './timezone/local-timezone-context';

export function App(): VNode {
  return (
    <Fragment>
      <UsesLocalTimezoneProvider>
        <SelectedTimesProvider>
          <NotifyOnProvider>
            <TimesSelect/>
            <Footer/>
          </NotifyOnProvider>
        </SelectedTimesProvider>
      </UsesLocalTimezoneProvider>
    </Fragment>
  );
}
