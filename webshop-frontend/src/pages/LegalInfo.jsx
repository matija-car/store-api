const pages = {
    '/uvjeti-poslovanja': {
        eyebrow: 'Pravne informacije',
        title: 'Uvjeti poslovanja',
        paragraphs: [
            'Ova stranica sadrži osnovne informacije o načinu slanja upita, komunikaciji s kupcem i dogovoru o eventualnoj kupnji.',
            'U katalog načinu rada slanje obrasca predstavlja upit, a ne automatski sklopljen ugovor niti automatsku naplatu. Nakon primitka upita javit ćemo vam se e-mailom.',
            'TODO — konačni tekst uvjeta poslovanja, podaci o OIB-u, adresi, isporuci i drugim pravnim formulacijama moraju biti potvrđeni s knjigovođom ili pravnikom prije objave.',
        ],
    },
    '/privatnost': {
        eyebrow: 'Pravne informacije',
        title: 'Politika privatnosti',
        paragraphs: [
            'Podatke koje unesete u obrazac koristimo za odgovor na vaš upit, komunikaciju o odabranim proizvodima i obradu eventualnog dogovora.',
            'Podaci se ne koriste za automatsku naplatu bez vašeg dodatnog dogovora.',
            'TODO — tekst o voditelju obrade, pravnoj osnovi, rokovima čuvanja, pravima ispitanika, OIB-u i adresi mora odobriti pravnik prije objave.',
        ],
    },
    '/autorsko-djelo': {
        eyebrow: 'Pravne informacije',
        title: 'Autorsko djelo',
        paragraphs: [
            'Fotografije, ilustracije, tekstovi i druga kreativna djela na ovoj stranici zaštićeni su autorskim pravima, osim ako je izričito navedeno drukčije.',
            'Nije dopušteno preuzimanje, umnožavanje ili komercijalno korištenje sadržaja bez prethodnog pisanog odobrenja autora.',
            'TODO — konkretne pravne formulacije i podaci o nositelju prava moraju biti provjereni i odobreni prije objave.',
        ],
    },
};

export default function LegalInfo({ path }) {
    const page = pages[path] || pages['/privatnost'];
    return (
        <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:py-16">
            <p className="eyebrow mb-3">{page.eyebrow}</p>
            <h1 className="display-font mb-8 text-4xl font-bold text-ink sm:text-5xl">{page.title}</h1>
            <div className="space-y-5 rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm sm:p-8">
                {page.paragraphs.map((paragraph) => <p key={paragraph} className="leading-8 text-stone-600">{paragraph}</p>)}
            </div>
        </main>
    );
}
