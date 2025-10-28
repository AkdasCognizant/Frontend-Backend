export interface MenuItem {
    Itemid: number;
    name: string;
    price: number;
    image: string;
}

export interface Menu {
    id: number;
    restaurantId: number;
    items: MenuItem[];
}
export interface Restaurant {
    id: string;
    name: string;
    rating: number;
    image: string;
    cusine: string;
}