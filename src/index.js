// Node modules.
import React from 'react';
import { render } from 'react-dom';

// Relative imports.
import './globalStyles.css';
import App from "components/App";
import * as serviceWorker from './serviceWorker';

render(<App />, document.getElementById('root'));



serviceWorker.unregister();
