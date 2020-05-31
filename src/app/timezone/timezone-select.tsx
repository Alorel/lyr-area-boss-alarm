import {FunctionComponent, h, VNode} from 'preact';
import {col} from '../../bs-partial.scss';
import {Checkbox} from '../layout/Checkbox';
import {IS_IN_GAME_TIMEZONE} from './IS_IN_GAME_TIMEZONE';
import {useUsesLocalTimezone} from './local-timezone-context';

let TimeZoneSelect: FunctionComponent<{}>;
if (IS_IN_GAME_TIMEZONE) {
  TimeZoneSelect = function TimeZoneSelect() {
    return null;
  };
} else {
  TimeZoneSelect = function TimeZoneSelect(): VNode {
    const [usesLocal, setUsesLocal] = useUsesLocalTimezone();

    return (
      <div class={col}>
        <Checkbox checked={usesLocal}
                  onChange={setUsesLocal}>
          Use local timezone
        </Checkbox>
      </div>
    );
  };
}

export {TimeZoneSelect};
