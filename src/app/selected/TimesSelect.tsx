import {staticComponent} from '@alorel/preact-static-component';
import {h, VNode} from 'preact';
import {
  card,
  cardBody,
  cardSubtitle,
  cardText,
  cardTitle,
  col4,
  colMd3,
  textCenter,
  mb2,
  mt1,
  row,
  textMuted
} from '../../bs-partial.scss';
import {useRawTimeSequence} from '../time-sequence/timeSequence';
import {TimeToggleBtn} from '../TimeToggleBtn';
import {GameTimeDisplay} from '../timezone/GameTimeDisplay';
import {useTimeSelectForHour} from './SelectedTimesContext';
import {TimesSelectFooter} from './TimesSelectFooter';

function Btn({hour}: { hour: number }): VNode {
  const [selected, setSelected] = useTimeSelectForHour(hour);

  return (
    <TimeToggleBtn value={selected} onChange={setSelected}>
      <GameTimeDisplay hour={hour}/>
    </TimeToggleBtn>
  );
}

function InnerSelect(): VNode {
  const timeSeq: number[] = useRawTimeSequence();

  return (
    <div class={cardText}>
      <div class={`${row} ${textCenter}`}>{
        timeSeq.map((hour: number): VNode => (
          <div class={`${colMd3} ${col4} ${mt1}`} key={hour}>
            <Btn hour={hour}/>
          </div>
        ))
      }</div>
    </div>
  );
}

export const TimesSelect = staticComponent(function TimesSelect(): VNode {
  return (
    <div class={card}>
      <div class={cardBody}>
        <h5 class={cardTitle}>Notification times</h5>
        <h6 class={`${cardSubtitle} ${textMuted} ${mb2}`}>This is when the alarm will go off</h6>
        <InnerSelect/>
        <TimesSelectFooter/>
      </div>
    </div>
  );
});
