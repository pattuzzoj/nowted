import { Router } from '@solidjs/router';
import AuthProvider from '@context/auth';
import { routes } from './config';

export default function Routing() {
  return (
    <Router root={AuthProvider}>
      {routes}
    </Router>
  );
};