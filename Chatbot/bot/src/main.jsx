import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Bot from './Bot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Bot />
  </StrictMode>,
)
