import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Approutes from './config/routes'

function App() {
  return (
      <div>
        <BrowserRouter>
             <Approutes />
        </BrowserRouter>
      </div>
  )
}

export default App
