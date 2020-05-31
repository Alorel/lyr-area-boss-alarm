import {noop} from 'lodash-es';
import {ComponentChildren, h, VNode} from 'preact';
import {useCallback} from 'preact/hooks';
import {formCheck, formCheckInput, formCheckLabel, mt3} from '../../bs-partial.scss';
import {useControlId} from '../util/useControlId';

interface CheckboxProps {
  checked: boolean;

  children: ComponentChildren;

  onChange?(v: boolean): void;
}

function Checkbox({children, checked, onChange}: CheckboxProps): VNode {
  const inputId = useControlId();
  const evtHandler = useCallback((e: Event): void => {
    onChange!((e.target as HTMLInputElement).checked);
  }, [onChange]);

  return (
    <div class={`${formCheck} ${mt3}`}>
      <input type={'checkbox'}
             id={inputId}
             class={formCheckInput}
             checked={checked}
             onChange={evtHandler}/>
      {!!children && <label for={inputId} class={formCheckLabel}>{children}</label>}
    </div>
  );
}

Checkbox.defaultProps = {onChange: noop} as Partial<CheckboxProps>;

export {Checkbox};
