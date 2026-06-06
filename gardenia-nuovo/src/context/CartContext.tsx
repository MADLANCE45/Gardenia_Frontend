import React, { createContext, useState, type ReactNode } from 'react';

interface CartContextType {
  cartCount: number;
  addToCart: (productId: number, quantity: number, price: number) => Promise<boolean>;
  clearCart: () => void; // NUOVO: Funzione per svuotare il carrello visivo
}

export const CartContext = createContext<CartContextType>({
  cartCount: 0,
  addToCart: async () => false,
  clearCart: () => {}, // Inizializzazione a vuoto
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // NUOVA FUNZIONE: Azzera il conteggio
  const clearCart = () => {
    setCartCount(0);
  };

  const addToCart = async (productId: number, quantity: number, price: number): Promise<boolean> => {
    const userString = localStorage.getItem('user');
    
    if (!userString) {
      alert("Devi effettuare il login per aggiungere prodotti al carrello!");
      return false; 
    }

    const user = JSON.parse(userString);
    const userName = user.userName; 

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
        // Mi assicuro che la quantità venga sommata come numero
        setCartCount((prevCount) => prevCount + Number(quantity));
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
    <CartContext.Provider value={{ cartCount, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};