import pool from '@/lib/db';
import Link from 'next/link';
import { RowDataPacket } from 'mysql2';

// Define types for our data
interface Product extends RowDataPacket {
  id: number;
  name: string;
  price_per_piece: number;
  main_image: string;
  created_at?: Date;
}

interface TopProduct extends RowDataPacket {
  id: number;
  name: string;
  main_image: string;
  total_sold: number;
}

async function getProducts() {
  try {
    const [rows] = await pool.query<Product[]>('SELECT * FROM products ORDER BY created_at ASC');
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

async function getTopProducts() {
  try {
    const [rows] = await pool.query<TopProduct[]>(`
        SELECT p.id, p.name, p.main_image, SUM(oi.quantity) AS total_sold
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        GROUP BY p.id
        ORDER BY total_sold DESC
        LIMIT 4
    `);
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  const topProducts = await getTopProducts();

  return (
    <>
        {/* SLIDER AREA START (slider-3) */}
        <div className="ltn__slider-area ltn__slider-3  section-bg-1">
            <div className="ltn__slide-one-active slick-slide-arrow-1 slick-slide-dots-1">
                {/* ltn__slide-item */}
                <div className="ltn__slide-item ltn__slide-item-2 ltn__slide-item-3 ltn__slide-item-3-normal">
                    <div className="ltn__slide-item-inner">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 align-self-center">
                                    <div className="slide-item-info">
                                        <div className="slide-item-info-inner ltn__slide-animation">
                                            <h6 className="slide-sub-title animated"><img style={{ maxWidth: "20px" }}
                                                    src="/content/jajce.png" alt="#" /> 100% Sveža, prirodna i slobodno uzgojena jaja</h6>
                                            <h1 className="slide-title animated">Sveža jaja
                                                <br />direktno sa farme na vaš sto
                                            </h1>
                                            <div className="slide-brief animated">
                                                <p>Bez posrednika, bez stajanja u skladištima – samo pravo domaće iskustvo i vrhunski kvalitet.
                                                </p>
                                            </div>
                                            <div className="btn-wrapper animated">
                                                <Link href="/shop" className="theme-btn-1 btn btn-effect-1 text-uppercase">Naruči jaja</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="slide-item-img">
                                        <img src="/content/kokoska.png" alt="#" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ltn__slide-item */}
                <div className="ltn__slide-item ltn__slide-item-2 ltn__slide-item-3 ltn__slide-item-3-normal">
                    <div className="ltn__slide-item-inner text-right text-end">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 align-self-center">
                                    <div className="slide-item-info">
                                        <div className="slide-item-info-inner ltn__slide-animation">
                                            <h6 className="slide-sub-title ltn__secondary-color animated">// 100% PRIRODNA
                                                DOMAĆA JAJA</h6>
                                            <h1 className="slide-title animated ">Sveža & nutritivna <br /> jaja sa naše farme
                                            </h1>
                                            <div className="slide-brief animated">
                                                <p>Prirodno uzgojena jaja, bez aditiva i veštačkih dodataka. Bogata
                                                    proteinima i savršena za zdrav početak dana!</p>
                                            </div>
                                            <div className="btn-wrapper animated">
                                                <Link href="/shop" className="theme-btn-1 btn btn-effect-1 text-uppercase">Pogledaj Ponudu</Link>
                                                <Link href="/about" className="btn btn-transparent btn-effect-3">Saznaj više</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="slide-item-img slide-img-left">
                                        <img src="/content/farma.png" alt="Sveža domaća jaja" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* SLIDER AREA END */}

        {/* PRODUCT TAB AREA START */}
        <div className="ltn__product-tab-area ltn__product-gutter pt-50 pb-30">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title-area ltn__section-title-2 text-center">
                            <h1 className="section-title">Naši proizvodi</h1>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="ltn__tab-product-slider-one-active slick-arrow-1">
                            {products.map((product) => (
                                <div className="col-lg-12" key={product.id}>
                                    <div className="ltn__product-item ltn__product-item-3 text-center">
                                        <div className="product-img">
                                            <Link href={`/product/${product.id}`}>
                                                <img src={product.main_image} alt={product.name} />
                                            </Link>
                                            <div className="product-hover-action">
                                                <ul>
                                                    <li>
                                                        <Link href={`/product/${product.id}`} title="Quick View">
                                                            <i className="far fa-eye"></i>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                                                            <i className="fas fa-shopping-cart"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                                                            <i className="far fa-heart"></i>
                                                        </a>
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
        {/* PRODUCT TAB AREA END */}

        {/* FEATURE AREA START ( Feature - 3) */}
        <div className="ltn__feature-area mt--65">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ltn__feature-item-box-wrap ltn__feature-item-box-wrap-2 ltn__border section-bg-6">
                            <div className="ltn__feature-item ltn__feature-item-8">
                                <div className="ltn__feature-icon">
                                    <img src="/img/icons/svg/8-trolley.svg" alt="#" />
                                </div>
                                <div className="ltn__feature-info">
                                    <h4>Brza isporuka</h4>
                                    <p>Jaja od srećnih koka stižu na vaša vrata u najkraćem roku – istog dana kada su snesena, direktno iz slobodnog uzgoja.</p>
                                </div>
                            </div>
                            <div className="ltn__feature-item ltn__feature-item-8">
                                <div className="ltn__feature-icon">
                                    <img src="/img/icons/svg/9-money.svg" alt="#" />
                                </div>
                                <div className="ltn__feature-info">
                                    <h4>Garancija kvaliteta</h4>
                                    <p>Samo jaja iz slobodnog uzgoja – prirodna, nutritivno bogata i uvek sveža, od koka koje žive bez stresa.</p>
                                </div>
                            </div>
                            <div className="ltn__feature-item ltn__feature-item-8">
                                <div className="ltn__feature-icon">
                                    <img src="/img/icons/svg/11-gift-card.svg" alt="#" />
                                </div>
                                <div className="ltn__feature-info">
                                    <h4>Akcije i popusti</h4>
                                    <p>Uživajte u zdravijim jajima po još povoljnijoj ceni – posebne ponude za ljubitelje slobodnog uzgoja.</p>
                                </div>
                            </div>
                            <div className="ltn__feature-item ltn__feature-item-8">
                                <div className="ltn__feature-icon">
                                    <img src="/img/icons/svg/10-credit-card.svg" alt="#" />
                                </div>
                                <div className="ltn__feature-info">
                                    <h4>Posebne ponude za naše kupce</h4>
                                    <p>Nagrađujemo vašu brigu o zdravlju i životinjama – ekskluzivne akcije i pokloni za sve koji biraju srećne koke.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* FEATURE AREA END */}

        {/* ABOUT US AREA START */}
        <div className="ltn__about-us-area pt-50 pb-120">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 align-self-center">
                        <div className="about-us-img-wrap about-img-left">
                            <img src="/content/farma.jpg" alt="O nama" />
                        </div>
                    </div>
                    <div className="col-lg-6 align-self-center">
                        <div className="about-us-info-wrap">
                            <div className="section-title-area ltn__section-title-2">
                                <h6 className="section-subtitle ltn__secondary-color">O Nama</h6>
                                <h1 className="section-title">Nova generacija <br className="d-none d-md-block" /> slobodnog uzgoja</h1>
                                <p>Ja sam Danilo Nešić, imam 21 godinu i dolazim iz porodice koja se živinarstvom bavi profesionalno već više od tri decenije. Moj otac je još u mojim godinama imao farmu sa 5.000 koka i radio ovaj posao na visokom nivou.</p>
                                <p>Danas sam odlučio da nastavim tu tradiciju – ali na svoj način. Kao što svaki sin treba da teži da nadmaši svog oca, pronašao sam način da živinarstvo podignem na viši nivo: slobodan uzgoj, prirodna ishrana i maksimalna svežina proizvoda. Naše koke slobodno šetaju, kljucaju travu i žitarice koje sami pripremamo, bez veštačkih dodataka.</p>
                            </div>
                            <p>Rezultat su jaja bogatijeg ukusa, zdravija i nutritivno jača, koja stižu na vašu adresu istog dana kada su snesena. Jajce.rs je spoj iskustva i inovacije – tradicija našeg doma, unapređena idejom nove generacije.</p>
                            <div className="about-author-info d-flex">
                                <div className="author-name-designation align-self-center mr-30">
                                    <h4 className="mb-0">Danilo Nešić</h4>
                                    <small>/ Osnivač i vlasnik</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* ABOUT US AREA END */}

        {/* MOST SOLD PRODUCTS SECTION START */}
        <div className="ltn__category-area section-bg-1-- ltn__primary-bg before-bg-1 bg-image bg-overlay-theme-black-5--0 pt-115 pb-90" data-bg="img/bg/5.jpg" style={{ backgroundImage: "url('/img/bg/5.jpg')" }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title-area ltn__section-title-2 text-center">
                            <h1 className="section-title white-color">Najprodavanije</h1>
                        </div>
                    </div>
                </div>

                <div className="row ltn__category-slider-active slick-arrow-1">
                    {topProducts.map((prod) => (
                        <div className="col-12" key={prod.id}>
                            <div className="ltn__category-item ltn__category-item-3 text-center">
                                <div className="ltn__category-item-img">
                                    <Link href={`/product/${prod.id}`}>
                                        {prod.main_image ? (
                                            <img style={{ width: "200px", height: "200px", objectFit: "contain" }} src={prod.main_image} alt="Product Image" />
                                        ) : (
                                            <img src="/img/no-image.jpg" alt="No Image" />
                                        )}
                                    </Link>
                                </div>
                                <div className="ltn__category-item-name">
                                    <h5><Link href={`/product/${prod.id}`}>{prod.name}</Link></h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {/* MOST SOLD PRODUCTS SECTION END */}

        {/* COUNTER UP AREA START */}
        <div className="ltn__counterup-area bg-image bg-overlay-theme-black-80 pt-115 pb-70" data-bg="img/bg/5.jpg" style={{ backgroundImage: "url('/img/bg/5.jpg')" }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-4 col-sm-6 align-self-center">
                        <div className="ltn__counterup-item-3 text-color-white text-center">
                            <div className="counter-icon"> <img src="/img/icons/icon-img/2.png" alt="#" /> </div>
                            <h1><span className="counter">100</span><span className="counterUp-letter">%</span><span className="counterUp-icon">+</span> </h1>
                            <h6>Sveža jaja</h6>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 align-self-center">
                        <div className="ltn__counterup-item-3 text-color-white text-center">
                            <div className="counter-icon"> <img src="/img/icons/icon-img/3.png" alt="#" /> </div>
                            <h1><span className="counter">100</span><span className="counterUp-letter">%</span><span className="counterUp-icon">+</span> </h1>
                            <h6>Prirodna i sveža</h6>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 align-self-center">
                        <div className="ltn__counterup-item-3 text-color-white text-center">
                            <div className="counter-icon"> <img src="/img/icons/icon-img/5.png" alt="#" /> </div>
                            <h1><span className="counter">100</span><span className="counterUp-icon">%</span> </h1>
                            <h6>Iz slobodnog uzgoja</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* COUNTER UP AREA END */}

        {/* BLOG AREA START (blog-3) */}
        <div className="ltn__blog-area pt-115 pb-70">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title-area ltn__section-title-2 text-center">
                            <h1 className="section-title white-color---">Zanimljivosti</h1>
                        </div>
                    </div>
                </div>
                <div className="row ltn__blog-slider-one-active slick-arrow-1 ltn__blog-item-3-normal">
                    {/* Blog Item 1 */}
                    <div className="col-lg-12">
                        <div className="ltn__blog-item ltn__blog-item-3">
                            <div className="ltn__blog-img">
                                <Link href="#"><img src="/img/blog/3.jpg" alt="#" /></Link>
                            </div>
                            <div className="ltn__blog-brief">
                                <div className="ltn__blog-meta">
                                    <ul>
                                        <li className="ltn__blog-author">
                                            <Link href="#"><i className="far fa-user"></i>by: Danilo</Link>
                                        </li>
                                        <li className="ltn__blog-tags">
                                            <Link href="#"><i className="fas fa-tags"></i>Zanimljivosti</Link>
                                        </li>
                                    </ul>
                                </div>
                                <h3 className="ltn__blog-title"><Link href="#">Zašto su domaća jaja bolja od industrijskih?</Link></h3>
                                <div className="ltn__blog-meta-btn">
                                    <div className="ltn__blog-meta">
                                        <ul>
                                            <li className="ltn__blog-date"><i className="far fa-calendar-alt"></i>Mart 6, 2025</li>
                                        </ul>
                                    </div>
                                    <div className="ltn__blog-btn">
                                        <Link href="#">Pročitaj više</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                     {/* Blog Item 2 */}
                     <div className="col-lg-12">
                        <div className="ltn__blog-item ltn__blog-item-3">
                            <div className="ltn__blog-img">
                                <Link href="#"><img src="/img/blog/4.jpg" alt="#" /></Link>
                            </div>
                            <div className="ltn__blog-brief">
                                <div className="ltn__blog-meta">
                                    <ul>
                                        <li className="ltn__blog-author">
                                            <Link href="#"><i className="far fa-user"></i>by: Ivan</Link>
                                        </li>
                                        <li className="ltn__blog-tags">
                                            <Link href="#"><i className="fas fa-tags"></i>Nutricija</Link>
                                        </li>
                                    </ul>
                                </div>
                                <h3 className="ltn__blog-title"><Link href="#">Koliko jaja je zdravo pojesti dnevno?</Link></h3>
                                <div className="ltn__blog-meta-btn">
                                    <div className="ltn__blog-meta">
                                        <ul>
                                            <li className="ltn__blog-date"><i className="far fa-calendar-alt"></i>Mart 5, 2025</li>
                                        </ul>
                                    </div>
                                    <div className="ltn__blog-btn">
                                        <Link href="#">Pročitaj više</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                     {/* Blog Item 3 */}
                     <div className="col-lg-12">
                        <div className="ltn__blog-item ltn__blog-item-3">
                            <div className="ltn__blog-img">
                                <Link href="#"><img src="/img/blog/5.jpg" alt="#" /></Link>
                            </div>
                            <div className="ltn__blog-brief">
                                <div className="ltn__blog-meta">
                                    <ul>
                                        <li className="ltn__blog-author">
                                            <Link href="#"><i className="far fa-user"></i>by: Danijela</Link>
                                        </li>
                                        <li className="ltn__blog-tags">
                                            <Link href="#"><i className="fas fa-tags"></i>Recepti</Link>
                                        </li>
                                    </ul>
                                </div>
                                <h3 className="ltn__blog-title"><Link href="#">Najbolji recepti sa domaćim jajima</Link></h3>
                                <div className="ltn__blog-meta-btn">
                                    <div className="ltn__blog-meta">
                                        <ul>
                                            <li className="ltn__blog-date"><i className="far fa-calendar-alt"></i>Mart 4, 2025</li>
                                        </ul>
                                    </div>
                                    <div className="ltn__blog-btn">
                                        <Link href="#">Pročitaj više</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* BLOG AREA END */}

        {/* FEATURE AREA START ( Feature - 3) */}
        <div className="ltn__feature-area before-bg-bottom-2-- mb--30--- plr--5 mb-120">
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
    </>
  );
}
