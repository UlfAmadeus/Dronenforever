// utils/phrases.ts

/**
 * Collection of Norwegian phrases to display randomly on the site
 */
export const RANDOM_PHRASES = [
    // Original phrases
    "Gratulerer",
    "Gratulerer!",
    "God Bedring",
    "Til Konfirmanten",
    "Unnskyld!",
    "Hurra",
    "Halleluja",
    "Inshallah",
    "Hvil i fred",
    "Takk for alt",
    "En smerte som deles, taper sin kraft.",
    "Evig eies kun det tapte",
    "Hva kan eies, når livet er et lån.",
    "Hver slutt er en ny begynnelse",
    "Ingen kjenner dagen før solen går ned",
    "Livet består av øyeblikk, nyt dem",
    "Roser er av torner brakt",
    "Sirkelen er sluttet",
    "Sorgen må vi leve med, gleden skal vi aldri glemme.",
    "Sorgen må vi lære å leve med. Gleden skal vi aldri glemme.",
    "Så ble det kveld og solen gikk ned",
    "Med Jesus du vandrer",
    "Midt i nattens mørke blinker som et fyrlys Jesu navn",
    "Nå har du kjempet ut, og hviler hjemme hos din Gud",
    "Nå skal du bo i Herrens hus gjennom alle tider",
    "Salig er den som har sitt navn skrevet i Livets bok",
    "Salige er de som dør i Herren",
    "Seil ditt skip i Jesu navn",
    "Så ta da mine hender",
    
    // Celebratory phrases
    "Skål!",
    "Til lykke!",
    "Hjertelig gratulerer med dagen!",
    "Fantastisk!",
    "For en flott dag!",
    "Gratulerer så mye!",
    "Hurra for deg!",
    "Ha en strålende dag!",
    "Hipp hipp hurra!",
    "Kjempebra!",
    
    // Gift card phrases
    "Så leit at hunden din ble påkjørt",
    "Mine barn løper ikke med saks",
    "Jeg tenker på deg",
    "Med varmeste hilsener",
    "Gratulerer med ny bolig!",
    "Lykke til med eksamen",
    "Velkommen til verden, lille venn",
    "Sender deg en varm klem",
    "Til brudeparet - gratulerer med dagen!",
    "Kondolerer så mye",
    "Gratulerer med dagen, bestemor!",
    "Takk for at du er du",
    "Du betyr så mye for meg",
    
    // Sinister phrases
    "Jeg ser deg når du sover",
    "Det er alltid noen som følger med",
    "Noen dører burde forbli låst",
    "Gratulerer med dagen... kanskje din siste?",
    "Mine tanker er med deg... hele tiden",
    "Jeg kommer tilbake når du minst venter det",
    "De som ler sist, ler best",
    "Bak hver smil skjuler det seg en hemmelighet",
    "Lykke til med eksamen... du kommer til å trenge det",
    "Jeg har ikke glemt hva du gjorde",
    "Kjelleren er klar til ditt besøk",
    
    // Wall people phrases
    "De beveger seg i veggene når du ikke ser",
    "Jeg hører dem hviske i veggene om natten",
    "Veggfolket stjeler ostebiten min når jeg sover",
    "Gratulerer med dagen fra meg og de som bor i veggene mine",
    "De banker koder til meg gjennom rørene",
    "Jeg har tapetsert veggene med aluminiumsfolie for din sikkerhet",
    "De ser på oss gjennom hullene i veggene",
    "Når lysene er slukket, åpner de hemmelige dørene",
    "De har bygd tunneler mellom husene våre"
  ];
  
  /**
   * Gets a random phrase from the collection
   * @returns A random Norwegian phrase
   */
  export function getRandomPhrase(): string {
    const randomIndex = Math.floor(Math.random() * RANDOM_PHRASES.length);
    return RANDOM_PHRASES[randomIndex];
  }