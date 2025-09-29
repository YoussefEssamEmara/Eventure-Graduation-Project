import React, { createContext, useState } from 'react';

export const TicketContext = createContext();

export function TicketContextProvider ({ children })  {
  const [ticketCount, setTicketCount] = useState(1);
  const ticketPrice = 50.0;

  const totalPrice = ticketCount * ticketPrice;

  return (
    <TicketContext.Provider value={{ ticketCount, setTicketCount, totalPrice }}>
      {children}
    </TicketContext.Provider>
  );
};