// @flow
import 'react-hot-loader/patch';

import 'babel-polyfill';
import P from 'bluebird';
import Raven from 'raven-js';

global.Promise = P;

/*:: declare var SENTRY_DSN: string */
Raven.config(SENTRY_DSN).install();
