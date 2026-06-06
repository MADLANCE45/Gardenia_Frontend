import React, { createContext, useState, type ReactNode } from 'react';

interface CartContextType {
  cartCount: number;
  // Aggiungiamo il prezzo ai parametri richiesti
  addToCart: (productId: number, quantity: number, price: number) => Promise<boolean>;
}

export const CartContext = createContext<CartContextType>({
  cartCount: 0,
  addToCart: async () => false,
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = async (productId: number, quantity: number, price: number): Promise<boolean> => {
    
    const userString = localStorage.getItem('user');
    
    if (!userString) {
      alert("Devi effettuare il login per aggiungere prodotti al carrello!");
      return false; 
    }

    const user = JSON.parse(userString);
    const userName = user.userName; 

    // OGGETTO CORRETTO: Ora inviamo anche il prezzo come richiesto da Java!
    const cartItemReq = {
      userName: userName,
      idProduct: productId,
      amount: quantity,
      price: price
    };

    try {
      const response = await fetch('http://localhost:8080/rest/shoppingCart/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItemReq)
      });

      if (response.ok) {
        setCartCount((prevCount) => prevCount + quantity);
        return true;
      } else {
        console.error("Errore dal server durante l'aggiunta al carrello");
        return false;
      }
    } catch (error) {
      console.error("Errore di connessione al database:", error);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};