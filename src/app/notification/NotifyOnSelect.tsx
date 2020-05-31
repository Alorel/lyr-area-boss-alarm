import {Fragment, h, VNode} from 'preact';
import {col} from '../../bs-partial.scss';
import {Checkbox} from '../layout/Checkbox';
import {useNotifyOn} from './NotificationTimeCtx';

export function NotifyOnSelect(): VNode {
  const [
    [notifyBeforeBoss, notifyOnBossStart],
    setNotifyBeforeBoss,
    setNotifyOnBossStart
  ] = useNotifyOn();

  return (
    <Fragment>
      <div class={col}>
        <Checkbox checked={notifyBeforeBoss} onChange={setNotifyBeforeBoss}>Notify 5 min before boss</Checkbox>
      </div>
      <div class={col}>
        <Checkbox checked={notifyOnBossStart} onChange={setNotifyOnBossStart}>Notify on boss start</Checkbox>
      </div>
    </Fragment>
  );
}
