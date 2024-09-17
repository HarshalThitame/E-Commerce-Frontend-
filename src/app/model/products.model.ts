export interface Product{
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  seller: any;
  categories :any[];
  subSubCategories: any[];
  subCategories: any[];
  images:any[];
  // quantity:number;
  published:boolean;
  productHighlights:any[]

}
