/*import ReactDOM from 'react-dom';
import Main from './main';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 


ReactDOM.render(<Main />, document.getElementById('root'));*/

import { createRoot } from 'react-dom/client'; 
import Main from './main';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

const container = document.getElementById('root'); 
const root = createRoot(container); 
root.render(<Main />); 