if (!crypto.randomUUID) {
  crypto.randomUUID = () => {
    const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    const bytes = new Uint8Array(16);
    if (crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 16; i++) bytes[i] = Math.random() * 256;
    }
    let i = 0;
    return pattern.replace(/[xy]/g, c => {
      const r = bytes[i++] & 0xf;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}


import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Appcontext from './appcontext.jsx'

createRoot(document.getElementById('root')).render(
    <Appcontext>
    <App />
    </Appcontext>
 
)
