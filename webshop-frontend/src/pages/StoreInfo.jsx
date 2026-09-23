const infoPages = {
    '/sigurna-kupnja': {
        eyebrow: 'Informacije',
        title: 'Sigurna kupnja',
        intro: 'Vaša sigurnost i povjerenje važni su nam u svakom koraku kupnje.',
        sections: [
            ['Zaštićeni podaci', 'Podatke koje unesete koristimo samo za obradu narudžbe i komunikaciju vezanu uz kupnju. Ne prodajemo ih niti dijelimo u marketinške svrhe.'],
            ['Pouzdana narudžba', 'Nakon slanja narudžbe prikazujemo potvrdu, a podatke o dostavi pažljivo provjeravamo prije slanja. Za svako pitanje možete nam se javiti na hello@domsvjetla.com.'],
            ['Plaćanje', 'Način plaćanja i sve eventualne troškove prikazujemo jasno prije završetka narudžbe. Nikada ne tražimo lozinku ili osjetljive podatke putem e-maila.'],
        ],
    },
    '/dostava-i-preuzimanje': {
        eyebrow: 'Informacije',
        title: 'Dostava i preuzimanje',
        intro: 'Narudžbe pakiramo pažljivo kako bi sigurno stigle na vašu adresu.',
        sections: [
            ['Dostava', 'Narudžbe šaljemo na adresu koju navedete u obrascu za kupnju. Točan rok i eventualni trošak dostave ovise o odabranoj opciji i prikazuju se prije potvrde narudžbe.'],
            ['Besplatna dostava', 'Za narudžbe iznad 100 € vrijedi besplatna dostava, osim ako je za određeni proizvod navedeno drugačije.'],
            ['Osobno preuzimanje', 'Ako je osobno preuzimanje dostupno za vašu narudžbu, dogovorit ćemo termin i lokaciju putem e-maila nakon potvrde narudžbe.'],
            ['Pitanja o dostavi', 'Za promjenu adrese ili dodatne informacije javite nam se što prije na hello@domsvjetla.com i navedite broj narudžbe.'],
        ],
    },
};

export default function StoreInfo({ path }) {
    const page = infoPages[path] || infoPages['/sigurna-kupnja'];

    return (
        <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-20">
            <p className="eyebrow mb-3">{page.eyebrow}</p>
            <h1 className="display-font text-4xl font-bold text-ink sm:text-5xl">{page.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">{page.intro}</p>
            <div className="mt-10 grid gap-5">
                {page.sections.map(([title, text]) => (
                    <section key={title} className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
                        <h2 className="display-font mb-2 text-2xl font-bold text-ink">{title}</h2>
                        <p className="leading-8 text-stone-600">{text}</p>
                    </section>
                ))}
            </div>
        </main>
    );
}
