export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  image: string;
  excerpt: string;
  paragraphs: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'kontrola-salmonele-male-farme',
    title: 'Kako izgleda dobra praksa kontrole salmonele kod malih farmi?',
    category: 'Bezbednost',
    author: 'Danilo',
    publishedAt: '2026-02-11',
    image: '/img/blog/3.jpg',
    excerpt:
      'Kontrola salmonele se ne svodi na jedan test, vec na kombinaciju biosigurnosti, vakcinacije i redovne veterinarske kontrole.',
    paragraphs: [
      'Dobra praksa na maloj farmi pocinje od ciste opreme, kontrole ulaza i redovnog plana dezinfekcije. Bez biosigurnosti nema stabilne proizvodnje.',
      'Drugi korak je veterinarski nadzor i periodicne analize. Time se rizik minimizira pre nego sto jaja dodju do kupca.',
      'Kada se proizvod kupuje direktno od proverene farme, kupac zna poreklo i uslove uzgoja. To je najvazniji razlog zasto je transparentnost presudna.',
    ],
  },
  {
    slug: 'domaca-jaja-vakcinacija-kokosaka',
    title: 'Da li su domaca jaja bezbedna ako su kokoske vakcinisane?',
    category: 'Veterina',
    author: 'Danilo',
    publishedAt: '2026-02-11',
    image: '/img/blog/4.jpg',
    excerpt:
      'Vakcinacija je standard odgovorne proizvodnje i jedan od nacina da se smanji rizik od infekcija u jatu.',
    paragraphs: [
      'Vakcinacija kokosaka je preventivna mera i deo ozbiljnog veterinarskog plana. To ne umanjuje kvalitet jajeta, vec podize bezbednost celog lanca.',
      'Pored vakcinacije, presudni su higijena, pravilna ishrana i redovne kontrole. Samo kombinacija ovih faktora daje pouzdano domace jaje.',
      'Kupcu je najvaznije da zna ko proizvodi jaja i pod kojim uslovima. Direktna kupovina od proizvodjaca daje vecu sigurnost nego neprovereni izvori.',
    ],
  },
  {
    slug: 'zasto-kupovati-direktno-od-proizvodjaca',
    title: 'Zasto je bolje kupovati jaja direktno od proizvodjaca?',
    category: 'Kupovina i dostava',
    author: 'Danilo',
    publishedAt: '2026-02-11',
    image: '/img/blog/5.jpg',
    excerpt:
      'Direktna kupovina znaci sveza jaja, poznato poreklo i redovnu isporuku bez posrednika.',
    paragraphs: [
      'Kada kupujete direktno, imate jasnu vezu sa farmom i tacno znate odakle jaje dolazi. To smanjuje rizik i povecava poverenje.',
      'Redovna dostava je vazna porodicama i ugostiteljima koji traze stabilan kvalitet. Pouzdan proizvodjac nije najjeftinija opcija, ali je najsigurnija.',
      'Najveci rizik kod neproverenih domacih jaja je nepoznato poreklo i izostanak kontrole. Proveren proizvodjac sa veterinarskim nadzorom taj rizik svodi na minimum.',
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
