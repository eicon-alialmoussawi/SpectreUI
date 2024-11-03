const year = new Date().getFullYear(); 


const yearAr = new Date().toLocaleDateString('ar-EG',{year:"numeric"});

var values = [
  { label: "Name", value: "Name", lang: "en" },
  { label: "Name", value: "الاسم", lang: "ar" },
  { label: "Name", value: "Nom", lang: "fr" },
  { label: "Email", value: "Email", lang: "en" },
  { label: "Email", value: "بريدالالكتروني", lang: "ar" },
  { label: "Email", value: "E-mail", lang: "fr" },
  { label: "CompanyName", value: "Company Name", lang: "en" },
  { label: "CompanyName", value: "اسم الشركة", lang: "ar" },
  { label: "CompanyName", value: "Nom de la Compagnie", lang: "fr" },
  { label: "Message", value: "Message", lang: "en" },
  { label: "Message", value: " رسالة", lang: "ar" },
  { label: "Message", value: "Un message", lang: "fr" },
  { label: "SendRequest", value: "Send Request", lang: "en" },
  { label: "SendRequest", value: " ارسال الطلب", lang: "ar" },
  { label: "SendRequest", value: "Envoyer une demande", lang: "fr" },
  { label: "ContactForm", value: "Contact Form", lang: "en" },
  { label: "ContactForm", value: "نموذج الاتصال", lang: "ar" },
  { label: "ContactForm", value: "Formulaire de contact", lang: "fr" },
  {
    label: "ContactFormMessage",
    value:
      "Fill in the form below, and we will contact you to answer questions, discuss Spectre, or provide you with free trial or subscription",
    lang: "en",
  },
  {
    label: "ContactFormMessage",
    value:
      "املأ النموذج أدناه ، وسنتصل بك للإجابة على الأسئلة أو مناقشة Specter أو تزويدك بتجربة مجانية أو اشتراك",
    lang: "ar",
  },
  {
    label: "ContactFormMessage",
    value:
      "Remplissez le formulaire ci-dessous et nous vous contacterons pour répondre à vos questions, discuter de Spectre ou vous proposer un essai gratuit ou un abonnement",
    lang: "fr",
  },
  { label: "RecentNews", value: "Recent Spectrum News", lang: "en" },
  { label: "RecentNews", value: "أحدث أخبار الطيف", lang: "ar" },
  {
    label: "RecentNews",
    value: "Nouvelles récentes sur le spectre",
    lang: "fr",
  },
  { label: "News", value: "News", lang: "en" },
  { label: "News", value: "أخبار ", lang: "ar" },
  { label: "News", value: "Nouvelles", lang: "fr" },
  { label: "PackagesAndServices", value: "Packages and Services", lang: "en" },
  { label: "PackagesAndServices", value: "الحزم والخدمات ", lang: "ar" },
  { label: "PackagesAndServices", value: "Forfaits et services", lang: "fr" },
  {
    label: "ExplorePackages",
    value: "Explore Our Packages and Services",
    lang: "en",
  },
  { label: "ExplorePackages", value: "إختيار التطبيقات والخدمات", lang: "ar" },
  {
    label: "ExplorePackages",
    value: "Découvrez nos forfaits et services",
    lang: "fr",
  },
  { label: "ContactUs", value: "Contact Us", lang: "en" },
  { label: "ContactUs", value: "اتصل بنا", lang: "ar" },
  { label: "ContactUs", value: "Contacter Nous", lang: "fr" },
  { label: "About", value: "About", lang: "en" },
  { label: "About", value: "عن", lang: "ar" },
  { label: "About", value: "A propos de nous", lang: "fr" },
  { label: "Features", value: "Features", lang: "en" },
  { label: "Features", value: "سمات", lang: "ar" },
  { label: "Features", value: "Caractéristiques", lang: "fr" },
  {
    label: "ExploreTools",
    value: "Explore Our Tools for Spectrum Pricing",
    lang: "en",
  },
  {
    label: "ExploreTools",
    value: "إختيار الطرق والأدوات لتسعير الطيف الترددي",
    lang: "ar",
  },
  {
    label: "ExploreTools",
    value: "Explorez nos outils pour la tarification du spectre",
    lang: "fr",
  },
  { label: "Screenshots", value: "Screenshots", lang: "en" },
  { label: "Screenshots", value: "لقطات", lang: "ar" },
  { label: "Screenshots", value: "Captures d'écran", lang: "fr" },
  { label: "RegistrationForm", value: "Registration Form", lang: "en" },
  { label: "RegistrationForm", value: "إستمارة تسجيل", lang: "ar" },
  { label: "RegistrationForm", value: "Formulaire d'inscription", lang: "fr" },
  { label: "Login", value: "Login", lang: "en" },
  { label: "Login", value: "تسجيل الدخول", lang: "ar" },
  { label: "Login", value: "Le Login", lang: "fr" },
  { label: "Username", value: "Username", lang: "en" },
  { label: "Username", value: "اسم المستخدم", lang: "ar" },
  { label: "Username", value: "Nom de passe", lang: "fr" },
  { label: "Password", value: "Password", lang: "en" },
  { label: "Password", value: "كلمه السر", lang: "ar" },
  { label: "Password", value: "Mot de passe", lang: "fr" },
  { label: "Register", value: "Register", lang: "en" },
  { label: "Register", value: "تسجيل", lang: "ar" },
  { label: "Register", value: "S'inscrire", lang: "fr" },
  {
    label: "SendRegistrationRequest",
    value: "Send us a registration request?",
    lang: "en",
  },
  {
    label: "SendRegistrationRequest",
    value: "أرسل لنا طلب التسجيل؟",
    lang: "ar",
  },
  {
    label: "SendRegistrationRequest",
    value: "Nous envoyer une demande d''inscription ?",
    lang: "fr",
  },
  { label: "PhoneNumber", value: "Phone Number", lang: "en" },
  { label: "PhoneNumber", value: "رقم الهاتف", lang: "ar" },
  { label: "PhoneNumber", value: "Numéro de téléphone", lang: "fr" },
  { label: "PreferredPackage", value: "Preferred Package", lang: "en" },
  { label: "PreferredPackage", value: "الباقة المطلوبة", lang: "ar" },
  { label: "PreferredPackage", value: "Forfait préféré", lang: "fr" },
  { label: "SingleBand", value: "Single Band", lang: "en" },
  { label: "SingleBand", value: "حزمة واحدة", lang: "ar" },
  { label: "SingleBand", value: "Bande Seul", lang: "fr" },
  { label: "MultiBand", value: "Multi-Band", lang: "en" },
  { label: "MultiBand", value: "حزم متعددة", lang: "ar" },
  { label: "MultiBand", value: "Multi-bande", lang: "fr" },
  { label: "Paired", value: "Paired", lang: "en" },
  { label: "Paired", value: "مقترن", lang: "ar" },
  { label: "Paired", value: "Apparié", lang: "fr" },
  { label: "Unpaired", value: "Unpaired", lang: "en" },
  { label: "Unpaired", value: "غير مقترن ", lang: "ar" },
  { label: "Unpaired", value: "Non apparié", lang: "fr" },
  { label: "PairedUnpaired", value: "Paired + Unpaired", lang: "en" },
  { label: "PairedUnpaired", value: "مقترن + غير مقترن ", lang: "ar" },
  { label: "PairedUnpaired", value: "Apparié+ Non apparié", lang: "fr" },
  { label: "Yes", value: "Yes", lang: "en" },
  { label: "Yes", value: "نعم ", lang: "ar" },
  { label: "Yes", value: "Oui", lang: "fr" },
  { label: "No", value: "No", lang: "en" },
  { label: "No", value: "لا ", lang: "ar" },
  { label: "No", value: "Non", lang: "fr" },
  { label: "RegionalLicenses", value: "Regional", lang: "en" },
  { label: "RegionalLicenses", value: "التراخيص الإقليمية ", lang: "ar" },
  { label: "RegionalLicenses", value: "Régional", lang: "fr" },
  { label: "MaxGDPc", value: "Max GDPc", lang: "en" },
  {
    label: "MaxGDPc",
    value: " GDPc الأقصى ",
    lang: "ar",
  },
  { label: "MaxGDPc", value: "Max GDPc", lang: "fr" },
  { label: "MinGDPc", value: "Min GDPc", lang: "en" },
  {
    label: "MinGDPc",
    value: "GDPc الأدنى ",
    lang: "ar",
  },
  { label: "MinGDPc", value: "Min GDPc", lang: "fr" },
  { label: "AwardsFrom", value: "From", lang: "en" },
  { label: "AwardsFrom", value: "من سنة", lang: "ar" },
  { label: "AwardsFrom", value: "Depuis", lang: "fr" },
  { label: "AwardsTo", value: "To", lang: "en" },
  { label: "AwardsTo", value: "الى سنة", lang: "ar" },
  { label: "AwardsTo", value: "Jusqu'à", lang: "fr" },
  { label: "Bands", value: "Bands", lang: "en" },
  { label: "Bands", value: "الحزم", lang: "ar" },
  { label: "Bands", value: "Bandes", lang: "fr" },
  { label: "AllBands", value: "All Bands", lang: "en" },
  { label: "AllBands", value: "جميع الحزم", lang: "ar" },
  { label: "AllBands", value: "Toutes les bandes", lang: "fr" },
  { label: "Countries", value: "Country", lang: "en" },
  { label: "Countries", value: "الدولة", lang: "ar" },
  { label: "Countries", value: "Pays", lang: "fr" },
  { label: "Pop", value: "Pop, M", lang: "en" },
  { label: "Pop", value: "عدد السكان", lang: "ar" },
  { label: "Pop", value: "Pop", lang: "fr" },
  { label: "Operator", value: "Operator", lang: "en" },
  { label: "Operator", value: "المشغل", lang: "ar" },
  { label: "Operator", value: "Opérateur", lang: "fr" },
  { label: "AwardDate", value: "Date", lang: "en" },
  { label: "AwardDate", value: "التاريخ", lang: "ar" },
  { label: "AwardDate", value: "Date", lang: "fr" },
  { label: "PricePaid", value: "Price Paid", lang: "en" },
  { label: "PricePaid", value: "السعر المحدد", lang: "ar" },
  { label: "PricePaid", value: "Prix payé", lang: "fr" },
  { label: "Term", value: "Term (Y)", lang: "en" },
  { label: "Term", value: "المدة", lang: "ar" },
  { label: "Term", value: "Durée", lang: "fr" },
  { label: "Coverage", value: "Coverage", lang: "en" },
  { label: "Coverage", value: "التغطية", lang: "ar" },
  { label: "Coverage", value: "Couverture", lang: "fr" },
  { label: "From", value: "From", lang: "en" },
  { label: "From", value: "من", lang: "ar" },
  { label: "From", value: "De", lang: "fr" },
  { label: "To", value: "To", lang: "en" },
  { label: "To", value: "الى", lang: "ar" },
  { label: "To", value: "À", lang: "fr" },
  { label: "Clear", value: "Clear", lang: "en" },
  { label: "Clear", value: "مسح", lang: "ar" },
  { label: "Clear", value: "Dégager", lang: "fr" },
  { label: "Previous", value: "Previous", lang: "en" },
  { label: "Previous", value: "السابق", lang: "ar" },
  { label: "Previous", value: "Préalable", lang: "fr" },
  { label: "Next", value: "Next", lang: "en" },
  { label: "Next", value: "التالي", lang: "ar" },
  { label: "Next", value: "à côté", lang: "fr" },
  { label: "BackToFilters", value: "Back To Filters", lang: "en" },
  { label: "BackToFilters", value: "العودة إلى المرشحات", lang: "ar" },
  { label: "BackToFilters", value: "Retour Vers Filtres", lang: "fr" },
  { label: "Show", value: "Show", lang: "en" },
  { label: "Show", value: "عرض", lang: "ar" },
  { label: "Show", value: "Affichage", lang: "fr" },
  { label: "All", value: "All", lang: "en" },
  { label: "All", value: "الكل", lang: "ar" },
  { label: "All", value: "Toute", lang: "fr" },
  { label: "Value/Regression", value: "Value/Regression", lang: "en" },
  { label: "Value/Regression", value: "التقييم بالانحدار", lang: "ar" },
  { label: "Value/Regression", value: "Valeur/Régression", lang: "fr" },
  { label: "Value/Bencmark", value: "Value/Benchmark", lang: "en" },
  { label: "Value/Bencmark", value: "التقييم بالمعايير", lang: "ar" },
  { label: "Value/Bencmark", value: "Valeur/Références", lang: "fr" },
  { label: "Value/Distance", value: "Value/Distance", lang: "en" },
  { label: "Value/Distance", value: "التقييم بالمسافة", lang: "ar" },
  { label: "Value/Distance", value: "Valeur/Distance", lang: "fr" },
  { label: "Percentile", value: "Percentile", lang: "en" },
  { label: "Percentile", value: "النسبة المئوية", lang: "ar" },
  { label: "Percentile", value: "Centile", lang: "fr" },
  { label: "Interquartile", value: "Interquartile", lang: "en" },
  { label: "Interquartile", value: "النسبة الرباعية", lang: "ar" },
  { label: "Interquartile", value: "Interquartile", lang: "fr" },
  { label: "StandardDeviation", value: "Standard deviation", lang: "en" },
  { label: "StandardDeviation", value: "الانحراف المعياري", lang: "ar" },
  { label: "StandardDeviation", value: "L'écart type", lang: "fr" },
  { label: "IterativeRegression", value: "Iterative Regression", lang: "en" },
  { label: "IterativeRegression", value: "الانحدار التكراري", lang: "ar" },
  { label: "IterativeRegression", value: "Régression itérative", lang: "fr" },
  { label: "AutoFiltering", value: "Auto Filtering", lang: "en" },
  { label: "AutoFiltering", value: "فلترة تلقائية", lang: "ar" },
  { label: "AutoFiltering", value: "Auto-Filtrage", lang: "fr" },
  { label: "DiscountRate", value: "Discount Rate", lang: "en" },
  { label: "DiscountRate", value: "معدل الخصم", lang: "ar" },
  { label: "DiscountRate", value: "Actualisation", lang: "fr" },
  { label: "IssueDate", value: "Issue Date", lang: "en" },
  { label: "IssueDate", value: "تاريخ الإصدار", lang: "ar" },
  { label: "IssueDate", value: "Date d'Attribution", lang: "fr" },
  { label: "UniqueAwards", value: "Unique", lang: "en" },
  { label: "UniqueAwards", value: "تراخيص فريدة", lang: "ar" },
  { label: "UniqueAwards", value: "Uniques", lang: "fr" },
  { label: "AvgUnitPrice", value: "Average by unit prices", lang: "en" },
  { label: "AvgUnitPrice", value: "متوسط أسعار الوحدات", lang: "ar" },
  { label: "AvgUnitPrice", value: "Moyenne par prix unitaires", lang: "fr" },
  { label: "AvgBySum", value: "Average by sum", lang: "en" },
  { label: "AvgBySum", value: "متوسط المجموع", lang: "ar" },
  { label: "AvgBySum", value: "Moyenne par somme", lang: "fr" },
  { label: "AddAnualPmt", value: "Add annual payments", lang: "en" },
  { label: "AddAnualPmt", value: "أضف المدفوعات السنوية", lang: "ar" },
  { label: "AddAnualPmt", value: "Ajoute montant annuels", lang: "fr" },
  { label: "AdjustPPPFactor", value: "Adjust to PPP", lang: "en" },
  {
    label: "AdjustPPPFactor",
    value: "التعديل/PPP",
    lang: "ar",
  },
  { label: "AdjustPPPFactor", value: "Ajuster au PPP", lang: "fr" },
  { label: "NormalizeByGDPc", value: "Normalize/ GDPc", lang: "en" },
  {
    label: "NormalizeByGDPc",
    value: "تعديل الأسعار / GDPc ",
    lang: "ar",
  },
  {
    label: "NormalizeByGDPc",
    value: "Normaliser/ GDPc",
    lang: "fr",
  },
  { label: "AdjustInflation", value: "Adjust for inflation", lang: "en" },
  { label: "AdjustInflation", value: "تعديل بنسبة التضخم", lang: "ar" },
  { label: "AdjustInflation", value: "Corrige de l'inflation", lang: "fr" },
  { label: "AnnualizePrices", value: "Annualize prices", lang: "en" },
  { label: "AnnualizePrices", value: "احتساب الدفعة السنوية", lang: "ar" },
  { label: "AnnualizePrices", value: "Annualiser les prix", lang: "fr" },
  { label: "ShowMarkers", value: "Show markers", lang: "en" },
  { label: "ShowMarkers", value: "عرض المؤشرات", lang: "ar" },
  { label: "ShowMarkers", value: "Marqueurs", lang: "fr" },
  { label: "ExcludeOutliers", value: "Exclude outliers", lang: "en" },
  { label: "ExcludeOutliers", value: "بدون القيم المتطرفة", lang: "ar" },
  { label: "ExcludeOutliers", value: "Sans Aberrations ", lang: "fr" },
  { label: "Plot", value: "Plot", lang: "en" },
  { label: "Plot", value: "تخطيط", lang: "ar" },
  { label: "Plot", value: "Tracer", lang: "fr" },
  { label: "Save", value: "Save", lang: "en" },
  { label: "Save", value: "حفظ", lang: "ar" },
  { label: "Save", value: "Sauvegarder", lang: "fr" },
  { label: "Country", value: "Country", lang: "en" },
  { label: "Country", value: "البلد", lang: "ar" },
  { label: "Country", value: "Pays", lang: "fr" },
  { label: "Date", value: "Date", lang: "en" },
  { label: "Date", value: "التاريخ", lang: "ar" },
  { label: "Date", value: "Date", lang: "fr" },
  { label: "Admin", value: "Admin", lang: "en" },
  { label: "Admin", value: "الادارة", lang: "ar" },
  { label: "Admin", value: "Admin", lang: "fr" },
  { label: "Logout", value: "Logout", lang: "en" },
  { label: "Logout", value: "خروج", lang: "ar" },
  { label: "Logout", value: "Se déconnecter", lang: "fr" },
  { label: "AwardsFiltering", value: "Awards Filtering ", lang: "en" },
  { label: "AwardsFiltering", value: "الفلترة", lang: "ar" },
  { label: "AwardsFiltering", value: "Attributions Filtrage", lang: "fr" },
  { label: "CountrySelection", value: "Country Selection", lang: "en" },
  { label: "CountrySelection", value: "اختيار الدول", lang: "ar" },
  { label: "CountrySelection", value: "Sélection des Pays", lang: "fr" },
  { label: "BandSelection", value: "Band Selection", lang: "en" },
  { label: "BandSelection", value: "اختيار الحزم", lang: "ar" },
  { label: "BandSelection", value: "Sélection des Bandes", lang: "fr" },
  { label: "Show", value: "Show", lang: "en" },
  { label: "Show", value: "عرض", lang: "ar" },
  { label: "Show", value: "Afficher", lang: "fr" },
  { label: "ListOfAwards", value: "List of Awards", lang: "en" },
  { label: "ListOfAwards", value: " قائمة التراخيص", lang: "ar" },
  { label: "ListOfAwards", value: "Liste des Attributions", lang: "fr" },
  { label: "Price$M", value: "Price, $M", lang: "en" },
  { label: "Price$M", value: "السعر , M$", lang: "ar" },
  { label: "Price$M", value: "Prix, $M", lang: "fr" },
  { label: "Pairing", value: "Pairing", lang: "en" },
  { label: "Pairing", value: "الازدواجية", lang: "ar" },
  { label: "Pairing", value: "Appariement", lang: "fr" },
  { label: "TotalMHz", value: "Total MHz", lang: "en" },
  { label: "TotalMHz", value: "إجمالي MHz", lang: "ar" },
  { label: "TotalMHz", value: "MHz Total", lang: "fr" },
  { label: "ReservePrice", value: "Reserve Price ($/MHz)", lang: "en" },
  { label: "ReservePrice", value: "السعر الاحتياطي (MHz/$)", lang: "ar" },
  { label: "ReservePrice", value: "Prix de Réserve ($/MHz)", lang: "fr" },
  { label: "IncludeAwards", value: "Include Awards", lang: "en" },
  { label: "IncludeAwards", value: "تضمن التراخيص", lang: "ar" },
  { label: "IncludeAwards", value: "Inclure Attributions", lang: "fr" },
  { label: "ExportToExcel", value: "Export To Excel", lang: "en" },
  { label: "ExportToExcel", value: "تصدير إلى Excel", lang: "ar" },
  { label: "ExportToExcel", value: "Exporter vers Excel", lang: "fr" },
  { label: "ExportToPDF", value: "Export To PDF", lang: "en" },
  { label: "ExportToPDF", value: "تصدير إلى PDF", lang: "ar" },
  { label: "ExportToPDF", value: "Exporter vers PDF", lang: "fr" },
  { label: "ShowLess", value: "Show Less", lang: "en" },
  { label: "ShowLess", value: "عرض أقل", lang: "ar" },
  { label: "ShowLess", value: "Montrer moins", lang: "fr" },
  { label: "ShowMore", value: "Show More", lang: "en" },
  { label: "ShowMore", value: "عرض المزيد", lang: "ar" },
  { label: "ShowMore", value: "Montre plus", lang: "fr" },
  { label: "Page", value: "Page", lang: "en" },
  { label: "Page", value: "الصفحة", lang: "ar" },
  { label: "Page", value: "Page", lang: "fr" },
  { label: "GoToPage", value: "Go To Page", lang: "en" },
  { label: "GoToPage", value: "انتقل إلى الصفحة", lang: "ar" },
  { label: "GoToPage", value: "Aller à la page", lang: "fr" },
  { label: "LicenseConditions", value: "License Conditions", lang: "en" },
  { label: "LicenseConditions", value: "شروط التراخيص", lang: "ar" },
  { label: "LicenseConditions", value: "Conditions de Licence", lang: "fr" },
  { label: "LicenseCertifications", value: "License Conditions", lang: "en" },
  { label: "LicenseCertifications", value: "شروط الترخيص", lang: "ar" },
  {
    label: "LicenseCertifications",
    value: "Conditions de Licence",
    lang: "fr",
  },
  { label: "Adjustments", value: "Adjustments", lang: "en" },
  { label: "Adjustments", value: "التعديلات ", lang: "ar" },
  { label: "Adjustments", value: "Ajustements", lang: "fr" },
  { label: "Analysis", value: "Analysis", lang: "en" },
  { label: "Analysis", value: "التحليل ", lang: "ar" },
  { label: "Analysis", value: "Analyse", lang: "fr" },
  { label: "ShowResults", value: "Show Awards", lang: "en" },
  { label: "ShowResults", value: "عرض التراخيص ", lang: "ar" },
  { label: "ShowResults", value: "Afficher Attributions", lang: "fr" },
  { label: "SumBands", value: "Sum bands", lang: "en" },
  { label: "SumBands", value: "جمع عرض الحزم", lang: "ar" },
  { label: "SumBands", value: "Somme Bandes", lang: "fr" },
  { label: "Upper%", value: "Upper %", lang: "en" },
  { label: "Upper%", value: "% العليا", lang: "ar" },
  { label: "Upper%", value: "% Supérieur", lang: "fr" },
  { label: "Lower%", value: "Lower  %", lang: "en" },
  { label: "Lower%", value: "% الدنيا ", lang: "ar" },
  { label: "Lower%", value: "%  Inférieur", lang: "fr" },
  { label: "kValue", value: "k value", lang: "en" },
  { label: "kValue", value: "المؤشر k", lang: "ar" },
  { label: "kValue", value: "Valeur k", lang: "fr" },
  { label: "PriceBenchmarks", value: "Price Benchmarks", lang: "en" },
  { label: "PriceBenchmarks", value: "أسعار مرجعية", lang: "ar" },
  { label: "PriceBenchmarks", value: "Prix Références", lang: "fr" },
  { label: "ShowPrices", value: "Show Prices", lang: "en" },
  { label: "ShowPrices", value: "رض الاسعار", lang: "ar" },
  { label: "ShowPrices", value: "Afficher les Prix", lang: "fr" },
  { label: "Mean", value: "Mean", lang: "en" },
  { label: "Mean", value: "المعدّل", lang: "ar" },
  { label: "Mean", value: "Moyenne", lang: "fr" },
  { label: "DeSelectedAwards", value: "De-Selected Awards", lang: "en" },
  { label: "DeSelectedAwards", value: "التراخيص المستثنات", lang: "ar" },
  {
    label: "DeSelectedAwards",
    value: "Attributions Désélectionnées",
    lang: "fr",
  },
  { label: "Select", value: "---Select---", lang: "en" },
  { label: "Select", value: "---اختيار---", lang: "ar" },
  { label: "Select", value: "---Sélectionner---", lang: "fr" },
  { label: "NumberOfAwards", value: "Number Of Awards", lang: "en" },
  { label: "NumberOfAwards", value: "عدد التراخيص", lang: "ar" },
  { label: "NumberOfAwards", value: "Nombre d'Attributions", lang: "fr" },
  { label: "AvgAwards", value: "Average Awards", lang: "en" },
  { label: "AvgAwards", value: "متوسط التراخيص", lang: "ar" },
  { label: "AvgAwards", value: "Moyenne", lang: "fr" },
  {
    label: "BenchMarkTitle",
    value: "Band Price Ratios",
    lang: "en",
  },
  { label: "BenchMarkTitle", value: "نسب سعر الحزمة", lang: "ar" },
  {
    label: "BenchMarkTitle",
    value: "Ratios de prix de bande",
    lang: "fr",
  },
  { label: "ValuatedCase", value: "Valuation Case", lang: "en" },
  { label: "ValuatedCase", value: "تقييم الترخيص", lang: "ar" },
  { label: "ValuatedCase", value: "Cas de Valorisation", lang: "fr" },
  { label: "AllBands", value: "All Bands", lang: "en" },
  { label: "AllBands", value: "كافة الحزم", lang: "ar" },
  { label: "AllBands", value: "Toutes les Bandes", lang: "fr" },
  { label: "LicenseTerm", value: "License Term", lang: "en" },
  { label: "LicenseTerm", value: "مدة الترخيص", lang: "ar" },
  { label: "LicenseTerm", value: "Durée", lang: "fr" },
  { label: "LowBand", value: "Low Band", lang: "en" },
  { label: "LowBand", value: " الحزمة الادنى", lang: "ar" },
  { label: "LowBand", value: "Bande Basse", lang: "fr" },
  { label: "TargetBand", value: "Target Band", lang: "en" },
  { label: "TargetBand", value: "الحزمة المطلوبة", lang: "ar" },
  { label: "TargetBand", value: "Bande Prévus", lang: "fr" },
  { label: "HighBand", value: "High band", lang: "en" },
  { label: "HighBand", value: " الحزمة الاعلى", lang: "ar" },
  { label: "HighBand", value: "Bande Haute", lang: "fr" },
  { label: "RelativeValue", value: "Relative Value", lang: "en" },
  { label: "RelativeValue", value: "القيمة النسبية", lang: "ar" },
  { label: "RelativeValue", value: "Valeur Relative ", lang: "fr" },
  {
    label: "AwardsByBenchmark",
    value: "Awards used in Valuation by Benchmarks",
    lang: "en",
  },
  {
    label: "AwardsByBenchmark",
    value: "التراخيص المستخدمة في التقييم بالمعايير",
    lang: "ar",
  },
  {
    label: "AwardsByBenchmark",
    value: "Attributions utilisées dans le Valorisation par Références",
    lang: "fr",
  },
  { label: "PriceByMean", value: "Price by Mean,", lang: "en" },
  { label: "PriceByMean", value: "السعر من المتوسط ", lang: "ar" },
  { label: "PriceByMean", value: "Prix par Moyenne, ", lang: "fr" },
  { label: "PriceByMedian", value: "Price by Median, ", lang: "en" },
  { label: "PriceByMedian", value: "السعر من المعدل الوسيط ,", lang: "ar" },
  { label: "PriceByMedian", value: "Prix par Médians, ", lang: "fr" },
  {
    label: "AwardsByRegression",
    value: "Awards in Valuation by Regression",
    lang: "en",
  },
  {
    label: "AwardsByRegression",
    value: "التراخيص المستخدمة في التقييم بالانحدار",
    lang: "ar",
  },
  {
    label: "AwardsByRegression",
    value: "Attributions dans la Valorisation par Régression",
    lang: "fr",
  },
  {
    label: "AwardsByDistance",
    value: "Awards in Valuation by Distance",
    lang: "en",
  },
  {
    label: "AwardsByDistance",
    value: "التراخيص المستخدمة في التقييم بالمسافة",
    lang: "ar",
  },
  {
    label: "AwardsByDistance",
    value: "Attributions dans la Valorisation par Distance",
    lang: "fr",
  },
  { label: "ValuationCaseResult", value: "Valuation Case Results", lang: "en" },
  { label: "ValuationCaseResult", value: "نتائج تقييم الترخيص", lang: "ar" },
  {
    label: "ValuationCaseResult",
    value: "Résultats du Cas de Valorisation",
    lang: "fr",
  },
  { label: "Trends", value: "Trends", lang: "en" },
  { label: "Trends", value: "اتجاهات الأسعار", lang: "ar" },
  { label: "Trends", value: "Evolution des prix", lang: "fr" },
  { label: "EnforceB", value: "Enfore b/ +ve ?", lang: "en" },
  { label: "EnforceB", value: "?فرض تقاطع إيجابي", lang: "ar" },
  { label: "EnforceB", value: "Appliquer b/ +ve ?", lang: "fr" },
  { label: "Population", value: "Population, M", lang: "en" },
  { label: "Population", value: "م,عدد السكان", lang: "ar" },
  { label: "Population", value: "Population, M", lang: "fr" },
  { label: "Median", value: "Median", lang: "en" },
  { label: "Median", value: "المعدّل الوسيط", lang: "ar" },
  { label: "Median", value: "Médiane", lang: "fr" },
  { label: "Price", value: "Price", lang: "en" },
  { label: "Price", value: "السعر", lang: "ar" },
  { label: "Price", value: "Prix", lang: "fr" },
  {
    label: "AwardsByValuation",
    value: "Awards used in Valuation ",
    lang: "en",
  },
  {
    label: "AwardsByValuation",
    value: "التراخيص المستخدمة في التقييم",
    lang: "ar",
  },
  {
    label: "AwardsByValuation",
    value: "Attributions utilisées dans le Valorisation",
    lang: "fr",
  },
  { label: "Band", value: "Band", lang: "en" },
  { label: "Band", value: "الحزمة", lang: "ar" },
  { label: "Band", value: "Bande", lang: "fr" },
  {
    label: "ChooseOneCountry",
    value: "Please choose at least one country",
    lang: "en",
  },
  {
    label: "ChooseOneCountry",
    value: "الرجاء اختيار دولة واحدة على الأقل",
    lang: "ar",
  },
  {
    label: "ChooseOneCountry",
    value: "Veuillez choisir au moins un pays",
    lang: "fr",
  },
  {
    label: "ChooseOneBand",
    value: "Please choose at least one band",
    lang: "en",
  },
  {
    label: "ChooseOneBand",
    value: "الرجاء اختيار حزمة واحدة على الأقل",
    lang: "ar",
  },
  {
    label: "ChooseOneBand",
    value: "Veuillez choisir au moins un bande",
    lang: "fr",
  },
  {
    label: "MinGDPValidation",
    value: "Minimum value for GDP is 0",
    lang: "en",
  },
  { label: "MinGDPValidation", value: "الحد الأدنى GDP هو 0", lang: "ar" },
  {
    label: "MinGDPValidation",
    value: "La valeur minimale pour le PIB est de 0",
    lang: "fr",
  },
  {
    label: "MaxGDPValidation",
    value: "Maximum value for GDP is 200,000",
    lang: "en",
  },
  {
    label: "MaxGDPValidation",
    value: "الحد الاقصى GDP هو 200,000",
    lang: "ar",
  },
  {
    label: "MaxGDPValidation",
    value: "La valeur maximale pour le PIB est de 200,000",
    lang: "fr",
  },
  {
    label: "DateValidation",
    value: "Award from date must be less than award to date",
    lang: "en",
  },
  {
    label: "DateValidation",
    value: "يجب أن تكون  من تاريخ أقل من الى التاريخ",
    lang: "ar",
  },
  {
    label: "DateValidation",
    value:
      "L'attribution à partir de la date doit être inférieure à l'attribution à ce jour",
    lang: "fr",
  },
  { label: "ValidFromDate", value: "Please enter a valid date", lang: "en" },
  { label: "ValidFromDate", value: "الرجاء إدخال تاريخ صالح", lang: "ar" },
  {
    label: "ValidFromDate",
    value: "Veuillez entrer une date valide",
    lang: "fr",
  },
  { label: "ValidToDate", value: "Please enter a valid date", lang: "en" },
  { label: "ValidToDate", value: "الرجاء إدخال تاريخ صالح", lang: "ar" },
  {
    label: "ValidToDate",
    value: "Veuillez entrer une date valide",
    lang: "fr",
  },
  {
    label: "MinimumFromDate",
    value: "Minimum date for From Date is 1985",
    lang: "en",
  },
  {
    label: "MinimumFromDate",
    value: "الحد الأدنى لتاريخ من تاريخ هو 1985",
    lang: "ar",
  },
  {
    label: "MinimumFromDate",
    value: "La date minimale pour la date de début est 1985",
    lang: "fr",
  },
  {
    label: "MaximumFromDate",
    value: "Maximum date for From Date is",
    lang: "en",
  },
  { label: "MaximumFromDate", value: "أقصى تاريخ لـ من تاريخ هو", lang: "ar" },
  {
    label: "MaximumFromDate",
    value: "La date maximale pour la date de début est",
    lang: "fr",
  },
  {
    label: "MinimumToDate",
    value: "Minimum date to From Date is 1985",
    lang: "en",
  },
  {
    label: "MinimumToDate",
    value: "الحد الأدنى لتاريخ الى تاريخ هو 1985",
    lang: "ar",
  },
  {
    label: "MinimumToDate",
    value: "La date minimale jusqu'à la date de début est 1985",
    lang: "fr",
  },
  { label: "MaximumToDate", value: "Maximum date To From Date is", lang: "en" },
  { label: "MaximumToDate", value: "أقصى تاريخ لـ الى تاريخ هو", lang: "ar" },
  {
    label: "MaximumToDate",
    value: "La date maximale jusqu'à la date de début est",
    lang: "fr",
  },
  {
    label: "SingleValidation",
    value: "Please select single band or multi band.",
    lang: "en",
  },
  {
    label: "SingleValidation",
    value: "الرجاء تحديد حزمة واحد أو حزمة متعدد.",
    lang: "ar",
  },
  {
    label: "SingleValidation",
    value: "Veuillez sélectionner une seule bande ou plusieurs bandes.",
    lang: "fr",
  },
  {
    label: "SelectPairing",
    value: "Please select paired or unpaired or paired + unpaired.",
    lang: "en",
  },
  {
    label: "SelectPairing",
    value: "الرجاء تحديد مزدوج أو منفردة أو مزدوج + منفردة.",
    lang: "ar",
  },
  {
    label: "SelectPairing",
    value: "Veuillez sélectionner jumelé ou non jumelé ou jumelé + non jumelé.",
    lang: "fr",
  },
  {
    label: "GDPValidation",
    value: "Min GDP must be less than max GDP.",
    lang: "en",
  },
  {
    label: "GDPValidation",
    value: "يجب أن يكون الحد الأدنى GDP أقل من الحد الأقصى GDP    ",
    lang: "ar",
  },
  {
    label: "GDPValidation",
    value: "Le GDP min doit être inférieur au GDP max    ",
    lang: "fr",
  },
  {
    label: "PleaseFillMissingFields",
    value: "Please fill missing fields in filtering section.",
    lang: "en",
  },
  {
    label: "PleaseFillMissingFields",
    value: "يرجى ملء الحقول المفقودة في قسم التصفية",
    lang: "ar",
  },
  {
    label: "PleaseFillMissingFields",
    value: "Veuillez remplir les champs manquants dans la section de filtrage",
    lang: "fr",
  },
  {
    label: "MinTermValue",
    value: "Minimum value of term must be greater than 0",
    lang: "en",
  },
  {
    label: "MinTermValue",
    value: "يجب أن يكون الحد الأدنى للمدة أكبر من 0",
    lang: "ar",
  },
  {
    label: "MinTermValue",
    value: "La valeur minimale du terme doit être supérieure à 0",
    lang: "fr",
  },
  { label: "MaxTermValue", value: "Maximum value for Term is 40", lang: "en" },
  {
    label: "MaxTermValue",
    value: "الحد الاقصى المدة المصطلح هو 40    ",
    lang: "ar",
  },
  {
    label: "MaxTermValue",
    value: "La valeur maximale pour Terme est 40",
    lang: "fr",
  },
  {
    label: "MinDiscountRate",
    value: "Minimum value for Discount Rate is 0",
    lang: "en",
  },
  {
    label: "MinDiscountRate",
    value: "الحد الأدنى لقيمة معدل الخصم هو 0",
    lang: "ar",
  },
  {
    label: "MinDiscountRate",
    value: "La valeur minimale pour le taux d'actualisation est 0",
    lang: "fr",
  },
  {
    label: "MaxDiscountRate",
    value: "Maximum value for Discount Rate is 100",
    lang: "en",
  },
  {
    label: "MaxDiscountRate",
    value: "الحد الاقصى لقيمة معدل الخصم هو 100",
    lang: "ar",
  },
  {
    label: "MaxDiscountRate",
    value: "La valeur maximale pour le taux de remise est 100",
    lang: "fr",
  },
  {
    label: "IssueDateValidation",
    value: "Issue Date must be > or = To Date",
    lang: "en",
  },
  {
    label: "IssueDateValidation",
    value: "يجب أن يكون تاريخ الإصدار> أو = تاريخ الى    ",
    lang: "ar",
  },
  {
    label: "IssueDateValidation",
    value: "La date d'émission doit être > ou = à ce jour",
    lang: "fr",
  },
  {
    label: "UpperPercentileMinValidation",
    value: "Minimum value for Upper percentile is 0.",
    lang: "en",
  },
  {
    label: "UpperPercentileMinValidation",
    value: "الحد الأدنى لقيمة النسبة المئوية العليا هو 0.",
    lang: "ar",
  },
  {
    label: "UpperPercentileMinValidation",
    value: "La valeur minimale pour le centile supérieur est 0.",
    lang: "fr",
  },
  {
    label: "UpperPercentileMaxValidation",
    value: "Maximum value for Upper percentile is 100.",
    lang: "en",
  },
  {
    label: "UpperPercentileMaxValidation",
    value: "الحد الأقصى لقيمة النسبة المئوية العليا هو 100.",
    lang: "ar",
  },
  {
    label: "UpperPercentileMaxValidation",
    value: "La valeur maximale pour le centile supérieur est 100.",
    lang: "fr",
  },
  {
    label: "LowerPercentileMinValidation",
    value: "Minimum value for Lower percentile is 0.",
    lang: "en",
  },
  {
    label: "LowerPercentileMinValidation",
    value: "الحد الأدنى لقيمة النسبة المئوية الأدنى هو 0.",
    lang: "ar",
  },
  {
    label: "LowerPercentileMinValidation",
    value: "La valeur minimale pour le centile inférieur est 0.",
    lang: "fr",
  },
  {
    label: "LowerPercentileMaxValidation",
    value: "Maximum value for Lower percentile is 100.",
    lang: "en",
  },
  {
    label: "LowerPercentileMaxValidation",
    value: "الحد الأقصى لقيمة النسبة المئوية الأدنى هو 100.",
    lang: "ar",
  },
  {
    label: "LowerPercentileMaxValidation",
    value: "La valeur maximale pour le centile inférieur est 100.",
    lang: "fr",
  },
  {
    label: "LowePerLessThan",
    value: "Lower percentile should be less than upper percentile.",
    lang: "en",
  },
  {
    label: "LowePerLessThan",
    value: "يجب أن تكون النسبة المئوية الأدنى أقل من النسبة المئوية العليا.",
    lang: "ar",
  },
  {
    label: "LowePerLessThan",
    value: "Le centile inférieur doit être inférieur au centile supérieur.",
    lang: "fr",
  },
  { label: "MinKValue", value: "Minimum value for  K value is 0", lang: "en" },
  { label: "MinKValue", value: "الحد الأدنى لقيمة K هو 0.", lang: "ar" },
  {
    label: "MinKValue",
    value: "La valeur minimale pour la valeur K est 0",
    lang: "fr",
  },
  { label: "MaxKValue", value: "Maximum value for K value is 3.", lang: "en" },
  { label: "MaxKValue", value: "الحد الاقصى لقيمة K هو 3", lang: "ar" },
  {
    label: "MaxKValue",
    value: "La valeur maximale pour la valeur K est 3.",
    lang: "fr",
  },
  {
    label: "MinSD",
    value: "Minimum value for Standard Deviation is 1",
    lang: "en",
  },
  {
    label: "MinSD",
    value: "الحد الأدنى لقيمة الانحراف المعياري هو 1",
    lang: "ar",
  },
  {
    label: "MinSD",
    value: "La valeur minimale pour l'écart type est 1",
    lang: "fr",
  },
  {
    label: "MaxSD",
    value: "Maximum value for Standard Deviation is 3",
    lang: "en",
  },
  {
    label: "MaxSD",
    value: "الحد الأقصى لقيمة الانحراف المعياري هو 3",
    lang: "ar",
  },
  {
    label: "MaxSD",
    value: "La valeur maximale de l'écart type est de 3",
    lang: "fr",
  },

  { label: "Min%", value: "Minimum value for % is 0", lang: "en" },
  { label: "Min%", value: "الحد الأدنى لقيمة٪ هو 0", lang: "ar" },
  { label: "Min%", value: "La valeur minimale pour % est 0", lang: "fr" },
  { label: "Max%", value: "Maximum value for % is 100", lang: "en" },
  { label: "Max%", value: "الحد الأقصى لقيمة٪ هو 100", lang: "ar" },
  { label: "Max%", value: "La valeur maximale pour % est 100", lang: "fr" },
  { label: "StrictMax%", value: "Maximum value for % is strictly less than 100", lang: "en" },
  { label: "StrictMax%", value: "الحد الأقصى لقيمة٪ أقل تمامًا من 100", lang: "ar" },
  { label: "StrictMax%", value: "La valeur maximale de % est strictement inférieure à 100", lang: "fr" },
  {
    label: "DistancingBandValidation",
    value:
      "You cannot choose more than one band for valuation by distance method",
    lang: "en",
  },
  {
    label: "DistancingBandValidation",
    value: "لا يمكنك اختيار أكثر من حزمة للتقييم بطريقة المسافة",
    lang: "ar",
  },
  {
    label: "DistancingBandValidation",
    value:
      "Vous ne pouvez pas choisir plus d'une bande pour l'évaluation par méthode de distance",
    lang: "fr",
  },

  { label: "NoDataToDisplay", value: "There's no data to display", lang: "en" },
  { label: "NoDataToDisplay", value: "لا توجد بيانات لعرضها", lang: "ar" },
  {
    label: "NoDataToDisplay",
    value: "Il n'y a pas de données à afficher",
    lang: "fr",
  },

  {
    label: "FeatureNotAvailable",
    value: "Feature not available, please upgrade your package",
    lang: "en",
  },
  {
    label: "FeatureNotAvailable",
    value: "الميزة غير متوفرة ، يرجى ترقية الحزمة الخاصة بك",
    lang: "ar",
  },
  {
    label: "FeatureNotAvailable",
    value:
      "Fonctionnalité non disponible, veuillez mettre à niveau votre forfait",
    lang: "fr",
  },

  { label: "RatioOfPrices", value: "Ratio of Prices", lang: "en" },
  { label: "RatioOfPrices", value: "نسب الأسعار", lang: "ar" },
  { label: "RatioOfPrices", value: "Rapport des prix", lang: "fr" },

  { label: "SelectAll", value: "Select All", lang: "en" },
  { label: "SelectAll", value: "اختر الكل", lang: "ar" },
  { label: "SelectAll", value: "Tout sélectionner", lang: "fr" },

  { label: "RequestADemo", value: "Request a Demo", lang: "en" },
  { label: "RequestADemo", value: "طلب عرض", lang: "ar" },
  { label: "RequestADemo", value: "Demander une démo", lang: "fr" },

  { label: "WatchVideo", value: "Watch Video", lang: "en" },
  { label: "WatchVideo", value: "مشاهدة الفيديو", lang: "ar" },
  { label: "WatchVideo", value: "Regarder la vidéo", lang: "fr" },

  { label: "Term2", value: "Term", lang: "en" },
  { label: "Term2", value: "المدة", lang: "ar" },
  { label: "Term2", value: "Durée", lang: "fr" },

  { label: "Glossary", value: "Glossary", lang: "en" },
  { label: "Glossary", value: "قائمة المصطلحات", lang: "ar" },
  { label: "Glossary", value: "Glossaire", lang: "fr" },

  { label: "Word", value: "Word", lang: "en" },
  { label: "Word", value: "الكلمة", lang: "ar" },
  { label: "Word", value: "Mot", lang: "fr" },
  { label: "Definition", value: "Definition", lang: "en" },
  { label: "Definition", value: "تعريف", lang: "ar" },
  { label: "Definition", value: "Définition", lang: "fr" },

  { label: "Help", value: "Help", lang: "en" },
  { label: "Help", value: "مساعدة", lang: "ar" },
  { label: "Help", value: "Aider", lang: "fr" },

  { label: "About", value: "About Spectre", lang: "en" },
  { label: "About", value: "عن سبكتر", lang: "ar" },
  { label: "About", value: "Sur Spectre", lang: "fr" },

  { label: "HelpUsing", value: "Help Using", lang: "en" },
  { label: "HelpUsing", value: "مساعدة في استخدام", lang: "ar" },
  { label: "HelpUsing", value: "Aide à l'utilisation", lang: "fr" },

  { label: "Notifications", value: "Notifications", lang: "en" },
  { label: "Notifications", value: "إشعارات", lang: "ar" },
  { label: "Notifications", value: "Avis", lang: "fr" },

  { label: "PriceVSGDPc", value: "Price vs GDPc", lang: "en" },
  { label: "PriceVSGDPc", value: "الاسعار مقابل GDPc", lang: "ar" },
  { label: "PriceVSGDPc", value: "Prix vs GDPc", lang: "fr" },

  { label: "LicenseStartDate", value: "License Start Date", lang: "en" },
  { label: "LicenseStartDate", value: "تاريخ بدء الترخيص", lang: "ar" },
  {
    label: "LicenseStartDate",
    value: "Date de début de la licence",
    lang: "fr",
  },

  { label: "LicenseEndDate", value: "License End Date", lang: "en" },
  { label: "LicenseEndDate", value: "تاريخ انتهاء الترخيص", lang: "ar" },
  { label: "LicenseEndDate", value: "Date de fin de licence", lang: "fr" },

  { label: "SUBSCRIBEDPACKAGE", value: "SUBSCRIBED PACKAGE", lang: "en" },
  { label: "SUBSCRIBEDPACKAGE", value: "حزمة الاشتراك", lang: "ar" },
  { label: "SUBSCRIBEDPACKAGE", value: "FORFAIT SOUSCRIPTION", lang: "fr" },

  { label: "Welcome", value: "Welcome", lang: "en" },
  { label: "Welcome", value: "أهلا بك", lang: "ar" },
  { label: "Welcome", value: "Bienvenue", lang: "fr" },

  { label: "Settings", value: "Settings", lang: "en" },
  { label: "Settings", value: "الإعدادات", lang: "ar" },
  { label: "Settings", value: "RÉGLAGES", lang: "fr" },

  {
    label: "SocioEconomicDataSource",
    value: "Socio-Economic Data Source",
    lang: "en",
  },
  {
    label: "SocioEconomicDataSource",
    value: "مصدر البيانات الاجتماعية والاقتصادية",
    lang: "ar",
  },
  {
    label: "SocioEconomicDataSource",
    value: "Source de données socio-économiques",
    lang: "fr",
  },

  { label: "IMFWord", value: "International Monitory Fund (IMF)", lang: "en" },
  { label: "IMFWord", value: "صندوق النقد الدولي (IMF)", lang: "ar" },
  {
    label: "IMFWord",
    value: "Fonds de surveillance international (FMI)",
    lang: "fr",
  },

  { label: "WBWord", value: "World Bank (WB)", lang: "en" },
  { label: "WBWord", value: "البنك الدولي (WB)", lang: "ar" },
  { label: "WBWord", value: "Banque mondiale (BM)", lang: "fr" },

  { label: "GDPUsed", value: "GDP Used", lang: "en" },
  { label: "GDPUsed", value: "GDP المستخدم", lang: "ar" },
  { label: "GDPUsed", value: "GDP utilisé", lang: "fr" },

  { label: "Nominal", value: "Nominal", lang: "en" },
  { label: "Nominal", value: "Nominal", lang: "ar" },
  { label: "Nominal", value: "Nominale", lang: "fr" },

  { label: "English", value: "English", lang: "en" },
  { label: "English", value: "إنجليزي", lang: "ar" },
  { label: "English", value: "Anglaise", lang: "fr" },

  { label: "Arabic", value: "Arabic", lang: "en" },
  { label: "Arabic", value: "عربي", lang: "ar" },
  { label: "Arabic", value: "Arabe", lang: "fr" },

  { label: "French", value: "French", lang: "en" },
  { label: "French", value: "الفرنسية", lang: "ar" },
  { label: "French", value: "Français", lang: "fr" },

  { label: "Awards", value: "Awards", lang: "en" },
  { label: "Awards", value: "التراخيص", lang: "ar" },
  { label: "Awards", value: "Attributions", lang: "fr" },

  { label: "Pricing", value: "Pricing", lang: "en" },
  { label: "Pricing", value: "تسعير الطيف", lang: "ar" },
  { label: "Pricing", value: "Prix", lang: "fr" },

  { label: "Valuation", value: "Valuation", lang: "en" },
  { label: "Valuation", value: "تقييم الترخيص", lang: "ar" },
  { label: "Valuation", value: "Valorisation", lang: "fr" },

  { label: "Benchmarks", value: "Benchmarks", lang: "en" },
  { label: "Benchmarks", value: "أسعار مرجعية", lang: "ar" },
  { label: "Benchmarks", value: "Références de prix", lang: "fr" },

  { label: "SocialData", value: "Social Data", lang: "en" },
  { label: "SocialData", value: "البيانات الاجتماعية والاقتصادية", lang: "ar" },
  { label: "SocialData", value: "Données sociales", lang: "fr" },
  { label: "Account", value: "Account", lang: "en" },
  { label: "Account", value: "الحساب", lang: "ar" },
  { label: "Account", value: "Compte", lang: "fr" },

  { label: "AboutUs", value: "About Us", lang: "en" },
  { label: "AboutUs", value: "في ما يخصنا", lang: "ar" },
  { label: "AboutUs", value: "À propos de nous", lang: "fr" },

  {
    label: "SpectreOffersFeatures",
    value: "Spectre offers a wide variety of features",
    lang: "en",
  },
  {
    label: "SpectreOffersFeatures",
    value: "يقدم Specter مجموعة متنوعة من الميزات",
    lang: "ar",
  },
  {
    label: "SpectreOffersFeatures",
    value: "Spectre offre une grande variété de fonctionnalités",
    lang: "fr",
  },

  { label: "ReadMore", value: "Read More", lang: "en" },
  { label: "ReadMore", value: "اقرأ أكثر", lang: "ar" },
  { label: "ReadMore", value: "Lire la suite", lang: "fr" },

  {
    label: "LinearRegressionResult",
    value: "Linear Regression Result",
    lang: "en",
  },
  {
    label: "LinearRegressionResult",
    value: "نتائج الانحدار الخطي",
    lang: "ar",
  },
  {
    label: "LinearRegressionResult",
    value: "Résultat de la Régression Linéaire",
    lang: "fr",
  },

  {
    label: "DistancingTitle",
    value: "Relative Prices using Valuation by Distance",
    lang: "en",
  },
  {
    label: "DistancingTitle",
    value: "الأسعار النسبية باستخدام التقييم بالمسافة",
    lang: "ar",
  },
  {
    label: "DistancingTitle",
    value: "Prix ​​relatifs à l'aide de l'évaluation par distance",
    lang: "fr",
  },

  { label: "PricePlotTitle", value: "Price benchmarks in", lang: "en" },
  { label: "PricePlotTitle", value: "معايير الأسعار في", lang: "ar" },
  { label: "PricePlotTitle", value: "Prix ​​de référence en", lang: "fr" },

  { label: "ForA", value: "for a ", lang: "en" },
  { label: "ForA", value: "ل", lang: "ar" },
  { label: "ForA", value: "pour une licence de ", lang: "fr" },

  {
    label: "PricePlotTitle2",
    value: "-year license at bands shown ",
    lang: "en",
  },
  { label: "PricePlotTitle2", value: "سنوات في الحزم الموضحة", lang: "ar" },
  {
    label: "PricePlotTitle2",
    value: " ans dans les bandes présentées",
    lang: "fr",
  },

  { label: "PricePlotTitle3", value: "", lang: "en" },
  { label: "PricePlotTitle3", value: "لترخيص مدته", lang: "ar" },
  { label: "PricePlotTitle3", value: "", lang: "fr" },

  {
    label: "YearPlotTitle",
    value: "Spectrum Price Trends by Year ",
    lang: "en",
  },
  {
    label: "YearPlotTitle",
    value: "اتجاهات أسعار الطيف بمرور السنة",
    lang: "ar",
  },
  {
    label: "YearPlotTitle",
    value: "Tendances des prix du spectre par année",
    lang: "fr",
  },

  {
    label: "LogPlotTitle",
    value: "Spectrum price trends in log-scale across IMT bands ",
    lang: "en",
  },
  {
    label: "LogPlotTitle",
    value:
      "اتجاهات أسعار الطيف في النطاق اللوغاريتمي عبر نطاقات الاتصالات المتنقلة الدولية",
    lang: "ar",
  },
  {
    label: "LogPlotTitle",
    value:
      "Tendances des prix du spectre à l'échelle logarithmique dans les bandes IMT",
    lang: "fr",
  },

  {
    label: "BandPlotTitle",
    value: "Spectrum price trends for IMT bands shown ",
    lang: "en",
  },
  {
    label: "BandPlotTitle",
    value:
      "اتجاهات أسعار الطيف الترددي لنطاقات الاتصالات المتنقلة الدولية",
    lang: "ar",
  },
  {
    label: "BandPlotTitle",
    value: "Tendances des prix du spectre pour les bandes IMT indiquées",
    lang: "fr",
  },

  {
    label: "CopyRight",
    value: `©${year} Developed by EICON LTD | All Rights Reserved`,
    lang: "en",
  },
  {
    label: "CopyRight",
    value: `تم تطويره من قبل شركة ايكون | جميع الحقوق محفوظة ${yearAr}©`,
    lang: "ar",
  },
  {
    label: "CopyRight",
    value: `©${year} Développé par EICON LTD | Tous Droits Réservés`,
    lang: "fr",
  },

  { label: "Year", value: "Year", lang: "en" },
  { label: "Year", value: "السنة", lang: "ar" },
  { label: "Year", value: "an", lang: "fr" },

  { label: "Language", value: "Language", lang: "en" },
  { label: "Language", value: "اللغة", lang: "ar" },
  { label: "Language", value: "Langue", lang: "fr" },

  { label: "Minimum", value: "Min", lang: "en" },
  { label: "Minimum", value: "الحد الأدنى", lang: "ar" },
  { label: "Minimum", value: "Min", lang: "fr" },

  { label: "Maximum", value: "Max", lang: "en" },
  { label: "Maximum", value: "الحد الأقصى", lang: "ar" },
  { label: "Maximum", value: "Max", lang: "fr" },

  {
    label: "MaximumBandsSelectedIs5",
    value: "The maximum allowed number of bands to select is 5",
    lang: "en",
  },
  {
    label: "MaximumBandsSelectedIs5",
    value: "العدد الأقصى المسموح للحزمات الّتي تمّ اختيارها هو 5",
    lang: "ar",
  },
  {
    label: "MaximumBandsSelectedIs5",
    value: "Le nombre maximum autorisées de bandes sélectionner est 5",
    lang: "fr",
  },

  { label: "Of", value: "of", lang: "en" },
  { label: "Of", value: "من", lang: "ar" },
  { label: "Of", value: "de", lang: "fr" },

  { label: "Refresh", value: "Refresh", lang: "en" },
  { label: "Refresh", value: "تحديث", lang: "ar" },
  { label: "Refresh", value: "rafraîchir", lang: "fr" },

  {
    label: "BenchmarksPlotTitle1",
    value: "Spectrum valuation of a license in",
    lang: "en",
  },
  {
    label: "BenchmarksPlotTitle1",
    value: "تقييم الطيف للترخيص في",
    lang: "ar",
  },
  {
    label: "BenchmarksPlotTitle1",
    value: "Valorisation du spectre d'une licence en",
    lang: "fr",
  },

  { label: "BenchmarksPlotTitle2", value: "using benchmarks", lang: "en" },
  { label: "BenchmarksPlotTitle2", value: "باستخدام المعايير", lang: "ar" },
  {
    label: "BenchmarksPlotTitle2",
    value: "en utilisant des Repères",
    lang: "fr",
  },

  {
    label: "RegressionPlotTitle1",
    value: "Spectrum valuation of a license in",
    lang: "en",
  },
  {
    label: "RegressionPlotTitle1",
    value: "تقييم الطيف للترخيص في",
    lang: "ar",
  },
  {
    label: "RegressionPlotTitle1",
    value: "Valorisation du spectre d'une licence en",
    lang: "fr",
  },

  { label: "RegressionPlotTitle2", value: "using Regression", lang: "en" },
  { label: "RegressionPlotTitle2", value: "باستخدام الانحدار", lang: "ar" },
  {
    label: "RegressionPlotTitle2",
    value: "en utilisant la Régression",
    lang: "fr",
  },

  {
    label: "DistancingPlotTitle1",
    value: "Spectrum valuation of a license in",
    lang: "en",
  },
  {
    label: "DistancingPlotTitle1",
    value: "تقييم الطيف للترخيص في",
    lang: "ar",
  },
  {
    label: "DistancingPlotTitle1",
    value: "Valorisation du spectre d'une licence en",
    lang: "fr",
  },

  { label: "DistancingPlotTitle2", value: "using Distance Method", lang: "en" },
  {
    label: "DistancingPlotTitle2",
    value: "باستخدام طريقة المسافة",
    lang: "ar",
  },
  {
    label: "DistancingPlotTitle2",
    value: "en utilisant la méthode de distance",
    lang: "fr",
  },

  { label: "Loading", value: "Loading", lang: "en" },
  { label: "Loading", value: "جار التحميل", lang: "ar" },
  { label: "Loading", value: "Chargement en cours", lang: "fr" },

  {
    label: "SpectreOffers",
    value: "Spectre offers a wide variety of features",
    lang: "en",
  },
  {
    label: "SpectreOffers",
    value: "يقدم Specter مجموعة متنوعة من الميزات",
    lang: "ar",
  },
  {
    label: "SpectreOffers",
    value: "Spectre offre une grande variété de fonctionnalités",
    lang: "fr",
  },
  { label: "ChartType", value: "Chart Type", lang: "en" },
  { label: "ChartType", value: "نوع الرسم البياني", lang: "ar" },
  { label: "ChartType", value: "Type de Graphique", lang: "fr" },

  { label: "Filtering", value: "Filtering", lang: "en" },
  { label: "Filtering", value: "الفلتره", lang: "ar" },
  { label: "Filtering", value: "filtration", lang: "fr" },

  { label: "FilterByIndicator", value: "Filter by Indicator", lang: "en" },
  { label: "FilterByIndicator", value: "فلترة حسب المؤشر", lang: "ar" },
  { label: "FilterByIndicator", value: "Filtrer par Indicateur", lang: "fr" },

  { label: "FilterByCountry", value: "Filter by Country", lang: "en" },
  { label: "FilterByCountry", value: "فلترة حسب البلد", lang: "ar" },
  { label: "FilterByCountry", value: "Filtrer par Pays", lang: "fr" },

  { label: "FilterByYear", value: "Filter by Year", lang: "en" },
  { label: "FilterByYear", value: "فلترة حسب السنة", lang: "ar" },
  { label: "FilterByYear", value: "Filtrer par Années", lang: "fr" },

  { label: "Indicator", value: "Indicator", lang: "en" },
  { label: "Indicator", value: "المؤشّر", lang: "ar" },
  { label: "Indicator", value: "Indicateur", lang: "fr" },

  { label: "Indicator", value: "Indicator", lang: "en" },
  { label: "Indicator", value: "المؤشّر", lang: "ar" },
  { label: "Indicator", value: "Indicateur", lang: "fr" },

  {
    label: "PopulationInMillions",
    value: "Population in Millinos",
    lang: "en",
  },
  { label: "PopulationInMillions", value: "تعداد السكّان", lang: "ar" },
  {
    label: "PopulationInMillions",
    value: "Population en Millions",
    lang: "fr",
  },

  { label: "RegressionLine", value: "Regression Line", lang: "en" },
  { label: "RegressionLine", value: "خط الانحدار", lang: "ar" },
  { label: "RegressionLine", value: "Ligne de régression", lang: "fr" },

  //Everything related to PDFs
  { label: "PDFTitle", value: "SPECTRUM PRICING", lang: "en" },
  { label: "PDFTitle", value: "تسعير الطيف الترددي", lang: "ar" },
  { label: "PDFTitle", value: "TARIFICATION DU SPECTRE", lang: "fr" },
  {
    label: "Abstract",
    value:
      "Abstract: This report was completed using SPECTRE, a software tool for spectrum pricing, to display awards and price/valuate spectrum",
    lang: "en",
  },
  {
    label: "Abstract",
    value:
      "الملخص: تم انجاز هذا التقرير باستخدام سبكتر ، وهي أداة برمجية لعرض التراخيص وتسعير الطيف الترددي وتقييمه ",
    lang: "ar",
  },
  {
    label: "Abstract",
    value:
      "Résumé: Ce rapport a été rédigé à l'aide de SPECTRE, un outil logiciel de tarification du spectre, pour afficher les attributions et évaluer le spectre",
    lang: "fr",
  },
  { label: "UserInformation", value: "USER INFORMATION", lang: "en" },
  { label: "UserInformation", value: "معلومات المستخدم", lang: "ar" },
  { label: "UserInformation", value: "INFORMATIONS UTILISATEUR", lang: "fr" },

  { label: "UserRunInformation", value: "USER & RUN INFORMATION", lang: "en" },
  {
    label: "UserRunInformation",
    value: "معلومات المستخدم والتشغيل",
    lang: "ar",
  },
  {
    label: "UserRunInformation",
    value: "INFORMATIONS UTILISATEUR ET D'EXÉCUTION",
    lang: "fr",
  },
  { label: "User", value: "User", lang: "en" },
  { label: "User", value: "المستخدم", lang: "ar" },
  { label: "User", value: "Utilisateur", lang: "fr" },
  { label: "Organisation", value: "Organisation", lang: "en" },
  { label: "Organisation", value: "الموسسة", lang: "ar" },
  { label: "Organisation", value: "Organisation", lang: "fr" },

  {
    label: "SelectedParameteres",
    value: "SELECTED PARAMETERS OF AWARDS",
    lang: "en",
  },
  {
    label: "SelectedParameteres",
    value: "المعايير المختارة للتراخيص",
    lang: "ar",
  },
  {
    label: "SelectedParameteres",
    value: "PARAMÈTRES SÉLECTIONNÉS DES ATTRIBUTIONS",
    lang: "fr",
  },

  {
    label: "AwardsWithPaired",
    value: "Awards with paired spectrum",
    lang: "en",
  },
  { label: "AwardsWithPaired", value: "التراخيص ذو الطيف المقترن", lang: "ar" },
  {
    label: "AwardsWithPaired",
    value: "Attributions avec spectre apparié",
    lang: "fr",
  },

  {
    label: "AwardsWithUnPaired",
    value: "Awards with unpaired spectrum",
    lang: "en",
  },
  {
    label: "AwardsWithUnPaired",
    value: "التراخيص ذو الطيف غير المقترن",
    lang: "ar",
  },
  {
    label: "AwardsWithUnPaired",
    value: "Attributions avec spectre non apparié",
    lang: "fr",
  },

  {
    label: "AwardsWithBoth",
    value: "Awards with paired + unpaired spectrum",
    lang: "en",
  },
  {
    label: "AwardsWithBoth",
    value: "التراخيص ذو الطيف المقترن + غير المقترن",
    lang: "ar",
  },
  {
    label: "AwardsWithBoth",
    value: "Attributions avec spectre apparié + non apparié",
    lang: "fr",
  },

  { label: "MinGDPUS$", value: "Minimum GDP, US$", lang: "en" },
  { label: "MinGDPUS$", value: "GDPc  الأقصى، بالدولار الاميركي", lang: "ar" },
  { label: "MinGDPUS$", value: "GDPc minimum, $ US", lang: "fr" },

  { label: "MaxGDPUS$", value: "Maximum GDP, US$", lang: "en" },
  { label: "MaxGDPUS$", value: "GDPc  الادنى بالدولار الاميركي", lang: "ar" },
  { label: "MaxGDPUS$", value: "GDPc maximum, $ US", lang: "fr" },

  { label: "ListOfAwards", value: "LIST OF AWARDS", lang: "en" },
  { label: "ListOfAwards", value: "قائمة التراخيص", lang: "ar" },
  { label: "ListOfAwards", value: "LISTE DES ATTRIBUTIONS", lang: "fr" },

  {
    label: "ListOfAwardsDescription",
    value:
      "The table below displays awards based on the parameters selected by User and presented above",
    lang: "en",
  },
  {
    label: "ListOfAwardsDescription",
    value:
      "يعرض الجدول أدناه للتراخيص المستندة إلى المعايير التي حددها المستخدم والمقدمة أعلاه",
    lang: "ar",
  },
  {
    label: "ListOfAwardsDescription",
    value:
      "Le tableau ci-dessous affiche les attributions en fonction des paramètres sélectionnés par l'utilisateur et présentés ci-dessus.",
    lang: "fr",
  },

  { label: "Included", value: "Included", lang: "en" },
  { label: "Included", value: "مدرج", lang: "ar" },
  { label: "Included", value: "inclus", lang: "fr" },

  { label: "NotIncluded", value: "Not Included", lang: "en" },
  { label: "NotIncluded", value: "غير مدرج", lang: "ar" },
  { label: "NotIncluded", value: "non inclus", lang: "fr" },

  { label: "Notes", value: "NOTES", lang: "en" },
  { label: "Notes", value: "الملاحظات", lang: "ar" },
  { label: "Notes", value: "REMARQUES", lang: "fr" },

  {
    label: "BandPairingNote",
    value:
      "“p”, “u”, “b” represents band pairing; p: paired, u: unpaired, and b: awards with both pair and unpaired spectrum",
    lang: "en",
  },
  {
    label: "BandPairingNote",
    value: ".“p” مقترن؛ “u” غير مقترن؛ “b” ٢. مقترن+ غير مقترن",
    lang: "ar",
  },
  {
    label: "BandPairingNote",
    value:
      "“p” , “u”, “b” représente l'appariement des bandes ; p : apparié, u : non apparié et b : attributions avec un spectre à la fois apparié et non apparié",
    lang: "fr",
  },

  {
    label: "CoverageNote",
    value: "Coverage indicates license coverage is ‘National’ or ‘Regional’.",
    lang: "en",
  },
  {
    label: "CoverageNote",
    value: "تشير التغطية إلى أن تغطية الترخيص وطنية أو إقليمية",
    lang: "ar",
  },
  {
    label: "CoverageNote",
    value:
      "La couverture indique que la couverture de la licence est « nationale » ou « régionale ».",
    lang: "fr",
  },

  {
    label: "PopulationNote",
    value:
      "Population indicates license population coverage, as on date of award, and represents population of country if national, or regions population coverage if regional license.",
    lang: "en",
  },
  {
    label: "PopulationNote",
    value:
      "يشير عدد السكان إلى التغطية السكانية للترخيص ، كما في تاريخ منحها ، ويمثل سكان البلد إذا كان على المستوى الوطني ، أو تغطية سكان المناطق إذا كان الترخيص الإقليمي",
    lang: "ar",
  },
  {
    label: "PopulationNote",
    value:
      "La population indique la couverture de la population de la licence, à la date d'attribution, et représente la population du pays si elle est nationale, ou la population des régions si la licence est régionale.",
    lang: "fr",
  },

  {
    label: "GDPNoteP1",
    value: "GDPc(Gross Domestic Product per capita) of country",
    lang: "en",
  },
  {
    label: "GDPNoteP1",
    value: "(GDPc) ١. الناتج المحلي الإجمالي الاسمي للفرد الواحد",
    lang: "ar",
  },
  {
    label: "GDPPricingNoteP1",
    value: "(GDPc) ٣. الناتج المحلي الإجمالي الاسمي للفرد الواحد",
    lang: "ar",
  },
  {
    label: "GDPNoteP1",
    value: "GDPc (Produit intérieur brut par habitant) du pays ",
    lang: "fr",
  },

  {
    label: "GDPNoteP2",
    value: "as selected by user and is shown as on date of award.",
    lang: "en",
  },
  {
    label: "GDPNoteP2",
    value: ".كما هو محدد من قبل المستخدم ويتم عرضه في تاريخ الترخيص",
    lang: "ar",
  },
  {
    label: "GDPNoteP2",
    value:
      "tel que sélectionné par l'utilisateur et indiqué à la date d'attribution.",
    lang: "fr",
  },

  {
    label: "SocialNote",
    value: "All socio-economic data in table are from retrieved from ",
    lang: "en",
  },
  {
    label: "SocialNote",
    value: "جميع البيانات الاجتماعية والاقتصادية الواردة في الجدول مأخوذة من ",
    lang: "ar",
  },
  {
    label: "SocialNote",
    value:
      "Toutes les données socio-économiques du tableau proviennent du formulaire ",
    lang: "fr",
  },

  {
    label: "LastPageNote",
    value:
      "Tools for spectrum benchmarking calculations, together with a complete database of spectrum awards across all IMT bands developed by EICON SAL",
    lang: "en",
  },
  {
    label: "LastPageNote",
    value:
      "أدوات لاحتساب اسعار الطيف وتقييمه ، جنبًا إلى جنب مع قاعدة بيانات كاملة لتراخيص الطيف عبر جميع نطاقات الاتصالات المتنقلة الدولية التي طورتها شركة ايكون",
    lang: "ar",
  },
  {
    label: "LastPageNote",
    value:
      "Outils pour les calculs d'analyse comparative du spectre, ainsi qu'une base de données complète des attributions de spectre dans toutes les bandes IMT développées par EICON SAL",
    lang: "fr",
  },

  { label: "Parameter", value: "PARAMETER", lang: "en" },
  { label: "Parameter", value: "المعايير", lang: "ar" },
  { label: "Parameter", value: "PARAMÈTRES", lang: "fr" },

  { label: "UserSelection", value: "USER SELECTION", lang: "en" },
  { label: "UserSelection", value: "اختيار المستخدم", lang: "ar" },
  { label: "UserSelection", value: "SÉLECTION UTILISATEUR", lang: "fr" },

  { label: "Notes", value: "NOTES", lang: "en" },
  { label: "Notes", value: "الملاحظات", lang: "ar" },
  { label: "Notes", value: "REMARQUES", lang: "fr" },

  { label: "SelectedAdjustments", value: "SELECTED ADJUSTMENTS", lang: "en" },
  { label: "SelectedAdjustments", value: "التعديلات المختارة", lang: "ar" },
  {
    label: "SelectedAdjustments",
    value: "AJUSTEMENTS SÉLECTIONNÉS",
    lang: "fr",
  },

  { label: "Adjustment", value: "Adjustment", lang: "en" },
  { label: "Adjustment", value: "التعديل", lang: "ar" },
  { label: "Adjustment", value: "ADJUSTEMENTS", lang: "fr" },

  {
    label: "SelParametersForAna",
    value: "SELECTED PARAMETERS FOR ANALYSIS",
    lang: "en",
  },
  {
    label: "SelParametersForAna",
    value: "المعايير المختارة للتحليل",
    lang: "ar",
  },
  {
    label: "SelParametersForAna",
    value: "PARAMÈTRES SÉLECTIONNÉS POUR L'ANALYSE",
    lang: "fr",
  },

  { label: "AnalysisOptions", value: "Analysis Options", lang: "en" },
  { label: "AnalysisOptions", value: "خيارات التحليل", lang: "ar" },
  { label: "AnalysisOptions", value: "Options d'analyse", lang: "fr" },

  {
    label: "SpectreAnalysisResult",
    value: "SPECTRE ANALYSIS RESULTS",
    lang: "en",
  },
  { label: "SpectreAnalysisResult", value: "نتائج تحليل الطيف", lang: "ar" },
  {
    label: "SpectreAnalysisResult",
    value: "LISTE DES ATTRIBUTIONS",
    lang: "fr",
  },

  {
    label: "PricingResultDescP1",
    value:
      "The results below display spectrum pricing benchmarks and based on the parameters selected by user and listed above.\nPrices are adjusted for license duration, based on a common term of ",
    lang: "en",
  },
  {
    label: "PricingResultDescP1",
    value:
      "تعرض النتائج أدناه معايير تسعير الطيف واستنادًا إلى المعلمات المحددة من قبل المستخدم والمدرجة أعلاه\n يتم تعديل الأسعار وفقًا لمدة الترخيص ، بناءً على مدة مشتركة تبلغ ",
    lang: "ar",
  },
  {
    label: "PricingResultDescP1",
    value:
      "Les résultats ci-dessous affichent des références de tarification du spectre et sont basés sur les paramètres sélectionnés \npar l'utilisateur et répertoriés ci-dessus. Les prix sont ajustés en fonction de la durée de la licence, sur la base \nd'une durée commune de ",
    lang: "fr",
  },

  { label: "PricingResultDescP2", value: "years using a ", lang: "en" },
  {
    label: "PricingResultDescP2",
    value: "أعوام باستخدام معدل خصم ",
    lang: "ar",
  },
  {
    label: "PricingResultDescP2",
    value: "ans en utilisant un taux d'actualisation de ",
    lang: "fr",
  },

  {
    label: "PricingResultDescP3",
    value: "% discount rate, along with other adjustments mentioned above.",
    lang: "en",
  },
  {
    label: "PricingResultDescP3",
    value: "٪ ، جنبًا إلى جنب مع التعديلات الأخرى المذكورة أعلاه",
    lang: "ar",
  },
  {
    label: "PricingResultDescP3",
    value: "%, ainsi que d'autres ajustements mentionnés ci-dessus.",
    lang: "fr",
  },

  {
    label: "GraphicalPresentation",
    value: "GRAPHICAL PRESENTATION OF RESULTS",
    lang: "en",
  },
  {
    label: "GraphicalPresentation",
    value: "عرض النتائج في رسومات بيانية",
    lang: "ar",
  },
  {
    label: "GraphicalPresentation",
    value: "PRESENTATION GRAPHIQUE DES RESULTATS",
    lang: "fr",
  },

  {
    label: "PricingGraphPresDesc",
    value:
      "Plot of relative prices in valuated country based on price benchmarks.Prices are shown as per parameters selected by user: term, license issue date, and with adjustments as specified.",
    lang: "en",
  },
  {
    label: "PricingGraphPresDesc",
    value:
      "مخطط الأسعار النسبية في البلد الذي تم تقييمه بناءً على معايير الأسعار. يتم عرض الأسعار وفقًا للمعايير التي حددها المستخدم: المدة، وتاريخ إصدار الترخيص، ومع التعديلات كما هو محدد.",
    lang: "ar",
  },
  {
    label: "PricingGraphPresDesc",
    value:
      "Graphique des prix relatifs dans le pays évalué sur la base de références de prix. Les prix sont affichés selon les paramètres sélectionnés par l'utilisateur : durée, date de délivrance de la licence et avec les ajustements spécifiés.",
    lang: "fr",
  },

  {
    label: "PricingGraphPresDesc1",
    value:
      "Benchmark bar-chart presentation of unit prices (vertical scale), against ‘Country-band (year)’.",
    lang: "en",
  },
  {
    label: "PricingGraphPresDesc1",
    value:
      ".(عرض رسم بياني عامودي معياري لأسعار الوحدات )مقياس عمودي(، مقابل النطاق-البلد )السنة",
    lang: "ar",
  },
  {
    label: "PricingGraphPresDesc1",
    value:
      "Présentation graphique à barres de référence des prix unitaires (échelle verticale), par rapport à la « bande de pays (année) ».",
    lang: "fr",
  },

  {
    label: "TrendsGraphTitle",
    value:
      "Scatter plot presentation of unit prices (vertical scale), against year or band.",
    lang: "en",
  },
  {
    label: "TrendsGraphTitle",
    value:
      "عرض مخطط مبعثر لأسعار الوحدات (مقياس رأسي)، مقابل السنة أو النطاق.",
    lang: "ar",
  },
  {
    label: "TrendsGraphTitle",
    value:
      "Présentation en nuage de points des prix unitaires (échelle verticale), par année ou par tranche.",
    lang: "fr",
  },

  {
    label: "TrendsGraphTitle2",
    value:
      "Prices are shown as per parameters selected by user: term, license issue date, and with adjustments as specified.",
    lang: "en",
  },
  {
    label: "TrendsGraphTitle2",
    value:
      "يتم عرض الأسعار وفقًا للمعايير التي حددها المستخدم: المدة وتاريخ إصدار الترخيص ومع التعديلات المحددة.",
    lang: "ar",
  },
  {
    label: "TrendsGraphTitle2",
    value:
      "Les prix sont affichés selon les paramètres sélectionnés par l'utilisateur : durée, date d'émission de la licence et avec les ajustements spécifiés.",
    lang: "fr",
  },

  {
    label: "PricingGraphPresDesc2",
    value:
      "Prices are shown as per parameters selected by user: term, license issue date, and with adjustments as specified.",
    lang: "en",
  },
  {
    label: "PricingGraphPresDesc2",
    value:
      ".يتم عرض الأسعار وفقًا للمعلمات التي حددها المستخدم المدة وتاريخ إصدار الترخيص والتعديلات على النحو المحدد",
    lang: "ar",
  },
  {
    label: "PricingGraphPresDesc2",
    value:
      "Les prix sont affichés selon les paramètres sélectionnés par l'utilisateur : durée, date d'émission de la l’attribution et avec les ajustements spécifiés.",
    lang: "fr",
  },

  {
    label: "PricingGraphPresDesc3",
    value:
      "",
    lang: "en",
  },
  {
    label: "PricingGraphPresDesc3",
    value:
    ".تظهر أسعار الوحدات بالدولار الأمريكي / ميجاهرتز / تغطية السكان حسب الترخيص في تاريخ منحها",
    lang: "ar",
  },
  {
    label: "PricingGraphPresDesc3",
    value:
      "",
    lang: "fr",
  },

  {
    label: "NormalizeNote1",
    value:
      "When unit prices are shown as “$/M/P/G”:",
    lang: "en",
  },
  {
    label: "NormalizeNote1",
    value: ":M/P/G/$ ١. عندما يتم عرض أسعار الوحدة على أنها",
    lang: "ar",
  },
  {
    label: "NormalizeNote1",
    value:
      "Lorsque les prix unitaires sous la forme « $/M/P/G »:",
    lang: "fr",
  },
  {
    label: "NormalizeNote2",
    value:
      "this is based on user selection to normalize by GDP; in which case GDP nominal or GDP-PPP is used for normalization",
    lang: "en",
  },
  {
    label: "NormalizeNote2",
    value:
      "فهذا يعتمد على اختيار المستخدم لتعديل الاسعار حسب الناتج المحلي الإجمالي ؛ في هذه الحالة يتم استخدام الناتج المحلي الإجمالي الاسمي أو الناتج المحلي الإجمالي - تعادل القوة الشرائية للتطبيع",
    lang: "ar",
  },
  {
    label: "NormalizeNote2",
    value:
      "cela est basé sur la sélection de l'utilisateur pour normaliser par le GDPc ; auquel cas le nominal ou le PPA est utilisé pour la normalisation",
    lang: "fr",
  },

  {
    label: "AnnualizeNote1",
    value:
      "When unit prices are shown as “$/M/P/year”:",
    lang: "en",
  },
  {
    label: "AnnualizeNote1",
    value:
      ":M/P/Y/$ ٢. عندما يتم عرض أسعار الوحدة على أنها",
    lang: "ar",
  },
  {
    label: "AnnualizeNote1",
    value:
      "Lorsque les prix unitaires sous la forme « $/M/P/Y »:",
    lang: "fr",
  },

  {
    label: "AnnualizeNote2",
    value:
      "this is based on user selection to annualize prices; in which prices are presented as annual payments over the period of licenses.",
    lang: "en",
  },
  {
    label: "AnnualizeNote2",
    value:
      ".فهذا يعتمد على اختيار المستخدم لتقدير الأسعار على أساس سنوي ؛ حيث يتم عرض الأسعار كمدفوعات سنوية على مدى فترة الترخيص",
    lang: "ar",
  },
  {
    label: "AnnualizeNote2",
    value:
      "cela est basé sur la sélection de l'utilisateur pour annualiser les prix ; dans laquelle les prix sont présentés sous forme de paiements annuels sur la période des licences.",
    lang: "fr",
  },

  {
    label: "BlockMHzParam",
    value: "Block MHz considered in paired + unpaired Awards",
    lang: "en",
  },
  {
    label: "BlockMHzParam",
    value: "التراخيص  في نفس المزاد تعرض كج",
    lang: "ar",
  },
  {
    label: "BlockMHzParam",
    value: "MHz considéré en attributions appariées + non appariées",
    lang: "fr",
  },

  {
    label: "AwardsTypsPa",
    value: "Awards within same auction are",
    lang: "en",
  },
  {
    label: "AwardsTypsPa",
    value: "في التراخيص المقترنة + غير المقترنة،  يستخدم الجزء",
    lang: "ar",
  },
  {
    label: "AwardsTypsPa",
    value: "Les attributions au sein d'une même enchère sont	Moyenne",
    lang: "fr",
  },

  { label: "CaseUnderValuation", value: "CASE UNDER VALUATION", lang: "en" },
  { label: "CaseUnderValuation", value: "الترخيص قيد التقييم", lang: "ar" },
  { label: "CaseUnderValuation", value: "CAS SOUS EVALUATION", lang: "fr" },

  { label: "CountryOfValuation", value: "Country of valuation", lang: "en" },
  { label: "CountryOfValuation", value: "بلد التقييم", lang: "ar" },
  { label: "CountryOfValuation", value: "Pays d'évaluation", lang: "fr" },

  { label: "ValuationCaseResult", value: "VALUATION CASE RESULTS", lang: "en" },
  { label: "CountryOfValuation", value: "نتائج تقييم الترخيص", lang: "ar" },
  {
    label: "CountryOfValuation",
    value: "RÉSULTATS DU CAS D'ÉVALUATION",
    lang: "fr",
  },

  { label: "PriceDesc", value: "Prices are unit prices in", lang: "en" },
  {
    label: "PriceDesc",
    value: "الأسعار هي أسعار الوحدات  $/MHz/pop",
    lang: "ar",
  },
  {
    label: "PriceDesc",
    value: "Les prix sont des prix unitaires en $/MHz/pop",
    lang: "fr",
  },

  { label: "FAQ", value: "FAQ", lang: "en" },
  { label: "FAQ", value: " أسئلة شائعة", lang: "ar" },
  { label: "FAQ", value: "FAQ", lang: "fr" },

  {
    label: "UpperLowerPercentileEmpty",
    value: "Upper and lower percentiles can't be empty",
    lang: "en",
  },
  {
    label: "UpperLowerPercentileEmpty",
    value: "لا يمكن أن تكون النسب المئوية العليا والسفلى فارغة",
    lang: "ar",
  },
  {
    label: "UpperLowerPercentileEmpty",
    value: "Les centiles supérieur et inférieur ne peuvent pas être vides",
    lang: "fr",
  },

  { label: "KValueEmpty", value: "K value can't be empty", lang: "en" },
  { label: "KValueEmpty", value: "لا يمكن أن تكون قيمة K فارغة", lang: "ar" },
  { label: "KValueEmpty", value: "K value ne peut pas être vide", lang: "fr" },

  {
    label: "SDValueEmpty",
    value: "Standard Deviation value can't be empty",
    lang: "en",
  },
  {
    label: "SDValueEmpty",
    value: "لا يمكن أن تكون قيمة الإنحراف المعياري فارغة",
    lang: "ar",
  },
  {
    label: "SDValueEmpty",
    value: "La valeur de l'écart type ne peut pas être vide",
    lang: "fr",
  },

  {
    label: "RegressionValueEmpty",
    value: "Regression value can't be empty",
    lang: "en",
  },
  {
    label: "RegressionValueEmpty",
    value: "لا يمكن أن تكون قيمة الإنحدار فارغة",
    lang: "ar",
  },
  {
    label: "RegressionValueEmpty",
    value: "La valeur de régression ne peut pas être vide",
    lang: "fr",
  },

  { label: "SourceIndicator", value: "Source Indicator", lang: "en" },
  {
    label: "SourceIndicator",
    value: "مؤشر المصدر",
    lang: "ar",
  },
  {
    label: "SourceIndicator",
    value: "Indicateur de source",
    lang: "fr",
  },
  {
    label: "PriceVSGDPcTitle",
    value: "Price Benchmarks /Band/ GDPc",
    lang: "en",
  },
  {
    label: "PriceVSGDPcTitle",
    value: "Prix Références /Bande/ GDPc",
    lang: "fr",
  },
  {
    label: "PriceVSGDPcTitle",
    value: "أسعار مرجعية /حزمة/ GDPc",
    lang: "ar",
  },
  {
    label: "DistanceOutliersError",
    value: "Exclude Outliers is not performed in Valuation / Distance. The only selection can be done manually once the results appear.",
    lang: "en",
  },
  {
    label: "DistanceOutliersError",
    value: "Exclude Outliers is not performed in Valuation / Distance. The only selection can be done manually once the results appear.",
    lang: "fr",
  },
  {
    label: "DistanceOutliersError",
    value: "لا يتم استبعاد القيم المتطرفة في التقييم/المسافة. يمكن إجراء الاختيار يدويًا بمجرد ظهور النتائج",
    lang: "ar",
  }
];

export const getValue = (label, lang) => {
  var item = values.filter((item) => item.label == label && item.lang == lang);
  if (item.length > 0) return item[0].value;
  return label;
};
