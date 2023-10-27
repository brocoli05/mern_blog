import "./App.css";
// import Post from "./Post";
// import Header from "./Header";
import { Outlet, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import { UserContextProvider } from "./UserContext";
import Header from "./Header";
import Post from "./Post";

function App() {
  return (
    <UserContextProvider>
      <main>
        <Header />
        <Outlet />
      </main>

      <Post />
      <Routes>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
