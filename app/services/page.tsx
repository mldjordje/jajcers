import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface HistoryEvent extends RowDataPacket {
  year: string;
  title: string;
  description: string;
}

interface Service extends RowDataPacket {
  title: string;
  description: string;
  image: string;
}

async function getHistory() {
  try {
    const [rows] = await pool.query<HistoryEvent[]>('SELECT * FROM history ORDER BY year ASC');
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getServices() {
  try {
    const [rows] = await pool.query<Service[]>('SELECT * FROM services ORDER BY id ASC');
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ServicesPage() {
  const history = await getHistory();
  const services = await getServices();

  return (
    <>
      <div className="ltn__breadcrumb-area ltn__breadcrumb-area-2 ltn__breadcrumb-color-white bg-overlay-theme-black-90 bg-image" data-bg="/content/thumbnail.jpg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="ltn__breadcrumb-inner ltn__breadcrumb-inner-2 justify-content-between">
                <div className="section-title-area ltn__section-title-2">
                  <h6 className="section-subtitle ltn__secondary-color">// Usluge koje pružamo</h6>
                  <h1 className="section-title white-color">Usluge</h1>
                </div>
                <div className="ltn__breadcrumb-list">
                  <ul>
                    <li><a href="/">Početna</a></li>
                    <li>Usluge</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       <div className="ltn__about-us-area pb-115">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 align-self-center">
                        <div className="about-us-img-wrap ltn__img-shape-left about-img-left">
                            <img src="/content/kokoska-2.jpg" alt="Naša farma" />
                        </div>
                    </div>
                    <div className="col-lg-7 align-self-center">
                        <div className="about-us-info-wrap">
                            <div className="section-title-area ltn__section-title-2">
                                <h6 className="section-subtitle ltn__secondary-color">// SVEŽA DOMAĆA JAJA</h6>
                                <h1 className="section-title">Prirodna i kvalitetna proizvodnja<span>.</span></h1>
                                <p>Naša farma se bavi proizvodnjom visokokvalitetnih domaćih jaja, bez industrijskih
                                    dodataka, direktno sa sela do vašeg stola.</p>
                            </div>
                            <div className="about-us-info-wrap-inner about-us-info-devide">
                                <p>Verujemo u zdravu ishranu i kvalitetne proizvode. Naše kokoške se hrane isključivo
                                    prirodnom hranom, bez pesticida i hormona. Sva jaja su ručno birana i pakovana sa
                                    posebnom pažnjom kako bismo osigurali vrhunski kvalitet za naše kupce.</p>
                                <div className="list-item-with-icon">
                                    <ul>
                                        <li><a href="/contact">Brza dostava na kućnu adresu</a></li>
                                        <li><a href="/about">Porodična proizvodnja</a></li>
                                        <li><a href="/about">Prirodna ishrana kokošaka</a></li>
                                        <li><a href="/shop">Najkvalitetnija sveža jaja</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      <div className="ltn__service-area section-bg-1 pt-115 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area ltn__section-title-2 text-center">
                <h1 className="section-title">Naše usluge</h1>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {services.map((service, index) => (
              <div className="col-lg-4 col-sm-6" key={index}>
                <div className="ltn__service-item-1">
                  <div className="service-item-img">
                    <img src={service.image} alt={service.title} />
                  </div>
                  <div className="service-item-brief">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

       <div className="ltn__our-journey-area bg-image bg-overlay-theme-90 pt-280 pb-140 mb-35 plr--9" data-bg="/img/bg/8.jpg">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ltn__our-journey-wrap">
                            <ul>
                                {history.map((event, index) => (
                                    <li key={index}>
                                        <span className="ltn__journey-icon">{event.year}</span>
                                        <ul>
                                            <li>
                                                <div className="ltn__journey-history-item-info clearfix">
                                                    <div className="ltn__journey-history-img">
                                                        <img src="/img/service/history-1.jpg" style={{ maxWidth: '100px' }} alt="Istorija" />
                                                    </div>
                                                    <div className="ltn__journey-history-info">
                                                        <h3>{event.title}</h3>
                                                        <p>{event.description}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}
