import moment from 'moment-timezone';
import {StaticConf} from '../conf';

const is: boolean = moment().format() === moment.tz(StaticConf.GAME_TIMEZONE).format();

export {is as IS_IN_GAME_TIMEZONE};
