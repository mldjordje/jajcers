import { fetchPhpApiJson } from '@/lib/php-api';

interface TeamMember {
  firstname: string;
  lastname: string;
  position: string;
  phone_number: string;
  image: string;
}

interface Testimonial {
  name: string;
  position: string;
  comment: string;
  image_base64?: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

async function getAboutData() {
  try {
    const response = await fetchPhpApiJson<{
      status: string;
      teamMembers: TeamMember[];
      testimonials: Testimonial[];
      faqs: FAQ[];
    }>('aboutData.php', {
      cache: 'force-cache',
      next: { revalidate: 300 },
    });

    if (response.status !== 'success') {
      return { teamMembers: [], testimonials: [], faqs: [] };
    }

    return {
      teamMembers: response.teamMembers ?? [],
      testimonials: response.testimonials ?? [],
      faqs: response.faqs ?? [],
    };
  } catch (error) {
    console.error(error);
    return { teamMembers: [], testimonials: [], faqs: [] };
  }
}

export default async function AboutPage() {
  const { teamMembers, testimonials, faqs } = await getAboutData();

  return (
    <>
      {/* BREADCRUMB AREA START */}
      <div className="ltn__breadcrumb-area ltn__breadcrumb-area-2 ltn__breadcrumb-color-white bg-overlay-theme-black-90 bg-image" data-bg="/content/thumbnail.jpg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="ltn__breadcrumb-inner ltn__breadcrumb-inner-2 justify-content-between">
                <div className="section-title-area ltn__section-title-2">
                  <h6 className="section-subtitle ltn__secondary-color">// O našoj farmi</h6>
                  <h1 className="section-title white-color">O nama</h1>
                </div>
                <div className="ltn__breadcrumb-list">
                  <ul>
                    <li><a href="/">Početna</a></li>
                    <li>O nama</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* BREADCRUMB AREA END */}

      {/* ABOUT US AREA START */}
      <div className="ltn__about-us-area pt-0 pb-120">
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
                  <h1 className="section-title">Domaća jaja <br className="d-none d-md-block" /> sa naše farme</h1>
                  <p>Mi smo domaća farma posvećena kvalitetu i svežini! Naše kokoške hranimo koncentratom
                    koji sami pravimo od žitarica uzgajanih na lokalnim poljima. To znači da tačno znamo
                    šta jedu i da su hranjene isključivo kvalitetnim sastojcima, bez veštačkih dodataka.
                  </p>
                </div>
                <p>Za razliku od industrijskih jaja iz supermarketa, naša jaja ne provode dane i nedelje u
                  skladištima – ona stižu na vašu adresu istog dana kada su proizvedena!
                </p>
                <p>Kupovinom kod nas ne dobijate samo kvalitetniji proizvod, već i podržavate lokalne
                  farmere i domaću poljoprivredu.
                </p>
                <div className="about-author-info d-flex">
                  <div className="author-name-designation align-self-center mr-30">
                    <h4 className="mb-0">Danilo Nešić</h4>
                    <small>/ Menadžer marketinga i prodaje</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ABOUT US AREA END */}

      {/* TEAM AREA START */}
      <div className="ltn__team-area pt-50 pb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area ltn__section-title-2 text-center">
                <h1 className="section-title">Naš tim</h1>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {teamMembers.map((member, index) => (
              <div className="col-xl-3 col-lg-4 col-sm-6" key={index}>
                <div className="ltn__team-item">
                  <div className="team-img">
                    <img src={member.image} alt="Član tima" />
                  </div>
                  <div className="team-info">
                    <h6 className="ltn__secondary-color" style={{ fontSize: '14px' }}>// {member.position} //</h6>
                    <h4><a href="#">{member.firstname} {member.lastname}</a></h4>
                    <span>{member.phone_number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* TEAM AREA END */}

      {/* TESTIMONIAL AREA START */}
      <div className="ltn__testimonial-area section-bg-1 pt-115 pb-70">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area ltn__section-title-2 text-center">
                <h6 className="section-subtitle ltn__secondary-color">// Utisci naših kupaca //</h6>
                <h1 className="section-title">Šta kažu naši kupci<span>.</span></h1>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
             {/* Note: Slider functionality might need client component wrapper if essential, for now listing them in grid/row */}
             {testimonials.map((testimonial, index) => (
               <div className="col-lg-4 col-md-6" key={index}>
                  <div className="ltn__testimonial-item ltn__testimonial-item-4">
                      <div className="ltn__testimoni-img">
                          {testimonial.image_base64 ? (
                              <img src={`data:image/jpeg;base64,${testimonial.image_base64}`} alt="Testimonial Image" />
                          ) : (
                              <img src="/content/user.jpg" alt="Default Image" />
                          )}
                      </div>
                      <div className="ltn__testimoni-info">
                          <p>{testimonial.comment}</p>
                          <h4>{testimonial.name}</h4>
                          <h6>{testimonial.position}</h6>
                      </div>
                       <div className="ltn__testimoni-bg-icon">
                          <i className="far fa-comments"></i>
                      </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
      {/* TESTIMONIAL AREA END */}

      {/* FAQ AREA START */}
      <div className="ltn__faq-area pt-115 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area ltn__section-title-2 text-center">
                 <h1 className="section-title">Često postavljana pitanja</h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="ltn__faq-inner ltn__faq-inner-2">
                <div id="accordion_2">
                  {faqs.map((faq, index) => (
                    <div className="card" key={faq.id}>
                      <h6 className="collapsed ltn__card-title" data-bs-toggle="collapse" data-bs-target={`#faq-item-${faq.id}`} aria-expanded="false">
                        {faq.question}
                      </h6>
                      <div id={`faq-item-${faq.id}`} className={`collapse ${index === 0 ? 'show' : ''}`} data-parent="#accordion_2">
                        <div className="card-body">
                          <p>{faq.answer}</p>
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
      {/* FAQ AREA END */}
    </>
  );
}
