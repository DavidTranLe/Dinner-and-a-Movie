export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    imageurl: string;
    category?: string;
  }

  export interface CartItem extends MenuItem {
    quantity: number;
    notes?: string;
    partyMember?: string;
  }

  export interface CartState {
    items: CartItem[];
  }

  export interface CartContextType extends CartState {
    addItem: (item: MenuItem, quantity?: number) => void;
    removeItem: (itemId: number) => void;
    updateItemNotes: (itemId: number, notes: string) => void;
    updatePartyMember: (itemId: number, partyMember: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
  }

  export interface Order {
      id: number;
      orderDate: string;
      items: CartItem[];
      subtotal: number;
      tax: number;
      tip: number;
      total: number;
  }
