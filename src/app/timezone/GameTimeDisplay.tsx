import moment from 'moment-timezone';
import {FunctionComponent, h, VNode} from 'preact';
import {memo} from 'preact/compat';
import {useEffect, useState} from 'preact/hooks';
import {StaticConf} from '../conf';
import {IS_IN_GAME_TIMEZONE} from './IS_IN_GAME_TIMEZONE';
import {useUsesLocalTimezone} from './local-timezone-context';

interface GameTimeDisplayProps {
  hour: number;
}

function InnerDisplay({hour}: GameTimeDisplayProps): VNode {
  let [datetime, setDatetime] = useState(moment().hour(hour).startOf('hour'));
  const isoString = datetime.toDate().toISOString();

  // Update datetime attr
  useEffect(() => {
    if (moment().isAfter(datetime)) {
      setDatetime(datetime.clone().add(1, 'day'));
    } else {
      const timeoutId = setTimeout(() => {
        setDatetime(datetime.clone().add(1, 'day'));
      }, datetime.diff(moment()));

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isoString, setDatetime]); // no need to include datetime

  return (
    <time dateTime={isoString}>
      <span>{hour.toString().padStart(2, '0')}</span>
      <span>:00</span>
    </time>
  );
}

function CtxAwareDisplay({hour}: GameTimeDisplayProps): VNode {
  const [usesLocalTimezone] = useUsesLocalTimezone();
  const outHour = usesLocalTimezone ?
    moment.tz(StaticConf.GAME_TIMEZONE).hour(hour).toDate().getHours() :
    hour;

  return <InnerDisplay hour={outHour}/>;
}

const memoed = memo<FunctionComponent<GameTimeDisplayProps>>(IS_IN_GAME_TIMEZONE ? InnerDisplay : CtxAwareDisplay);

export {GameTimeDisplayProps, memoed as GameTimeDisplay};
