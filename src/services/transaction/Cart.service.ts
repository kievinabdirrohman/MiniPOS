let products: any[] = JSON.parse( localStorage.getItem('products') || '');
let cartItems: any[] = [];

const addProductToCart = (skuProduct: string) => {
    try {
        let selectedProduct = products.find(product => product.sku === skuProduct);

        return selectedProduct;
    } catch (error) {
        return 'error';
    }
}

const CartService = { addProductToCart };

export default CartService