// Duomenų modelis: kategorijos, teiginiai, sąsajos tekstai LT/EN.
// Balų logika: 1-5 skalė, invertuoti teiginiai perskaičiuojami kaip (6 - balas).

const DATA = {
  categories: [
    {
      id: "status",
      name: { lt: "Statusas ir pripažinimo poreikis", en: "Status & Need for Recognition" },
      description: {
        lt: "Poreikis, kad kiti matytų tavo indėlį ir patirtį.",
        en: "The need for others to notice your contribution and experience."
      },
      reflection: {
        lt: "Kada paskutinį kartą pastebėjai savyje norą, kad kiti pripažintų tavo indėlį?",
        en: "When did you last notice a pull to make sure your contribution was seen?"
      }
    },
    {
      id: "control",
      name: { lt: "Teisumas, kontrolė ir atsakomybė", en: "Being Right, Control & Accountability" },
      description: {
        lt: "Poreikis būti teisiam ir pasidalinti atsakomybe.",
        en: "The need to be right and to share responsibility."
      },
      reflection: {
        lt: "Kada paskutinį kartą tau buvo sunku sutikti su sprendimu, kuris skyrėsi nuo tavojo?",
        en: "When was it last hard for you to accept a decision that differed from your own?"
      }
    },
    {
      id: "listening",
      name: { lt: "Klausymasis ir erdvė kitiems", en: "Listening & Making Space" },
      description: {
        lt: "Ar duodi vietos kitų minčiai ir idėjoms.",
        en: "Whether you make room for others' thoughts and ideas."
      },
      reflection: {
        lt: "Kada paskutinį kartą pagavai save galvojant apie atsakymą, kol kitas dar kalbėjo?",
        en: "When did you last catch yourself thinking about your reply while someone else was still talking?"
      }
    },
    {
      id: "recognition",
      name: { lt: "Pripažinimas ir dėkingumas kitiems", en: "Recognizing & Thanking Others" },
      description: {
        lt: "Ar pastebi ir įvardini kitų indėlį.",
        en: "Whether you notice and name others' contributions."
      },
      reflection: {
        lt: "Kada paskutinį kartą kažkas padarė gerą darbą, o tu to nepasakei garsiai?",
        en: "When did someone last do good work that you didn't acknowledge out loud?"
      }
    },
    {
      id: "emotions",
      name: { lt: "Emocijų ir reakcijų valdymas", en: "Emotional Reactions" },
      description: {
        lt: "Kaip reaguoji įtampos akimirkomis.",
        en: "How you react in moments of tension."
      },
      reflection: {
        lt: "Kada paskutinį kartą tavo reakcija buvo stipresnė, nei situacija reikalavo?",
        en: "When was your last reaction stronger than the situation called for?"
      }
    },
    {
      id: "flexibility",
      name: { lt: "Lankstumas ir dalinimasis", en: "Flexibility & Sharing" },
      description: {
        lt: "Ar lengvai atsisakai senų būdų ir dalinies informacija bei dėmesiu.",
        en: "Whether you let go of old habits and share information and attention easily."
      },
      reflection: {
        lt: "Kada paskutinį kartą laikeisi seno būdo, nors naujas galėjo veikti geriau?",
        en: "When did you last stick with an old way, even though a new one might have worked better?"
      }
    }
  ],

  items: [
    { id: 5,  categoryId: "status",      inverted: false, text: { lt: "Pokalbiuose man svarbu, kad būtų paminėtas mano indėlis į rezultatą.", en: "In conversations, it matters to me that my contribution to the outcome is mentioned." } },
    { id: 8,  categoryId: "status",      inverted: false, text: { lt: "Pokalbiuose man svarbu priminti, ką jau anksčiau esu nuveikęs.", en: "In conversations, it matters to me to remind others of what I've already accomplished." } },
    { id: 12, categoryId: "status",      inverted: false, text: { lt: "Diskusijoje remiuosi savo patirtimi ar kvalifikacija, kad sustiprinčiau savo nuomonės svorį.", en: "In discussions, I lean on my experience or qualifications to give my opinion more weight." } },

    { id: 1,  categoryId: "control",     inverted: false, text: { lt: "Diskusijoje grįžtu prie temos, kol išgirstu pripažinimą, kad buvau teisus.", en: "In a discussion, I keep returning to a topic until I hear it acknowledged that I was right." } },
    { id: 7,  categoryId: "control",     inverted: false, text: { lt: "Kai kažkas nepavyksta, man lengviau paaiškinti tai aplinkybėmis, nei savo sprendimais.", en: "When something goes wrong, it's easier for me to explain it through circumstances than through my own decisions." } },
    { id: 10, categoryId: "control",     inverted: false, text: { lt: "Kai komandoje kažkas nepavyksta, man sunku iš karto įvardyti, kokia to dalis yra mano atsakomybė.", en: "When something goes wrong in the team, it's hard for me to immediately name what part of it is my own responsibility." } },
    { id: 14, categoryId: "control",     inverted: false, text: { lt: "Net supratęs, kad suklydau, man reikia laiko, kol pasiruošiu tai pripažinti garsiai.", en: "Even after realizing I was wrong, I need some time before I'm ready to admit it out loud." } },

    { id: 3,  categoryId: "listening",   inverted: true,  text: { lt: "Net kai nesutinku su tuo, ką girdžiu, aš leidžiu žmogui baigti mintį, prieš atsakydamas.", en: "Even when I disagree with what I'm hearing, I let the person finish their thought before I respond." } },
    { id: 11, categoryId: "listening",   inverted: false, text: { lt: "Man kyla noras pasiūlyti sprendimą, net kai manęs to neprašo.", en: "I feel the urge to suggest a solution, even when no one has asked for one." } },
    { id: 18, categoryId: "listening",   inverted: true,  text: { lt: "Kai idėja man iš karto atrodo silpna, vis tiek užduodu bent vieną klausimą, prieš ją atmesdamas.", en: "When an idea seems weak to me right away, I still ask at least one question before dismissing it." } },

    { id: 9,  categoryId: "recognition", inverted: true,  text: { lt: "Net užimtomis dienomis surandu laiko pasakyti kolegai, kad jo darbas buvo geras.", en: "Even on busy days, I find time to tell a colleague their work was good." } },
    { id: 19, categoryId: "recognition", inverted: true,  text: { lt: "Įtemptose situacijose vis tiek prisimenu padėkoti žmonėms, ne tik ramiu metu.", en: "In tense situations, I still remember to thank people, not only when things are calm." } },

    { id: 4,  categoryId: "emotions",    inverted: false, text: { lt: "Man lengviau pastebėti, kas padaryta ne taip, nei pagirti, kas pavyko.", en: "It's easier for me to notice what went wrong than to praise what went well." } },
    { id: 6,  categoryId: "emotions",    inverted: false, text: { lt: "Kartais reaguoju su ironija ar sarkazmu, kai kažkas man nepatinka.", en: "I sometimes respond with irony or sarcasm when something displeases me." } },
    { id: 13, categoryId: "emotions",    inverted: false, text: { lt: "Įtampos akimirkomis mano emocinė reakcija būna stipresnė, nei situacija to reikalauja.", en: "In tense moments, my emotional reaction is stronger than the situation calls for." } },
    { id: 16, categoryId: "emotions",    inverted: true,  text: { lt: "Net kai nuotaika prastesnė, mano požiūris į tą patį klausimą ar žmogų išlieka gana panašus dieną iš dienos.", en: "Even on a bad day, my attitude toward the same issue or person stays fairly consistent." } },

    { id: 2,  categoryId: "flexibility", inverted: false, text: { lt: "Man sunku susilaikyti nuo komentaro ar pataisymo, net kai to niekas neprašo.", en: "I find it hard to hold back a comment or correction, even when no one asked for it." } },
    { id: 15, categoryId: "flexibility", inverted: true,  text: { lt: "Net kai žinios man duoda pranašumą, aš vis tiek jomis dalinuosi su komanda.", en: "Even when information gives me an advantage, I still share it with the team." } },
    { id: 17, categoryId: "flexibility", inverted: false, text: { lt: "Vieniems komandos žmonėms kartais skiriu daugiau dėmesio nei kitiems, pats to iš karto nepastebėdamas.", en: "I sometimes give certain people on the team more attention than others, without noticing it right away." } },
    { id: 20, categoryId: "flexibility", inverted: true,  text: { lt: "Net kai senas būdas man visiškai tinka, vis tiek noriu išbandyti naują, jei toks atsiranda.", en: "Even when the old way still works fine for me, I want to try a new one if it comes up." } }
  ],

  scoring: {
    zones: [
      { max: 2.4, label: { lt: "Retai kliudo", en: "Rarely gets in your way" } },
      { max: 3.7, label: { lt: "Kartais gali reikalauti daugiau sąmoningumo", en: "Can sometimes call for more awareness" } },
      { max: 5.0, label: { lt: "Stiprybė, kuriai gali reikėti daugiau sąmoningumo", en: "A strength that may call for more awareness" } }
    ],
    topAreasCount: 3
  },

  ui: {
    lt: {
      brand: "Veidrodis",
      heroTitle: "Ar tavo elgesio įpročiai kartais stabdo augimą?",
      heroSubtitle: "Trumpas 3–5 minučių savistabos įrankis žmonėms, kurie daro įtaką kitiems.",
      disclaimer: "Tai nėra psichologinis testas, diagnozė ar kompetencijų vertinimas. Tai veidrodis, ne nuosprendis. Rezultatas lieka tik tavo naršyklėje — niekur nesiunčiamas ir nesaugomas jokiame serveryje.",
      startButton: "Pradėti",
      roleQuestion: "Į kokį savo vaidmenį šiandien labiausiai žiūri? (nebūtina)",
      roleOptions: ["Vadovas / vadovė", "Komandos narys / narė", "Tėvas, mama ar mentorius", "Praleisti šį klausimą"],
      continueButton: "Toliau",
      scaleMin: "Visiškai nesutinku",
      scaleMax: "Visiškai sutinku",
      prevButton: "Atgal",
      nextButton: "Toliau",
      finishButton: "Žiūrėti rezultatą",
      progressLabel: (n, total) => `${n} / ${total}`,
      transitionTitle: "Akimirka prieš rezultatą",
      transitionText: "Tai, ką pamatysi kitame puslapyje, yra pastebėjimas, ne diagnozė. Kiekviena stiprybė kažkur turi ir šešėlinę pusę.",
      transitionButton: "Rodyti rezultatą",
      resultsTitle: "Tavo refleksijos žemėlapis",
      resultsIntro: "Šešios elgesio sritys, matuotos pagal tavo atsakymus. Juostos ilgis rodo tendenciją, ne nuosprendį.",
      topAreasHeading: "Sritys, kuriose tavo stiprybė gali reikalauti daugiau sąmoningumo",
      reflectionLabel: "Klausimas apmąstymui:",
      restartButton: "Pradėti iš naujo",
      downloadPdfButton: "Atsisiųsti kaip PDF",
      resumeText: (n, total) => `Turi neužbaigtą sesiją (sustojai ties ${n} iš ${total}).`,
      resumeButton: "Tęsti",
      discardButton: "Pradėti iš naujo",
      langToggle: "EN",
      footer: "Nė vienas atsakymas nėra siunčiamas ar saugomas serveryje. Duomenys egzistuoja tik šioje naršyklėje, kol pats juos ištrinsi.",
      printedFrom: "Sukurta naudojant asmeninį savirefleksijos įrankį."
    },
    en: {
      brand: "Mirror",
      heroTitle: "Do your habits sometimes get in the way of your own growth?",
      heroSubtitle: "A 3–5 minute self-check for people who influence others.",
      disclaimer: "This is not a psychological test, a diagnosis, or a competency assessment. It's a mirror, not a verdict. Your result stays in this browser only — nothing is sent to or stored on any server.",
      startButton: "Start",
      roleQuestion: "Which role are you looking at today? (optional)",
      roleOptions: ["Manager / team lead", "Team member", "Parent or mentor", "Skip this question"],
      continueButton: "Continue",
      scaleMin: "Strongly disagree",
      scaleMax: "Strongly agree",
      prevButton: "Back",
      nextButton: "Next",
      finishButton: "See result",
      progressLabel: (n, total) => `${n} / ${total}`,
      transitionTitle: "A moment before your result",
      transitionText: "What you'll see next is an observation, not a diagnosis. Every strength has a shadow side somewhere.",
      transitionButton: "Show result",
      resultsTitle: "Your reflection map",
      resultsIntro: "Six behavior areas, measured from your answers. Bar length shows a tendency, not a verdict.",
      topAreasHeading: "Areas where your strength may call for more awareness",
      reflectionLabel: "A question to sit with:",
      restartButton: "Start over",
      downloadPdfButton: "Download as PDF",
      resumeText: (n, total) => `You have an unfinished session (you stopped at ${n} of ${total}).`,
      resumeButton: "Continue",
      discardButton: "Start over",
      langToggle: "LT",
      footer: "No answer is ever sent to or stored on a server. Data lives only in this browser until you clear it.",
      printedFrom: "Created with a personal self-reflection tool."
    }
  }
};
