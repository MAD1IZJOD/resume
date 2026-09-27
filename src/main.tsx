import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/layout.css'
import './styles/phone.css'
import './styles/sections.css'
import './styles/ui.css'
import App from './App'

// No StrictMode: drei's <Html> manages its own React root and its double
// mount/unmount in dev races with React 19 and drops the phone screen.
createRoot(document.getElementById('root')!).render(<App />)
