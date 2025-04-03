import { Router } from '@solidjs/router';
import { routes } from './config';
import AuthProvider from '../features/auth/context/authContext';

export default function Routing() {
  return (
    <Router root={AuthProvider}>
      {routes}
    </Router>
  );
};
