

const cities = [
    {
        ad: "Adana",
        ilceler: ["Seyhan", "Çukurova", "Yüreğir", "Sarıçam", "Aladağ", "Ceyhan", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Tufanbeyli", "Yumurtalık"]
    },
    {
        ad: "Adıyaman",
        ilceler: ["Merkez", "Besni", "Çelikhan", "Gerger", "Gölbaşı", "Kahta", "Samsat", "Sincik", "Tut"]
    },
    {
        ad: "Afyonkarahisar",
        ilceler: ["Merkez", "Başmakçı", "Bayat", "Bolvadin", "Çay", "Çobanlar", "Dazkırı", "Dinar", "Emirdağ", "Evciler", "Hocalar", "İhsaniye", "İscehisar", "Kızılören", "Sandıklı", "Sinanpaşa", "Sultandağı", "Şuhut"]
    },
    {
        ad: "Ağrı",
        ilceler: ["Merkez", "Diyadin", "Doğubayazıt", "Eleşkirt", "Hamur", "Patnos", "Taşlıçay", "Tutak"]
    },
    {
        ad: "Aksaray",
        ilceler: ["Merkez", "Ağaçören", "Eskil", "Gülağaç", "Güzelyurt", "Ortaköy", "Sarıyahşi"]
    },
    {
        ad: "Amasya",
        ilceler: ["Merkez", "Göynücek", "Gümüşhacıköy", "Hamamözü", "Merzifon", "Suluova", "Taşova"]
    },
    {
        ad: "Ankara",
        ilceler: ["Altındağ", "Çankaya", "Etimesgut", "Keçiören", "Mamak", "Sincan", "Yenimahalle", "Akyurt", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çubuk", "Elmadağ", "Evren", "Güdül", "Haymana", "Kalecik", "Kazan", "Kızılcahamam", "Nallıhan", "Polatlı", "Şereflikoçhisar"]
    },
    {
        ad: "Antalya",
        ilceler: ["Alanya", "Demre", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Korkuteli", "Kumluca", "Manavgat", "Serik", "Akseki", "Aksu", "Döşemealtı", "Kepez", "Konyaaltı", "Muratpaşa"]
    },
    {
        ad: "Ardahan",
        ilceler: ["Merkez", "Çıldır", "Damal", "Göle", "Hanak", "Posof"]
    },
    {
        ad: "Artvin",
        ilceler: ["Ardanuç", "Arhavi", "Artvin Merkez", "Borçka", "Hopa", "Murgul", "Şavşat", "Yusufeli"]
    },
    {
        ad: "Aydın",
        ilceler: ["Buharkent", "Çine", "Didim", "Efeler", "Germencik", "İncirliova", "Karacasu", "Karpuzlu", "Koçarlı", "Köşk", "Kuşadası", "Kuyucak", "Nazilli", "Söke", "Sultanhisar", "Yenipazar"]
    },
    {
        ad: "Balıkesir",
        ilceler: ["Altıeylül", "Ayvalık", "Balya", "Bandırma", "Bigadiç", "Burhaniye", "Dursunbey", "Edremit", "Erdek", "Gömeç", "Gönen", "Havran", "İvrindi", "Karesi", "Kepsut", "Manyas", "Marmara", "Savaştepe", "Sındırgı", "Susurluk"]
    },
    {
        ad: "Bartın",
        ilceler: ["Merkez", "Amasra", "Kurucaşile", "Ulus"]
    },
    {
        ad: "Batman",
        ilceler: ["Merkez", "Beşiri", "Gercüş", "Hasankeyf", "Kozluk", "Sason"]
    },
    {
        ad: "Bayburt",
        ilceler: ["Merkez", "Aydıntepe", "Demirözü"]
    },
    {
        ad: "Bilecik",
        ilceler: ["Merkez", "Bozüyük", "Gölpazarı", "İnhisar", "Osmaneli", "Pazaryeri", "Söğüt", "Yenipazar"]
    },
    {
        ad: "Bingöl",
        ilceler: ["Merkez", "Adaklı", "Genç", "Karlıova", "Kiğı", "Solhan", "Yayladere", "Yedisu"]
    },
    {
        ad: "Bitlis",
        ilceler: ["Merkez", "Adilcevaz", "Ahlat", "Güroymak", "Hizan", "Mutki", "Tatvan"]
    },
    {
        ad: "Bolu",
        ilceler: ["Merkez", "Dörtdivan", "Gerede", "Göynük", "Kıbrıscık", "Mengen", "Mudurnu", "Seben", "Yeniçağa"]
    },
    {
        ad: "Burdur",
        ilceler: ["Merkez", "Ağlasun", "Altınyayla", "Bucak", "Çavdır", "Çeltikçi", "Gölhisar", "Karamanlı", "Kemer", "Tefenni", "Yeşilova"]
    },
    {
        ad: "Bursa",
        ilceler: ["Osmangazi", "Yıldırım", "Nilüfer", "Gemlik", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Orhaneli", "Orhangazi", "Yenişehir", "Büyükorhan", "Harmancık"]
    },
    {
        ad: "Çanakkale",
        ilceler: ["Merkez", "Ayvacık", "Bayramiç", "Biga", "Bozcaada", "Çan", "Eceabat", "Ezine", "Gelibolu", "Gökçeada", "Lapseki", "Yenice"]
    },
    {
        ad: "Çankırı",
        ilceler: ["Merkez", "Atkaracalar", "Bayramören", "Çerkeş", "Eldivan", "Ilgaz", "Kızılırmak", "Korgun", "Kurşunlu", "Orta", "Şabanözü", "Yapraklı"]
    },
    {
        ad: "Çorum",
        ilceler: ["Merkez", "Alaca", "Bayat", "Boğazkale", "Dodurga", "İskilip", "Kargı", "Laçin", "Mecitözü", "Oğuzlar", "Ortaköy", "Osmancık", "Sungurlu", "Uğurludağ"]
    },
    {
        ad: "Denizli",
        ilceler: ["Acıpayam", "Babadağ", "Baklan", "Bekilli", "Beyağaç", "Bozkurt", "Buldan", "Çal", "Çameli", "Çardak", "Çivril", "Güney", "Honaz", "Kale", "Merkezefendi", "Pamukkale", "Sarayköy", "Serinhisar", "Tavas"]
    },
    {
        ad: "Diyarbakır",
        ilceler: ["Bağlar", "Kayapınar", "Sur", "Yenişehir", "Bismil", "Çermik", "Çınar", "Çüngüş", "Dicle", "Eğil", "Ergani", "Hani", "Hazro", "Kocaköy", "Kulp", "Lice", "Silvan"]
    },
    {
        ad: "Düzce",
        ilceler: ["Merkez", "Akçakoca", "Cumayeri", "Çilimli", "Gölyaka", "Gümüşova", "Kaynaşlı", "Yığılca"]
    },
    {
        ad: "Edirne",
        ilceler: ["Merkez", "Enez", "Havsa", "İpsala", "Keşan", "Lalapaşa", "Meriç", "Süloğlu", "Uzunköprü"]
    },
    {
        ad: "Elazığ",
        ilceler: ["Merkez", "Ağın", "Alacakaya", "Arıcak", "Baskil", "Karakoçan", "Keban", "Kovancılar", "Maden", "Palu", "Sivrice"]
    },
    {
        ad: "Erzincan",
        ilceler: ["Merkez", "Çayırlı", "İliç", "Kemah", "Kemaliye", "Otlukbeli", "Refahiye", "Tercan", "Üzümlü"]
    },
    {
        ad: "Erzurum",
        ilceler: ["Yakutiye", "Aziziye", "Palandöken", "Aşkale", "Çat", "Hınıs", "Horasan", "İspir", "Karaçoban", "Karayazı", "Köprüköy", "Narman", "Oltu", "Olur", "Pasinler", "Pazaryolu", "Şenkaya", "Tekman", "Tortum", "Uzundere"]
    },
    {
        ad: "Eskişehir",
        ilceler: ["Tepebaşı", "Odunpazarı", "Alpu", "Beylikova", "Çifteler", "Günyüzü", "Han", "İnönü", "Mahmudiye", "Mihalgazi", "Mihalıççık", "Sarıcakaya", "Seyitgazi", "Sivrihisar"]
    },
    {
        ad: "Gaziantep",
        ilceler: ["Şahinbey", "Şehitkamil", "Araban", "İslahiye", "Karkamış", "Nizip", "Nurdağı", "Oğuzeli", "Yavuzeli"]
    },
    {
        ad: "Giresun",
        ilceler: ["Merkez", "Alucra", "Bulancak", "Çamoluk", "Çanakçı", "Dereli", "Doğankent", "Espiye", "Eynesil", "Görele", "Güce", "Keşap", "Piraziz", "Şebinkarahisar", "Tirebolu", "Yağlıdere"]
    },
    {
        ad: "Gümüşhane",
        ilceler: ["Merkez", "Kelkit", "Köse", "Kürtün", "Şiran", "Torul"]
    },
    {
        ad: "Hakkari",
        ilceler: ["Merkez", "Çukurca", "Şemdinli", "Yüksekova"]
    },
    {
        ad: "Hatay",
        ilceler: ["Antakya", "Arsuz", "Defne", "Dörtyol", "Erzin", "Hassa", "İskenderun", "Kırıkhan", "Kumlu", "Payas", "Reyhanlı", "Samandağ", "Yayladağı", "Altınözü", "Belen"]
    },
    {
        ad: "Iğdır",
        ilceler: ["Merkez", "Aralık", "Karakoyunlu", "Tuzluca"]
    },
    {
        ad: "Isparta",
        ilceler: ["Merkez", "Aksu", "Atabey", "Eğirdir", "Gelendost", "Gönen", "Keçiborlu", "Senirkent", "Sütçüler", "Şarkikaraağaç", "Uluborlu", "Yalvaç", "Yenişarbademli"]
    },
    {
        ad: "İstanbul",
        ilceler: ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüp", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"]
    },
    {
        ad: "İzmir",
        ilceler: ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"]
    },
    {
        ad: "Kahramanmaraş",
        ilceler: ["Onikişubat", "Dulkadiroğlu", "Afşin", "Andırın", "Çağlayancerit", "Ekinözü", "Elbistan", "Göksun", "Nurhak", "Pazarcık", "Türkoğlu"]
    },
    {
        ad: "Karabük",
        ilceler: ["Merkez", "Eflani", "Eskipazar", "Ovacık", "Safranbolu", "Yenice"]
    },
    {
        ad: "Karaman",
        ilceler: ["Merkez", "Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Sarıveliler"]
    },
    {
        ad: "Kars",
        ilceler: ["Merkez", "Akyaka", "Arpaçay", "Digor", "Kağızman", "Sarıkamış", "Selim", "Susuz"]
    },
    {
        ad: "Kastamonu",
        ilceler: ["Merkez", "Abana", "Ağlı", "Araç", "Azdavay", "Bozkurt", "Cide", "Çatalzeytin", "Daday", "Devrekani", "Doğanyurt", "Hanönü", "İhsangazi", "İnebolu", "Küre", "Pınarbaşı", "Şenpazar", "Seydiler", "Taşköprü", "Tosya"]
    },
    {
        ad: "Kayseri",
        ilceler: ["Kocasinan", "Melikgazi", "Talas", "Akkışla", "Bünyan", "Develi", "Felahiye", "Hacılar", "İncesu", "Özvatan", "Pınarbaşı", "Sarıoğlan", "Sarız", "Tomarza", "Yahyalı", "Yeşilhisar"]
    },
    {
        ad: "Kırıkkale",
        ilceler: ["Merkez", "Bahşılı", "Balışeyh", "Çelebi", "Delice", "Karakeçili", "Keskin", "Sulakyurt", "Yahşihan"]
    },
    {
        ad: "Kırklareli",
        ilceler: ["Merkez", "Babaeski", "Demirköy", "Kofçaz", "Lüleburgaz", "Pehlivanköy", "Pınarhisar", "Vize"]
    },
    {
        ad: "Kırşehir",
        ilceler: ["Merkez", "Akçakent", "Akpınar", "Boztepe", "Çiçekdağı", "Kaman", "Mucur"]
    },
    {
        ad: "Kilis",
        ilceler: ["Merkez", "Elbeyli", "Musabeyli", "Polateli"]
    },
    {
        ad: "Kocaeli",
        ilceler: ["Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze", "Gölcük", "İzmit", "Kandıra", "Karamürsel", "Kartepe", "Körfez"]
    },
    {
        ad: "Konya",
        ilceler: ["Meram", "Selçuklu", "Karatay", "Ahırlı", "Akören", "Akşehir", "Altınekin", "Beyşehir", "Bozkır", "Cihanbeyli", "Çeltik", "Çumra", "Derbent", "Derebucak", "Doğanhisar", "Emirgazi", "Ereğli", "Güneysınır", "Hadim", "Halkapınar", "Hüyük", "Ilgın", "Kadınhanı", "Karapınar", "Kulu", "Sarayönü", "Seydişehir", "Taşkent", "Tuzlukçu", "Yalıhüyük", "Yunak"]
    },
    {
        ad: "Kütahya",
        ilceler: ["Merkez", "Altıntaş", "Aslanapa", "Çavdarhisar", "Domaniç", "Dumlupınar", "Emet", "Gediz", "Hisarcık", "Pazarlar", "Simav", "Şaphane", "Tavşanlı"]
    },
    {
        ad: "Malatya",
        ilceler: ["Battalgazi", "Yeşilyurt", "Akçadağ", "Arapgir", "Arguvan", "Darende", "Doğanşehir", "Doğanyol", "Hekimhan", "Kale", "Kuluncak", "Pütürge", "Yazıhan"]
    },
    {
        ad: "Manisa",
        ilceler: ["Şehzadeler", "Yunusemre", "Akhisar", "Alaşehir", "Demirci", "Gölmarmara", "Gördes", "Kırkağaç", "Köprübaşı", "Kula", "Salihli", "Sarıgöl", "Saruhanlı", "Selendi", "Soma", "Turgutlu"]
    },
    {
        ad: "Mardin",
        ilceler: ["Artuklu", "Dargeçit", "Derik", "Kızıltepe", "Mazıdağı", "Midyat", "Nusaybin", "Ömerli", "Savur", "Yeşilli"]
    },
    {
        ad: "Mersin",
        ilceler: ["Akdeniz", "Mezitli", "Toroslar", "Yenişehir", "Anamur", "Aydıncık", "Bozyazı", "Çamlıyayla", "Erdemli", "Gülnar", "Mut", "Silifke", "Tarsus"]
    },
    {
        ad: "Muğla",
        ilceler: ["Bodrum", "Dalaman", "Datça", "Fethiye", "Kavaklıdere", "Köyceğiz", "Marmaris", "Menteşe", "Milas", "Ortaca", "Seydikemer", "Ula", "Yatağan"]
    },
    {
        ad: "Muş",
        ilceler: ["Merkez", "Bulanık", "Hasköy", "Korkut", "Malazgirt", "Varto"]
    },
    {
        ad: "Nevşehir",
        ilceler: ["Merkez", "Avanos", "Derinkuyu", "Gülşehir", "Hacıbektaş", "Kozaklı", "Ürgüp"]
    },
    {
        ad: "Niğde",
        ilceler: ["Merkez", "Altunhisar", "Bor", "Çamardı", "Çiftlik", "Ulukışla"]
    },
    {
        ad: "Ordu",
        ilceler: ["Altınordu", "Akkuş", "Aybastı", "Çamaş", "Çatalpınar", "Çaybaşı", "Fatsa", "Gölköy", "Gülyalı", "Gürgentepe", "Ikizce", "Kabadüz", "Kabataş", "Korgan", "Kumru", "Mesudiye", "Perşembe", "Ulubey", "Ünye"]
    },
    {
        ad: "Osmaniye",
        ilceler: ["Merkez", "Bahçe", "Düziçi", "Hasanbeyli", "Kadirli", "Sumbas", "Toprakkale"]
    },
    {
        ad: "Rize",
        ilceler: ["Merkez", "Ardeşen", "Çamlıhemşin", "Çayeli", "Derepazarı", "Fındıklı", "Güneysu", "Hemşin", "İkizdere", "İyidere", "Kalkandere", "Pazar"]
    },
    {
        ad: "Sakarya",
        ilceler: ["Adapazarı", "Akyazı", "Arifiye", "Erenler", "Ferizli", "Geyve", "Hendek", "Karapürçek", "Karasu", "Kaynarca", "Kocaali", "Pamukova", "Sapanca", "Serdivan", "Söğütlü", "Taraklı"]
    },
    {
        ad: "Samsun",
        ilceler: ["Atakum", "Canik", "İlkadım", "Tekkeköy", "Alaçam", "Asarcık", "Ayvacık", "Bafra", "Çarşamba", "Havza", "Kavak", "Ladik", "Salıpazarı", "Terme", "Vezirköprü", "Yakakent"]
    },
    {
        ad: "Siirt",
        ilceler: ["Merkez", "Aydınlar", "Baykan", "Eruh", "Kurtalan", "Pervari", "Şirvan"]
    },
    {
        ad: "Sinop",
        ilceler: ["Merkez", "Ayancık", "Boyabat", "Dikmen", "Durağan", "Erfelek", "Gerze", "Saraydüzü", "Türkeli"]
    },
    {
        ad: "Sivas",
        ilceler: ["Merkez", "Akıncılar", "Altınyayla", "Divriği", "Doğanşar", "Gemerek", "Gölova", "Gürün", "Hafik", "İmranlı", "Kangal", "Koyulhisar", "Suşehri", "Şarkışla", "Ulaş", "Yıldızeli", "Zara"]
    },
    {
        ad: "Şanlıurfa",
        ilceler: ["Akçakale", "Birecik", "Bozova", "Ceylanpınar", "Eyyübiye", "Halfeti", "Haliliye", "Harran", "Hilvan", "Karaköprü", "Siverek", "Suruç", "Viranşehir"]
    },
    {
        ad: "Şırnak",
        ilceler: ["Merkez", "Beytüşşebap", "Cizre", "Güçlükonak", "İdil", "Silopi", "Uludere"]
    },
    {
        ad: "Tekirdağ",
        ilceler: ["Çerkezköy", "Çorlu", "Ergene", "Hayrabolu", "Kapaklı", "Malkara", "Marmaraereğlisi", "Muratlı", "Saray", "Süleymanpaşa", "Şarköy"]
    },
    {
        ad: "Tokat",
        ilceler: ["Merkez", "Almus", "Artova", "Başçiftlik", "Erbaa", "Niksar", "Pazar", "Reşadiye", "Sulusaray", "Turhal", "Yeşilyurt", "Zile"]
    },
    {
        ad: "Trabzon",
        ilceler: ["Ortahisar", "Akçaabat", "Araklı", "Arsin", "Beşikdüzü", "Çarşıbaşı", "Çaykara", "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka", "Of", "Sürmene", "Şalpazarı", "Tonya", "Vakfıkebir", "Yomra"]
    },
    {
        ad: "Tunceli",
        ilceler: ["Merkez", "Çemişgezek", "Hozat", "Mazgirt", "Nazımiye", "Ovacık", "Pertek", "Pülümür"]
    },
    {
        ad: "Uşak",
        ilceler: ["Merkez", "Banaz", "Eşme", "Karahallı", "Sivaslı", "Ulubey"]
    },
    {
        ad: "Van",
        ilceler: ["İpekyolu", "Tuşba", "Edremit", "Bahçesaray", "Başkale", "Çaldıran", "Çatak", "Erciş", "Gevaş", "Gürpınar", "Muradiye", "Özalp", "Saray"]
    },
    {
        ad: "Yalova",
        ilceler: ["Merkez", "Altınova", "Armutlu", "Çınarcık", "Çiftlikköy", "Termal"]
    },
    {
        ad: "Yozgat",
        ilceler: ["Merkez", "Akdağmadeni", "Aydıncık", "Boğazlıyan", "Çandır", "Çayıralan", "Çekerek", "Kadışehri", "Saraykent", "Sarıkaya", "Sorgun", "Şefaatli", "Yenifakılı", "Yerköy"]
    },
    {
        ad: "Zonguldak",
        ilceler: ["Merkez", "Alaplı", "Çaycuma", "Devrek", "Ereğli", "Gökçebey"]
    }
]

module.exports = {
    cities
}