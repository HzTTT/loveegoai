import { RouterProvider } from 'react-router';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import { router } from './routes';
import '../styles/theme.css';
import '../styles/fonts.css';

export default function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </LanguageProvider>
  );
}
