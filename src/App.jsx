import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "./User/Component/Homepage"
import Videocallpage from "./User/Component/Videocallpage"
import Remoteuservideocallpage from "./User/Component/Remoteuservideocallpage"

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/uservideocall" element={<Videocallpage />} />
      <Route path="/remoteuservideocall" element={<Remoteuservideocallpage />} />
    </Routes>
    </BrowserRouter>
    </>
    
  )
}

export default App
