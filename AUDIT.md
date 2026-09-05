# Kaynak ve Sistem Denetimi

İnceleme: 05.09.2026. Araç referansı: **Togg T10F V2 RWD Uzun Menzil**, Türkiye pazarı, 15.06.2026 tarihli [resmî katalog](https://trumore-cdn.togg.cloud/ToggT10FKatalog.pdf). Gerçek OEM yazılım sürümü ve model yılı doğrulanmadı.

## Sonuç

Katalogdaki seçili varyant verileri kontrol edildi. Uygulamanın 47 düğümü, 11 sistem grubunda kapsam tablosuna alındı. Bu, gerçek araçtaki bütün sistemlerin modellenmiş veya doğrulanmış olduğu anlamına gelmez. OEM iç mimarisi, donanım ölçümleri ve tip onayı dosyası mevcut değil.

Makine tarafından okunabilir denetim: `src/audit.js`. Uygulama: Kaynaklar & kapsam > Denetim kaydı. JSON deney raporu kaynak URL'lerini, inceleme tarihini, düzeltmeleri, sistem kapsamlarını ve deney parametrelerini birlikte içerir.

## Düzeltilen Bulgular

- OBC 11 kW seçili katalog verisidir; tasarım varsayımı etiketi kaldırıldı. 89,6 kWh brüt kapasite, bilinmeyen net kapasiteden ayrı tutuldu.
- R100 metnindeki Supplement 3 ifadesi Ek 3 olarak yanlış çevrilmişti; düzeltildi.
- R21 ve R158 bağlantıları okunabilir EUR-Lex metinlerine taşındı. R21 için 2008 temel metni incelendi; 2025 değişiklik dosyasının tam metnine erişilemedi. Güncel seri uygunluğu doğrulanmadı.
- TI kaynağı okunabilir TIDUF73 pasif ön şarj PDF'iyle değiştirildi. NXP arşivindeki ASIL belgesinin yazarı ZVEI, tarihi 2012 olarak düzeltildi.
- Silecek komutu ile yıkama/buğu çözme performansı ayrıldı. 2021/535 Ek IV ve VI doğrudan kaynak olarak eklendi.
- Görsel aktarımın minimum 450 ms olduğu iddiası kaldırıldı: 2× hedefi 425 ms.
- Düşük SOC deşarj sınırı şarj sınırından ayrıldı; integratörde tork ve pozitif güç sınırları uygulandı.
- Şarj portu resmî dış görsel referansına göre sol öne taşındı; tesisat güzergahı hâlâ varsayım.
- Deneydeki OTA sürümlerinin Togg yazılım sürümü olmadığı belirtildi.

## Açık Kanıt Eksikleri

- Ağ: gerçek DBC/ARXML, pinout, terminasyon, kablo kesiti, sigorta kalibrasyonu, zamanlama ve EMC ölçümü yok.
- Enerji: hücre ve motor haritaları, net kapasite, CC/CV eğrisi, gerçek izolasyon ve kontaktör arızası testleri yok.
- Konfor: yalnız sol ön camın hareketi ve tek kabin soğutması modelleniyor; diğer camlar ağ düğümü. Sıkışma kuvveti, çift bölge, ısıtma ve buğu çözme doğrulanmadı.
- Bağlantı: gerçek LTE/IMS/GNSS, eCall MSD, manuel SOS, kriptografi ve şebeke testi yok. A²B ve VHAL kaynakları Togg kullanımının kanıtı değil.
- Şasi ve HMI: fiziksel fren/direksiyon, ADAS, çarpışma, fotometri ve R121 ergonomi doğrulaması yok. Kokpit fotoğraf referanslı prototip, OEM yazılımı değil.

## Mevzuat Sınırı

2019/2144 için 02.08.2026 konsolide metin; eCall için 2025/1871'in 2026/2027 geçiş hükümleri incelendi. Her kaynağın sürümü ve kapsamı `src/references.js` içinde belirtilir. Eski tarihli R21/R121 temel metinleri en son seri olarak sunulmaz. CharIN dizini normatif standartların tam metninin yerine geçmez. Bu çalışma eksiksiz homologasyon kontrol listesi veya hukuki uygunluk görüşü değildir.
