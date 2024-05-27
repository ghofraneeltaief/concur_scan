

import { uniqueId } from 'lodash';

const Menuitems = [
  
  {
    id: uniqueId(),
    title: 'Dashboard',
    href: '/Dashboard',
  },
  {
    id: uniqueId(),
    title: 'Gestion Keywords',
    href: '/Keywords',
  },
  {
    id: uniqueId(),
    title: 'Gestion Pages',
    href: '/Pages',
  },
  {
    id: uniqueId(),
    title: 'Gestion Concurrents',
    href: '/Concurrents',
  },
];

export default Menuitems;
