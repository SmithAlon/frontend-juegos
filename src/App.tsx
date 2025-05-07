import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registro from "./pages/Registro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registro />} />
        {/* Aquí puedes agregar más rutas según necesites */}
      </Routes>
    </Router>
  )
}

export default App;