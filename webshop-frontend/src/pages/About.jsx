export default function About() {
    return (
        <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-16">
            <div className="mb-8">
                <p className="eyebrow mb-3">Naša priča</p>
                <h1 className="display-font text-4xl font-bold text-ink sm:text-5xl">Mali umjetnički studio utemeljen na vjeri, obitelji i ljepoti.</h1>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
                        <p className="leading-8 text-stone-600">
                            {/* TODO: real story here */}
                            Vjerujemo da umjetnost treba biti više od ukrasa — treba pričati priču, čuvati uspomenu i nježno upućivati na nadu. Ova je trgovina nastala iz želje da stvaramo lijepe i nadahnjujuće predmete koji unose toplinu u dom i ohrabrenje u svakodnevni život.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
                        <h2 className="display-font mb-3 text-2xl font-bold text-ink">Naša vjera</h2>
                        <p className="leading-8 text-stone-600">
                            {/* TODO: real faith story here */}
                            Vjera je u središtu našeg rada. Stvaramo s namjerom, zahvalnošću i željom da poštujemo Boga koji nam daje kreativnost, odmor i svrhu. Svaki je predmet mali čin zahvalnosti i podsjetnik da ljepota može biti osobna i duboko duhovna.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
                        <h2 className="display-font mb-3 text-2xl font-bold text-ink">Kako nastaje umjetnost</h2>
                        <p className="leading-8 text-stone-600">
                            {/* TODO: real process here */}
                            Svaki original ručno je oslikan s pažnjom, molitvom i posvećenošću detaljima koji predmetu daju osobni karakter. Spajamo promišljen dizajn, slojevitost i prirodne teksture kako bismo stvorili djela koja su topla, smislena i trajna.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-amber-900/10 bg-cream p-6 shadow-sm">
                    <img
                        src="/images/about-us.jpg"
                        alt="The couple behind the studio"
                        className="mb-4 h-72 w-full rounded-xl object-cover"
                    />
                    <p className="eyebrow mb-2">Studio</p>
                    <p className="leading-7 text-stone-600">
                        {/* TODO: couple intro/photo caption */}
                        Kreativni studio supružnika utemeljen na vjeri, obitelji i ljubavi prema pažljivo izrađenim rukotvorinama.
                    </p>
                </div>
            </div>
        </main>
    );
}
