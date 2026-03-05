# Westcoast Education
Vi har blivit kontaktade av WestCoast Education, som behöver vår hjälp att modernisera
plattform. Vi har fått följande information av deras beställare.

## Bakgrund

Vi kommer nu att göra en stor satsning på att kunna tillhandahålla utbildningar, seminarier
och webinarier ”On-Demand”.

Vi har beslutat att vi behöver en modern och attraktiv plattform att erbjuda våra elever och
kunder för *bokning, sökning, matchning* av kurser samt samarbete.

## Mål

Vad vi behöver är en plattform som kan hantera vårt traditionella sätt att erbjuda utbildning
på men som även kan hantera vårt nästa steg som är att tillhandahålla köp av inspelade
kurser och seminarier för visning i webbläsare, mobila enheter samt för nedladdning.
Så vi ser följande scenarier som systemet måste klara.

## Klassrumskurser

⏳ Steg 1.
Framtagning av ”Proof Of Concept”
✅ I detta första steg behöver vi applikation som presenterar våra kurser på ett attraktivt och
modernt sätt. 
✅ Vi vill dessutom ha en sida där aktuella och populära kurser presenteras.

// ok, so first a landing page
// then, a list of courses... we filter by most recent + popular!

✅  På sidan som presenterar detaljer om kursen vill vi att följande information finns:
✅ • Kurstitel
✅ • Kursnummer
✅ • Antal dagar som kursen är
✅ • Om den finns tillgänglig som klassrum och eller distanskurs
✅• En bild som representerar kursen
✅• Datum då kursen är planerad att genomföras
✅• En möjlighet att boka sig för kursen via klassrum eller distans

// ok so using query params for course details

✅ Vid bokning av en kurs så måste användaren/kunden logga in eller skapa ett konto.
// check if already logged in as welll... using local storage to store user id
// ok, so a simple signup and we store the user id as it it were a jwt... heheh super safe lol

✅ På bokningssidan ska följande information anges.
✅ • Kundnamn
✅• Faktureringsadress
✅• E-postadress
✅• Mobilnummer

✅ we can fetch and prefill data in form to allow modifications...


✅ maybe refactor first all in to separate ts / js files.... then continue for admins!

Steg 2.

⏳ Administrationsverktyg

✅Vi behöver en applikation som ger oss tillgång till att lägga till nya kurser.
 När vi lägger till
nya kurser så behöver vi ange följande information:
✅• Kurstitel
✅• Kursnummer
✅• Antal dagar som kursen är
✅• Kostnad för kursen

✅ Dessutom behöver vi tillgång till att kunna lista vilka kunder som har bokat sig på respektive
kurs 

// (enrollments), hehe


✅ Funktionskrav
Vi vill att applikationen skall fungera i alla moderna webbläsare och gå att använda i olika
skärmstorlekar och i olika enheter. Det är jätteviktigt att applikationen är responsiv, vår
gamla applikation var inte detta och vi fick väldigt mycket kritik för detta.

// use media queries!!

✅ Designkrav
✅ Gällande design och utseende har vi inte speciella krav förutom att applikationen skall vara
lätt att orientera sig i. 

✅ Det vill säga att den skall vara lätt att förstå så man hittar de
väsentliga sakerna enkelt. 

✅ Givetvis behöver den vara tilltalande att arbeta med det vill säga
att den ska innehålla modern HTML och CSS.

// use variables to create a theme... and reference those variables in our css classes



--------------------------------------------



Godkänt(G) krav
För godkänt krävs följande moment

✅  Steg 1 och Steg 2 ska vara genomförda i kravspecifikation som är bifogad.
✅  Applikationen ska vara utvecklad med “Vanilla” JavaScript.
✅  ES6 moduler ska användas
✅  Json-Server ska användas som REST API
✅  Applikationen ska följa DRY(Don’t Repeat Yourself) samt KISS(Keep It Simple Stupid) principerna

Väl godkänt(VG) krav
✅ För välgodkänt krävs förutom G kraven ovan att antingen Steg 1 eller Steg 2 är utvecklad med TypeScript
✅ Att minst en TypeScript modul är utvecklad enligt TDD(Test Driven Development) principen



Inlämning

Inlämning ska ske som en GitHub länk (⏳) och som en zippad fil. Tänk på att länken till GitHub måste vara publik så att jag kan komma åt den. När uppgiften är betygsatt kan ni antingen göra den till privat eller ta bort den.


Inlämningsuppgiften examinerar följande läranderesultat från kursplanen:

✅ felsökningstekniker och TDD
✅ grundläggande programmering i JavaScript med TypeScript
?? tillämpning av JavaScript och blockkedjeteknik i programmering i Web3
✅ välja och använda tekniker och arbetsmetoder för att genomföra projekt i JavaScript
✅ använda TypeScript i webbutveckling
 
VG-mål för uppgiften:

Den studerande har nått samtliga lärandemål för kursen. Den studerande kan dessutom: 

✅ självständigt lösa problem med hjälp av JavaScript
✅ följa god programmerings-sed
✅ Med högre kvalitet än för betyget G. 


Inlämning: 15 mars