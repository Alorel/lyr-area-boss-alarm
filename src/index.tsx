import {h, render} from 'preact';
import {App} from './app/App';
import {containerFluid} from './bs-partial.scss';

const root = document.getElementById('root') as HTMLDivElement;
root.classList.add(containerFluid);

render(<App/>, root);
