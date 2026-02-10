import pool from '@/lib/db';
import Link from 'next/link';
import AddToCart from '@/components/AddToCart';
import { RowDataPacket } from 'mysql2';

interface Product extends RowDataPacket {
  id: number;
  name: string;
  price_per_piece: number;
  main_image: string;
  description: string;
  stock: number;
  created_at?: Date;
}

interface ProductImage extends RowDataPacket {
  image: string;
}

async function getProduct(id: string) {
    try {
        const [rows] = await pool.query<Product[]>('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function getExtraImages(id: string) {
    try {
        const [rows] = await pool.query<ProductImage[]>('SELECT image FROM product_images WHERE product_id = ?', [id]);
        return rows;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    const extraImages = await getExtraImages(id);

    if (!product) return <div className="container pt-100 pb-100"><h3>Proizvod nije pronađen.</h3></div>;

    // Serialize product for client component
    const serializedProduct = JSON.parse(JSON.stringify(product));

    return (
        <div className="ltn__shop-details-area pb-0 pt-80">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <div className="ltn__shop-details-img-gallery">
                            {/* LARGE IMAGES WRAPPER */}
                            <div className="ltn__shop-details-large-img">
                                {product.main_image && (
                                    <div className="single-large-img">
                                        <a href={product.main_image} data-rel="lightcase:myCollection">
                                            <img src={product.main_image} alt={product.name} />
                                        </a>
                                    </div>
                                )}
                                {extraImages.map((img, idx) => (
                                    <div className="single-large-img" key={idx}>
                                        <a href={img.image} data-rel="lightcase:myCollection">
                                            <img src={img.image} alt="Dodatna slika" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                           
                            {/* THUMBNAIL WRAPPER */}
                             <div className="ltn__shop-details-small-img slick-arrow-2">
                                {product.main_image && (
                                    <div className="single-small-img">
                                         <img src={product.main_image} alt="Thumb Main" />
                                    </div>
                                )}
                                {extraImages.map((img, idx) => (
                                    <div className="single-small-img" key={idx}>
                                        <img src={img.image} alt="Thumb Extra" />
                                    </div>
                                ))}
                            </div> 
                        </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="col-lg-6 col-md-12">
                        <div className="modal-product-info shop-details-info pl-0">
                            <h3>{product.name}</h3>
                            <div className="product-price">
                                <span>{Number(product.price_per_piece).toFixed(2)} RSD</span>
                            </div>
                            <p className="mt-20" dangerouslySetInnerHTML={{ __html: (product.description || "").replace(/\n/g, '<br/>') }} />
                            <p className="mt-10">Dostupna količina: <strong>{product.stock}</strong> kom</p>
                            
                            <AddToCart product={serializedProduct} />
                        </div>
                    </div>
                </div>
            </div>
            
             {/* FEATURE AREA START ( Feature - 3) */}
            <div className="ltn__feature-area before-bg-bottom-2-- mb--30--- plr--5 mb-120 mt-80">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ltn__feature-item-box-wrap ltn__border-between-column white-bg">
                                <div className="row">
                                    <div className="col-xl-3 col-md-6 col-12">
                                        <div className="ltn__feature-item ltn__feature-item-8">
                                            <div className="ltn__feature-icon">
                                                <img src="/img/icons/icon-img/11.png" alt="#" />
                                            </div>
                                            <div className="ltn__feature-info">
                                                <h4>Prava domaća jaja</h4>
                                                <p>Intenzivno žuto žumance, čvrsto belance.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-md-6 col-12">
                                        <div className="ltn__feature-item ltn__feature-item-8">
                                            <div className="ltn__feature-icon">
                                                <img src="/img/icons/icon-img/12.png" alt="#" />
                                            </div>
                                            <div className="ltn__feature-info">
                                                <h4>Najviši standard kvaliteta</h4>
                                                <p>Svako jaje je pažljivo odabrano i kontrolisano pre nego što stigne do vas.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-md-6 col-12">
                                        <div className="ltn__feature-item ltn__feature-item-8">
                                            <div className="ltn__feature-icon">
                                                <img src="/img/icons/icon-img/13.png" alt="#" />
                                            </div>
                                            <div className="ltn__feature-info">
                                                <h4>Prirodna ishrana</h4>
                                                <p>Kokoške se hrane zdravom, prirodnom hranom bez veštačkih dodataka.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-md-6 col-12">
                                        <div className="ltn__feature-item ltn__feature-item-8">
                                            <div className="ltn__feature-icon">
                                                <img src="/img/icons/icon-img/14.png" alt="#" />
                                            </div>
                                            <div className="ltn__feature-info">
                                                <h4>Besplatna dostava</h4>
                                                <p>Poručite online, a mi vam jaja dostavljamo sveža direktno na vaša vrata, potpuno besplatno.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* FEATURE AREA END */}
        </div>
    );
}
