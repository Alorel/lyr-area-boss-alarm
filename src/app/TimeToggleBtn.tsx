import {noop} from 'lodash-es';
import {ComponentChildren, h, VNode} from 'preact';
import {memo} from 'preact/compat';
import {useCallback} from 'preact/hooks';
import {btn, btnOutlineSecondary, btnSuccess} from '../bs-partial.scss';

interface TimeToggleBtnProps {
  children?: ComponentChildren;

  disabled?: boolean;

  value: boolean;

  onChange?(v: boolean): void;
}

function TimeToggleBtn({value, onChange, disabled, children}: TimeToggleBtnProps): VNode {
  const onClick = useCallback(() => {
    onChange!(!value);
  }, [onChange, value]);

  return <button type={'button'}
                 class={`${btn} ${value ? btnSuccess : btnOutlineSecondary}`}
                 disabled={disabled}
                 onClick={onClick}
                 aria-checked={value.toString()}
                 role={'checkbox'}>{children}</button>;
}

TimeToggleBtn.defaultProps = {
  disabled: false,
  onChange: noop
} as Partial<TimeToggleBtnProps>;

const memoed = memo(TimeToggleBtn);

export {TimeToggleBtnProps, memoed as TimeToggleBtn};
