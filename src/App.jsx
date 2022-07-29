import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import BookCreate from "./pages/BookCreate";
import Janken from "./pages/Janken";
import Omikuji from "./pages/Omikuji";

const App = () => {
  return (
    <BrowserRouter>
      <h1>React App</h1>
      <ul>
        <li>
          <Link to="/omikuji">おみくじ</Link>
        </li>
        <li>
          <Link to="/janken">じゃんけん</Link>
        </li>
        <li>
          <Link to="/book-create">投稿する</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/omikuji" element={<Omikuji />} />
        <Route path="/janken" element={<Janken />} />
        <Route path="/book-create" element={<BookCreate />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
