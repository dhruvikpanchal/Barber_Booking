import AppRoutes from './router/app.route.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authContext.jsx';
import { ReactQueryProvider } from './config/QueryProvider.jsx';

function App() {
  return (
    <AuthProvider>
      <ReactQueryProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ReactQueryProvider>
    </AuthProvider>
  );
}

export default App;
