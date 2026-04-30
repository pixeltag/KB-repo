import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import KnowledgeBases from './pages/KnowledgeBases';
import CreateWizard from './pages/KnowledgeBases/CreateWizard';
import KnowledgeBaseDetails from './pages/KnowledgeBases/Details';
import { KnowledgeBasesProvider } from './state/knowledgeBases';

function App() {
  return (
    <KnowledgeBasesProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/knowledge-bases" replace />} />
          <Route path="knowledge-bases" element={<KnowledgeBases />} />
          <Route path="knowledge-bases/create" element={<CreateWizard />} />
          <Route path="knowledge-bases/:id" element={<KnowledgeBaseDetails />} />
        </Route>
      </Routes>
    </KnowledgeBasesProvider>
  );
}

export default App;
