import {Fragment, h, VNode} from 'preact';
import {col, row, textCenter} from '../../bs-partial.scss';
import {NotifyOnSelect} from '../notification/NotifyOnSelect';
import {TestAudioNotification} from '../notification/TestAudioNotification';
import {TimeZoneSelect} from '../timezone/timezone-select';

export function TimesSelectFooter(): VNode {
  return (
    <Fragment>
      <div class={`${textCenter} ${row}`}>
        <TimeZoneSelect/>
        <NotifyOnSelect/>
      </div>
      <div class={`${textCenter} ${row}`}>
        <div class={col}>
          <TestAudioNotification/>
        </div>
      </div>
    </Fragment>
  );
}
