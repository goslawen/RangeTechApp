import React from 'react';
import {ResourceView} from './ResourceScreen';

export function ServiceScreen(): React.JSX.Element {
  return (
    <ResourceView
      notice="Sekcja Serwis obsługuje zgłoszenia klientów dotyczące konkretnych urządzeń RangeTech."
      resourceKey="serviceTickets"
    />
  );
}
