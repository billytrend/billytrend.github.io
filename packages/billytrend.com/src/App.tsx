import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BlogList from './BlogList';
import Layout from './components/Layout';
import PostPage from './pages/Post';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/articles/:slug" element={<PostPage />} />
          <Route path="*" element={<BlogList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
