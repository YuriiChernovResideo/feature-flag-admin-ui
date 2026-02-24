import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { GroupListPage } from './pages/GroupListPage';
import { GroupDetailsPage } from './pages/GroupDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<GroupListPage />} />
          <Route path="/groups/:id" element={<GroupDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
