import {useEffect, useState} from 'preact/hooks';
import {fromEvent, merge} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {distinctWithInitial} from '../util/distinctWithInitial';
import {unsub} from '../util/unsub';
import url from './notification.mp3';

export const audioNotification = new Audio(url);

export function useIsAudioPlaying(): boolean {
  const [playing, setPlaying] = useState<boolean>(!audioNotification.paused);
  useEffect(() => {
    const yes$ = fromEvent(audioNotification, 'play').pipe(mapTo(true));
    const no$ = fromEvent(audioNotification, 'pause').pipe(mapTo(false));

    const sub = merge(yes$, no$)
      .pipe(distinctWithInitial(!audioNotification.paused))
      .subscribe(setPlaying);

    return unsub(sub);
  }, [setPlaying]);

  return playing;
}
