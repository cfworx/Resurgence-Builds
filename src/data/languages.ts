// Languages the site publishes translated guides in, with the handful of interface words a translated page needs.
// A language only gets pages (and a hub at /<code>/) once a file exists under src/content/translations/<code>/.
// The rules for translations are in TRANSLATIONS.md.

export interface Lang {
  /** Folder and URL segment: /de/, /pt-br/ */
  code: string;
  /** BCP 47 tag for <html lang> and hreflang */
  tag: string;
  ogLocale: string;
  /** The language's own name, shown in language links */
  name: string;
  /** English name, for our own notes */
  english: string;
  ui: {
    home: string;
    guides: string;
    guide: string;
    by: string;
    updated: string;
    contents: string;
    questions: string;
    sources: string;
    /** Shown on every translated page */
    note: string;
    /** {date} is replaced with the date the English page was last updated */
    stale: string;
    original: string;
    alsoIn: string;
    /** The colon after a label, when the language does not write a plain ':' (French puts a no-break space before it) */
    colon?: string;
    hubTitle: string;
    hubH1: string;
    hubIntro: string;
    toolsTitle: string;
    planner: string;
    tierList: string;
    map: string;
    database: string;
    builds: string;
    more: string;
  };
}

export const LANGS: Lang[] = [
  {
    code: 'de', tag: 'de', ogLocale: 'de_DE', name: 'Deutsch', english: 'German',
    ui: {
      home: 'Startseite', guides: 'Guides', guide: 'Guide', by: 'Von', updated: 'Zuletzt aktualisiert', contents: 'Inhalt',
      questions: 'Fragen und Antworten', sources: 'Quellen',
      note: 'Dies ist eine Übersetzung unseres englischen Guides. Namen aus dem Spiel, die wir nicht auf Deutsch belegen konnten, stehen auf Englisch da.',
      stale: 'Die englische Fassung wurde am {date} aktualisiert. Diese Übersetzung ist möglicherweise nicht auf dem neuesten Stand.',
      original: 'Englisches Original', alsoIn: 'Auch verfügbar auf',
      hubTitle: 'The Division Resurgence auf Deutsch: Guides', hubH1: 'The Division Resurgence auf Deutsch',
      hubIntro: 'Unsere Guides zu The Division Resurgence auf Deutsch. Builds, Tier-Listen, die Datenbank und der Build-Planer sind auf Englisch.',
      toolsTitle: 'Werkzeuge (auf Englisch)', planner: 'Build-Planer', tierList: 'Tier-Liste', map: 'Interaktive Karte', database: 'Datenbank', builds: 'Builds',
      more: 'Weitere Guides auf Deutsch',
    },
  },
  {
    code: 'fr', tag: 'fr', ogLocale: 'fr_FR', name: 'Français', english: 'French',
    ui: {
      home: 'Accueil', guides: 'Guides', guide: 'Guide', by: 'Par', updated: 'Dernière mise à jour', contents: 'Sommaire',
      questions: 'Questions fréquentes', sources: 'Sources',
      note: "Ceci est une traduction de notre guide en anglais. Les noms du jeu que nous n'avons pas pu vérifier en français sont laissés en anglais.",
      stale: "La version anglaise a été mise à jour le {date}. Cette traduction n'est peut-être plus à jour.",
      original: 'Version originale en anglais', alsoIn: 'Aussi disponible en', colon: '\u00a0:',
      hubTitle: 'The Division Resurgence en français : guides', hubH1: 'The Division Resurgence en français',
      hubIntro: 'Nos guides pour The Division Resurgence en français. Les builds, les tier lists, la base de données et le planificateur de builds sont en anglais.',
      toolsTitle: 'Outils (en anglais)', planner: 'Planificateur de builds', tierList: 'Tier list', map: 'Carte interactive', database: 'Base de données', builds: 'Builds',
      more: 'Plus de guides en français',
    },
  },
  {
    code: 'es', tag: 'es', ogLocale: 'es_ES', name: 'Español', english: 'Spanish',
    ui: {
      home: 'Inicio', guides: 'Guías', guide: 'Guía', by: 'Por', updated: 'Última actualización', contents: 'Contenido',
      questions: 'Preguntas frecuentes', sources: 'Fuentes',
      note: 'Esta es una traducción de nuestra guía en inglés. Los nombres del juego que no pudimos comprobar en español se dejan en inglés.',
      stale: 'La versión en inglés se actualizó el {date}. Es posible que esta traducción no esté al día.',
      original: 'Original en inglés', alsoIn: 'También disponible en',
      hubTitle: 'The Division Resurgence en español: guías', hubH1: 'The Division Resurgence en español',
      hubIntro: 'Nuestras guías de The Division Resurgence en español. Las builds, las tier lists, la base de datos y el planificador de builds están en inglés.',
      toolsTitle: 'Herramientas (en inglés)', planner: 'Planificador de builds', tierList: 'Tier list', map: 'Mapa interactivo', database: 'Base de datos', builds: 'Builds',
      more: 'Más guías en español',
    },
  },
  {
    code: 'pt-br', tag: 'pt-BR', ogLocale: 'pt_BR', name: 'Português (Brasil)', english: 'Brazilian Portuguese',
    ui: {
      home: 'Início', guides: 'Guias', guide: 'Guia', by: 'Por', updated: 'Última atualização', contents: 'Conteúdo',
      questions: 'Perguntas frequentes', sources: 'Fontes',
      note: 'Esta é uma tradução do nosso guia em inglês. Os nomes do jogo que não conseguimos confirmar em português ficam em inglês.',
      stale: 'A versão em inglês foi atualizada em {date}. Esta tradução pode estar desatualizada.',
      original: 'Original em inglês', alsoIn: 'Também disponível em',
      hubTitle: 'The Division Resurgence em português: guias', hubH1: 'The Division Resurgence em português',
      hubIntro: 'Nossos guias de The Division Resurgence em português. As builds, as tier lists, o banco de dados e o planejador de builds estão em inglês.',
      toolsTitle: 'Ferramentas (em inglês)', planner: 'Planejador de builds', tierList: 'Tier list', map: 'Mapa interativo', database: 'Banco de dados', builds: 'Builds',
      more: 'Mais guias em português',
    },
  },
  {
    code: 'pl', tag: 'pl', ogLocale: 'pl_PL', name: 'Polski', english: 'Polish',
    ui: {
      home: 'Strona główna', guides: 'Poradniki', guide: 'Poradnik', by: 'Autor:', updated: 'Ostatnia aktualizacja', contents: 'Spis treści',
      questions: 'Pytania i odpowiedzi', sources: 'Źródła',
      note: 'To tłumaczenie naszego angielskiego poradnika. Nazwy z gry, których nie udało się nam potwierdzić po polsku, zostawiamy po angielsku.',
      stale: 'Wersja angielska została zaktualizowana {date}. To tłumaczenie może być nieaktualne.',
      original: 'Angielski oryginał', alsoIn: 'Dostępne także w językach',
      hubTitle: 'The Division Resurgence po polsku: poradniki', hubH1: 'The Division Resurgence po polsku',
      hubIntro: 'Nasze poradniki do The Division Resurgence po polsku. Buildy, tier listy, baza danych i planer buildów są po angielsku.',
      toolsTitle: 'Narzędzia (po angielsku)', planner: 'Planer buildów', tierList: 'Tier lista', map: 'Interaktywna mapa', database: 'Baza danych', builds: 'Buildy',
      more: 'Więcej poradników po polsku',
    },
  },
  {
    code: 'id', tag: 'id', ogLocale: 'id_ID', name: 'Bahasa Indonesia', english: 'Indonesian',
    ui: {
      home: 'Beranda', guides: 'Panduan', guide: 'Panduan', by: 'Oleh', updated: 'Terakhir diperbarui', contents: 'Daftar isi',
      questions: 'Pertanyaan umum', sources: 'Sumber',
      note: 'Ini adalah terjemahan dari panduan kami yang berbahasa Inggris. Nama dari game yang tidak dapat kami pastikan dalam bahasa Indonesia dibiarkan dalam bahasa Inggris.',
      stale: 'Versi bahasa Inggris diperbarui pada {date}. Terjemahan ini mungkin belum mengikuti.',
      original: 'Versi asli bahasa Inggris', alsoIn: 'Tersedia juga dalam',
      hubTitle: 'The Division Resurgence dalam Bahasa Indonesia: panduan', hubH1: 'The Division Resurgence dalam Bahasa Indonesia',
      hubIntro: 'Panduan The Division Resurgence dalam bahasa Indonesia. Build, tier list, database, dan build planner tersedia dalam bahasa Inggris.',
      toolsTitle: 'Alat (bahasa Inggris)', planner: 'Build planner', tierList: 'Tier list', map: 'Peta interaktif', database: 'Database', builds: 'Build',
      more: 'Panduan lain dalam bahasa Indonesia',
    },
  },
  {
    code: 'ru', tag: 'ru', ogLocale: 'ru_RU', name: 'Русский', english: 'Russian',
    ui: {
      home: 'Главная', guides: 'Гайды', guide: 'Гайд', by: 'Автор:', updated: 'Обновлено', contents: 'Содержание',
      questions: 'Вопросы и ответы', sources: 'Источники',
      note: 'Это перевод нашего гайда с английского. Названия из игры, которые нам не удалось проверить на русском, оставлены на английском.',
      stale: 'Английская версия была обновлена {date}. Этот перевод может отставать.',
      original: 'Английский оригинал', alsoIn: 'Также доступно на языках',
      hubTitle: 'The Division Resurgence на русском: гайды', hubH1: 'The Division Resurgence на русском',
      hubIntro: 'Наши гайды по The Division Resurgence на русском языке. Билды, тир-листы, база данных и планировщик билдов доступны на английском.',
      toolsTitle: 'Инструменты (на английском)', planner: 'Планировщик билдов', tierList: 'Тир-лист', map: 'Интерактивная карта', database: 'База данных', builds: 'Билды',
      more: 'Другие гайды на русском',
    },
  },
  {
    code: 'ja', tag: 'ja', ogLocale: 'ja_JP', name: '日本語', english: 'Japanese',
    ui: {
      home: 'ホーム', guides: 'ガイド', guide: 'ガイド', by: '執筆：', updated: '最終更新', contents: '目次',
      questions: 'よくある質問', sources: '出典',
      note: 'このページは英語版ガイドの翻訳です。日本語での表記を確認できなかったゲーム内の名称は、英語のまま記載しています。',
      stale: '英語版は{date}に更新されました。この翻訳は最新でない可能性があります。',
      original: '英語版（原文）', alsoIn: 'ほかの言語', colon: '：',
      hubTitle: 'ディビジョン リサージェンス 日本語ガイド', hubH1: 'ディビジョン リサージェンス 日本語ガイド',
      hubIntro: 'ディビジョン リサージェンスの日本語ガイドです。ビルド、ティアリスト、データベース、ビルドプランナーは英語で提供しています。',
      toolsTitle: 'ツール（英語）', planner: 'ビルドプランナー', tierList: 'ティアリスト', map: 'インタラクティブマップ', database: 'データベース', builds: 'ビルド',
      more: 'ほかの日本語ガイド',
    },
  },
  {
    code: 'it', tag: 'it', ogLocale: 'it_IT', name: 'Italiano', english: 'Italian',
    ui: {
      home: 'Home', guides: 'Guide', guide: 'Guida', by: 'Di', updated: 'Ultimo aggiornamento', contents: 'Indice',
      questions: 'Domande frequenti', sources: 'Fonti',
      note: 'Questa è una traduzione della nostra guida in inglese. I nomi del gioco che non abbiamo potuto verificare in italiano restano in inglese.',
      stale: 'La versione inglese è stata aggiornata il {date}. Questa traduzione potrebbe non essere aggiornata.',
      original: 'Originale in inglese', alsoIn: 'Disponibile anche in',
      hubTitle: 'The Division Resurgence in italiano: guide', hubH1: 'The Division Resurgence in italiano',
      hubIntro: 'Le nostre guide a The Division Resurgence in italiano. Le build, le tier list, il database e il build planner sono in inglese.',
      toolsTitle: 'Strumenti (in inglese)', planner: 'Build planner', tierList: 'Tier list', map: 'Mappa interattiva', database: 'Database', builds: 'Build',
      more: 'Altre guide in italiano',
    },
  },
  {
    code: 'tr', tag: 'tr', ogLocale: 'tr_TR', name: 'Türkçe', english: 'Turkish',
    ui: {
      home: 'Ana sayfa', guides: 'Rehberler', guide: 'Rehber', by: 'Yazan:', updated: 'Son güncelleme', contents: 'İçindekiler',
      questions: 'Sık sorulan sorular', sources: 'Kaynaklar',
      note: 'Bu sayfa İngilizce rehberimizin çevirisidir. Türkçe karşılığını doğrulayamadığımız oyun içi adlar İngilizce bırakılmıştır.',
      stale: 'İngilizce sürüm {date} tarihinde güncellendi. Bu çeviri güncel olmayabilir.',
      original: 'İngilizce aslı', alsoIn: 'Diğer diller',
      hubTitle: 'The Division Resurgence Türkçe rehberler', hubH1: 'The Division Resurgence Türkçe',
      hubIntro: 'The Division Resurgence için Türkçe rehberlerimiz. Buildler, tier listeleri, veritabanı ve build planlayıcı İngilizcedir.',
      toolsTitle: 'Araçlar (İngilizce)', planner: 'Build planlayıcı', tierList: 'Tier listesi', map: 'Etkileşimli harita', database: 'Veritabanı', builds: 'Buildler',
      more: 'Diğer Türkçe rehberler',
    },
  },
];

export const langByCode = (code: string) => LANGS.find((l) => l.code === code);
