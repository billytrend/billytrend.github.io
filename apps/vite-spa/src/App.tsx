import { HashRouter, Routes, Route } from 'react-router-dom';
import BlogList from './BlogList';
import PostPage from './pages/Post';
import Layout from './components/Layout';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="*" element={<BlogList />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
