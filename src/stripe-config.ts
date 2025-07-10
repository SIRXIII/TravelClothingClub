export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SeSJXl91wOM5Bz',
    priceId: 'price_1Rj9OuENBRB5tgpsp6sNH65M',
    name: 'Basic',
    description: '2 outfits, Casual wear, Standard fabrics',
    mode: 'subscription',
    price: 49
  },
  {
    id: 'prod_SeSKy891iCokfC',
    priceId: 'price_1Rj9PtENBRB5tgpsHJJXmy0o',
    name: 'Upscale',
    description: '3 outfits + Business & casual mix + Premium materials',
    mode: 'subscription',
    price: 89
  },
  {
    id: 'prod_SeSLIBkgPAbEmA',
    priceId: 'price_1Rj9QhENBRB5tgpsVBQBZ3H7',
    name: 'Vacay Mode',
    description: '4 outfits + Resort-wear &  accessories + Priority delivery',
    mode: 'subscription',
    price: 119
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}