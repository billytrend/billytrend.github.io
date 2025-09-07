import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BlogList from './BlogList';
import PostPage from './pages/Post';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/article/:slug" element={<PostPage />} />
          <Route path="*" element={<BlogList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
