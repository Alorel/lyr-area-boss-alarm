import {useState} from 'preact/hooks';

let counter = 0;

function createId(): string {
  return `el-${(counter++).toString(32)}`;
}

export function useControlId(): string {
  return useState(createId)[0];
}
