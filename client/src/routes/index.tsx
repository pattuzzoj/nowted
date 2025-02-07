import { Router } from '@solidjs/router';
import { routes } from './config';
import DataProvider from 'context/data';

export default function Routing() {
  return (
    <Router root={DataProvider}>
      {routes}
    </Router>
  );
};