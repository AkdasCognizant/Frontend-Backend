export interface Cartitem {
  itemID: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  originalPrice?: number;
}

export interface UserCart {
  id?: number;               
  userID: number;            
  restID: number;            
  restaurantName: string;    
  items: Cartitem[];
  itemCount: number;
  totalAmount: number;
}
