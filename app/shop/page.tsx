import Link from 'next/link';
import { fetchPhpApiJson } from '@/lib/php-api';
import AddToCartButton from '@/components/AddToCartButton';
import { resolveProductImage } from '@/lib/product-image';

interface Product {
  id: number;
  name: string;
  price_per_piece: number;
  main_image: string;
}

async function getProducts() {
  try {
    const response = await fetchPhpApiJson<{ status: string; products: Product[] }>('products.php', {
      cache: 'force-cache',
      next: { revalidate: 300 },
    });
    return response.status === 'success' ? response.products : [];
  } catch {
    return [];
  }
}

export default async function Shop() {
    const products = await getProducts();

    return (
        <div className="ltn__product-area ltn__product-gutter mb-120 pt-80">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title-area ltn__section-title-2 text-center">
                            <h1 className="section-title">Prodavnica</h1>
                        </div>
                        <div className="tab-content">
                             <div className="row ltn__tab-product-slider-one-active--- slick-arrow-1">
                                {products.map((product) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={product.id}>
                                        <div className="ltn__product-item ltn__product-item-3 text-center">
                                            <div className="product-img">
                                                <Link href={`/product/${product.id}`}>
                                                    <img src={resolveProductImage(product.name, product.main_image)} alt={product.name} />
                                                </Link>
                                                <div className="product-hover-action">
                                                    <ul>
                                                        <li>
                                                            <Link href={`/product/${product.id}`} title="Quick View">
                                                                <i className="far fa-eye"></i>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <AddToCartButton productId={product.id} productName={product.name} className="theme-btn-1 btn btn-effect-1 btn-sm" />
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="product-info">
                                                <h2 className="product-title">
                                                    <Link href={`/product/${product.id}`}>{product.name}</Link>
                                                </h2>
                                                <div className="product-price">
                                                    <span>{Number(product.price_per_piece).toFixed(2)} RSD</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
