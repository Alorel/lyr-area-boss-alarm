import {staticComponent} from '@alorel/preact-static-component';
import {h, VNode} from 'preact';
import {useEffect, useRef} from 'preact/hooks';
import {fromEvent} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {alert, alertDark, alertLink, col, mr1, row, small, textLeft, textRight} from '../../bs-partial.scss';
import {distinctWithInitial} from '../util/distinctWithInitial';
import {footerContainer} from './footer.scss';

function setMargin(px: number): void {
  document.body.style.marginBottom = px ? `${px}px` : '0';
}

export const Footer = staticComponent(function Footer(): VNode {
  const footerRef = useRef<HTMLElement>();
  useEffect(() => {
    if (footerRef.current) {
      const initialHeight = footerRef.current!.getBoundingClientRect().height;
      setMargin(initialHeight);

      const sub = fromEvent(window, 'resize', {passive: true})
        .pipe(
          debounceTime(250),
          map(() => footerRef.current!.getBoundingClientRect().height),
          distinctWithInitial(initialHeight)
        )
        .subscribe(setMargin, console.error);

      return () => {
        sub.unsubscribe();
        setMargin(0);
      };
    } else {
      setMargin(0);
    }
  }, [footerRef.current]);

  return (
    <footer class={`${alert} ${alertDark} ${footerContainer} ${small}`} ref={footerRef}>
      <div class={row}>
        <div class={`${col} ${textLeft}`}>
          <span class={mr1}>Created by Goosetopher for</span>
          <a href={'https://lyrania.co.uk/?r=237937'}
             class={alertLink}
             target={'_blank'}
             rel={'noopener'}>Lyrania</a>
        </div>
        <div class={`${col} ${textRight}`}>
          <span class={mr1}>Uses sound effect by</span>
          <a href={'http://soundbible.com/2155-Text-Message-Alert-2.html'}
             class={alertLink}
             target={'_blank'}
             rel={'noopener'}>Daniel Simion</a>
        </div>
      </div>
    </footer>
  );
});
