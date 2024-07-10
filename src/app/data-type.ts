export interface Signup {
  name: string;
  email: string;
  password: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Product {
  name: string;
  price: number;
  category: string;
  color: string;
  description: string;
  image: string;
  _id: number;
  quantity: undefined | number;
  productId: undefined | number;
}

export interface Cart {
  name: string;
  price: number;
  category: string;
  color: string;
  description: string;
  image: string;
  _id: undefined|number;
  quantity: undefined | number;
  userId:number,
  productId:number
}

export interface Price {
 price: number;
 discount:number;
 tax:number;
 delivery:number;
 total:number
}

export interface Order{
  email:string;
  address:string;
  contact:string;
  totalPrice:number;
  userId:string;
  _id: number | undefined;
}