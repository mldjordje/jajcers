import Link from 'next/link';
import { blogPosts } from '@/lib/blog-posts';

export default function BlogPage() {
  return (
    <div className="ltn__blog-area pt-115 pb-70">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area ltn__section-title-2 text-center">
              <h1 className="section-title">Blog i saveti</h1>
            </div>
          </div>
        </div>
        <div className="row">
          {blogPosts.map((post) => (
            <div className="col-lg-4 col-md-6" key={post.slug}>
              <div className="ltn__blog-item ltn__blog-item-3">
                <div className="ltn__blog-img">
                  <Link href={`/blog/${post.slug}`}>
                    <img src={post.image} alt={post.title} />
                  </Link>
                </div>
                <div className="ltn__blog-brief">
                  <div className="ltn__blog-meta">
                    <ul>
                      <li className="ltn__blog-author">
                        <span>
                          <i className="far fa-user" /> {post.author}
                        </span>
                      </li>
                      <li className="ltn__blog-tags">
                        <span>
                          <i className="fas fa-tags" /> {post.category}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <h3 className="ltn__blog-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                  <div className="ltn__blog-btn">
                    <Link href={`/blog/${post.slug}`}>Procitaj vise</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
