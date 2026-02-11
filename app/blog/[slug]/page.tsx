import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug } from '@/lib/blog-posts';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: post.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: post.excerpt,
        },
      },
    ],
  };

  return (
    <div className="ltn__blog-details-area pt-80 pb-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="ltn__blog-details-wrap">
              <h1 className="mb-20">{post.title}</h1>
              <img src={post.image} alt={post.title} className="mb-25" />
              {post.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <div className="mt-30">
                <Link href="/shop" className="theme-btn-1 btn btn-effect-1 mr-10">
                  Poruci jaja
                </Link>
                <Link href="/contact" className="theme-btn-2 btn btn-effect-2">
                  Kontakt
                </Link>
              </div>
              <div className="mt-20">
                <Link href="/blog">Nazad na blog</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
