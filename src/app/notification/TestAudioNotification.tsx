import {identity} from 'lodash-es';
import {Fragment, h, VNode} from 'preact';
import {memo} from 'preact/compat';
import {useCallback, useEffect, useState} from 'preact/hooks';
import {fromEvent, timer} from 'rxjs';
import {filter, switchMapTo, take, takeUntil} from 'rxjs/operators';
import {btn, btnPrimary} from '../../bs-partial.scss';
import {CLEAR_NOTIFY$} from '../util/CLEAR_NOTIFY';
import {unsub} from '../util/unsub';
import {audioNotification, useIsAudioPlaying} from './audioNotification';
import {SHOULD_NOTIFY$} from './should-notify';

function playingText(playing: boolean, initialised: boolean): string {
  return playing ? 'Stop notification' :
    initialised ? 'Test notification' :
      'Initialise';
}

function NotificationRunner(): null {
  useEffect(() => {
    const sub = SHOULD_NOTIFY$
      .pipe(
        filter(identity),
        switchMapTo(timer(0, 4000).pipe(takeUntil(CLEAR_NOTIFY$)))
      )
      .subscribe(() => {
        audioNotification.play().catch(console.error);
      });

    return unsub(sub);
  });

  return null;
}

function useDocClick(initialised: boolean, setInitialised: (v: boolean) => void): void {
  useEffect(() => {
    if (initialised) {
      return;
    }

    const sub = fromEvent(document, 'click', {passive: true})
      .pipe(take(1))
      .subscribe(() => {
        audioNotification.play().catch(console.error);
        setInitialised(true);
      });

    return () => {
      sub.unsubscribe();
    };
  }, [initialised, setInitialised]);
}

function useAudioCallback(initialised: boolean, setInitialised: (v: boolean) => void): () => void {
  return useCallback(() => {
    if (!initialised) {
      setInitialised(true);
    }

    if (audioNotification.paused) {
      audioNotification.play().catch(console.error);
    } else {
      audioNotification.pause();
    }
  }, [initialised, setInitialised]);
}

const Subtext = memo(function Subtext({initialised}: { initialised: boolean }): VNode {
  if (initialised) {
    return <NotificationRunner/>;
  } else {
    return <p>You must interact with the page at least once, otherwise browsers will block sounds.</p>;
  }
});

export function TestAudioNotification(): VNode | null {
  const playing = useIsAudioPlaying();
  const [initialised, setInitialised] = useState(false);

  useDocClick(initialised, setInitialised);
  const onClick = useAudioCallback(initialised, setInitialised);

  return (
    <Fragment>
      <button type={'button'}
              onClick={onClick}
              class={`${btn} ${btnPrimary}`}>{playingText(playing, initialised)}</button>
      <Subtext initialised={initialised}/>
    </Fragment>
  );
}
