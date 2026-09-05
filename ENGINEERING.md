# Togg T10F Referansı: Mimari ve Kanıt Sınırı

İnceleme tarihi: 2026-09-05. Hedef varsayımı: AB pazarı, M1 binek, BEV, arkadan itiş.

## Gerçek dayanak ile tasarım kararının ayrımı

Kaynak kataloğu ve gereksinim matrisi uygulamanın `Kaynaklar & kapsam` görünümündedir. Kaynaklar `src/references.js`, seçili araç verileri `src/vehicle-profile.js` içinde; JSON deney raporu bu kataloğu, parametreleri, başlangıç/son durumunu, kesik hatları, kapalı düğümleri ve zaman damgalı olayları birlikte içerir.

1. Mevzuat: ilgili düzenlemenin konusu ve incelenen maddeler kaynak bağlantısıyla belirtilir.
2. Teknik kaynak: üreticilerin mimari örnekleri, AOSP arayüzleri, TI ön şarj devresi ve CharIN CCS kaynakları.
3. Tasarım varsayımı: seçilmiş model için konum, güç, ağ hızı, kontrol politikası, zaman aşımı ve sayısal model parametreleri.
4. Eksik kanıt: test laboratuvarı, gerçek donanım, ölçüm, risk analizi veya tip onayı gerektiren işler.

R100 için incelenen OJ metni 03 serisi Supplement 3 metnidir; bunun bütün yeni araç projelerine otomatik olarak uygulanacak en son seri olduğu iddia edilmez. AB atıfları, değişiklik serileri ve geçiş hükümleri araç onay tarihine göre incelenmelidir. Düzenleme teklifleri yürürlükteki gereklilik gibi kullanılmaz.

## Seçili Üretim Aracı

Referans: **Togg T10F V2 RWD Uzun Menzil**, Türkiye, 15.06.2026 tarihli [resmî katalog](https://trumore-cdn.togg.cloud/ToggT10FKatalog.pdf), s.6,14,20,24–25. Bu seçim AB tip onayı verisi olduğu anlamına gelmez.

Üreticinin brüt kapasitesi 89,6 kWh; net kullanılabilir kapasite bu kaynakta yoktur. SOC integratörü brüt kapasiteyi vekil olarak kullanır; gerçek BMS SOC hesabı değildir. 610 km WLTP, 8,0 saniye hızlanma ve 26,5 dakika şarj değerleri sadece katalog referansıdır, modelin ürettiği veya doğruladığı sonuçlar değildir.

3D gövde katalog boyutlarıyla çizilmiş yaklaşık fastback yüzeyidir. Panel eğrileri, jantlar, farlar ve detaylar üretim CAD hassasiyetinde değildir. Fırça düğmesi dış yüzey ile iç mimariyi değiştirir. Ekranların 12,3 / 29 / 8 inç referansı katalogdan gelir; HMI grafikleri T10F fotoğraflarından yeniden çizilmiştir, Trumore yazılımı değildir. Fotoğrafta görünmeyen alt menüler birebir OEM arayüzü diye sunulmaz. Görsel kaynak kaydı `public/assets/SOURCES.md` içindedir.

**Aşağıdaki E/E mimarisi Togg mimarisi olarak sunulmaz.** ECU yerleşimi, kablo güzergahları, nominal 400 V, ağ hızları, yazılım katmanları, ön şarj ve güvenlik eşikleri model tercihleridir.

## Mimari

- IVI ile sürücü göstergesi ayrı ağ uçlarıdır. IVI arızası göstergeyi doğrudan kapatmaz.
- Gateway/switch ile VCU ayrı bileşenlerdir. Dört bölge kontrolcüsü Ethernet omurgasına bağlanır.
- Güç aktarma ve şasi CAN-FD alanları iki ayrı paylaşılan bus olarak modellenir. Bus düğümleri ECU değildir. Görsel dallar fiziksel pin/terminasyon şeması değildir.
- Cam düğümü LIN mesajı alır; ayrı LV dalından beslenir. Bu mimaride sıkışma kararı yerel motor düğümünde alınır. Bu, tüm üreticiler için zorunlu dağılım değildir.
- Hücre sensörü, IMD, BMS, kontaktör kumandası, HV besleme ve 12 V besleme ayrı bağlantılardır.
- AC: EVSE → port → OBC → REESS. DC: EVSE → port → ayrı DC kontaktörleri → REESS.
- Telefon/Bluetooth ile LTE/TCU birbirinin yerine geçmez. OEM bulut hizmeti ile 112 PSAP ayrıdır.
- eCall tetik ve ses yolu IVI’den bağımsızdır. Yedek besleme bu tasarımın tercihidir. Gerçek RF, IMS, TLS, imza doğrulama veya 112 çağrısı çalışmaz.
- Dijital A²B bağlantısı IVI → amfi; amfi → pasif hoparlör hattı analog güçlendirilmiş sestir.

## Senaryo motoru

`src/simulation.js` deterministik olay sırası işletir. Her mesajın kaynak, hedef, taşıma türü ve rota bağlantısı vardır. Bir mesaj yalnızca mevcut ve beslenen bağlantılardan geçebilir. Yanıt gelmezse sonraki adımlar çalışmaz. Olay kaydı başarı sonucunu önceden yazılmış metinden almaz.

Camın gerçek konumu ile HMI’nin en son aldığı konum ayrıdır. Motor komutu ulaştıktan sonra LIN kesilirse yerel hareket sürebilir, fakat geri bildirim ulaşmaz. Komut ulaşmadan hat veya güç dalı kesilirse motor başlamaz. Gösterge değerleri de yalnızca göstergeye teslim edilmiş mesajlarda güncellenir.

Model genel amaçlı CAN/LIN protokol emülatörü değildir. CAN arbitrasyonu, bit-stuffing, hata sayaçları, bus-off, LIN checksum ve schedule table, SOME/IP kodlaması ve gerçek güvenlik protokolleri uygulanmaz. Ekrandaki sinyaller örnek uygulama sinyalleridir, bir OEM DBC/ARXML dosyasından türetilmemiştir. “TX/RX” modelin mantıksal aktarımıdır.

## Zaman ve fizik

- Mesajların sanal gecikmeleri modele atanır: Ethernet 2 ms, CAN 4 ms, LIN 20 ms, yerel I/O 1 ms; diğer taşımalarda kodda belirtilen süreler. Bunlar laboratuvar ölçümü değildir. Görsel oynatma bir aktarımı varsayılan 850 ms aralıkla gösterir.
- Ön şarj: `Vbus = Vpack - (Vpack - Vbus0) exp(-t/RC)`. R=100 Ω, C=2 mF, nominal V=400 V; kapatma eşiği %95 ve timeout 1500 ms model tercihleridir.
- Enerji: `dE = P dt`, `dSOC = -100 × dE(kWh) / 89,6 kWh`. Güç, batarya tarafında pozitif deşarj / negatif şarj yönündedir.
- AC 11 kW girişte %95 örnek dönüşüm verimiyle 10,45 kW batarya gücü; DC için katalog azami 180 kW sınırı kullanılır; sabit güç varsayımı OEM şarj eğrisi değildir. Hücre gerilimine bağlı CC/CV eğrisi yoktur.
- Boylamsal hareket: sabit seçilmiş dişli oranı 9, tekerlek yarıçapı 0,32 m, 2195 kg kütle (sürücü hariç katalog alt sınırı), CdA=0,588 m² (katalog Cd=0,24 × varsayılan ön alan 2,45 m²), yuvarlanma katsayısı 0,012. `F=m a`, sürükleme ve yuvarlanma direnci ile hesaplanır. Çekiş limiti, lastik modeli, süspansiyon veya hidrolik fren çözücüsü değildir.
- Kabin ve batarya sıcaklıkları yığılmış ısı modeliyle ilerler. Isı kapasiteleri ve transfer katsayıları ölçülmemiş model parametreleridir. Sayısal entegrasyon adımı en fazla 20 ms’dir.
- Cam konumu 0=kapalı, 1=açık. Tam seyir 3 saniye; engel senaryosunda 0,45 konumunda yerel geri açma, 0,90 hedefi seçilmiştir. Fiziksel kuvvet testi değildir.
- SOC %5, %20, %95; sıcaklık 50/55 °C; tork watchdog 100 ms gibi eşikler projenin örnek politikalarıdır, AB mevzuatına atfedilemez.
- Pozitif mekanik güç 160 kW ve motor torku 350 Nm katalog azamileriyle sınırlanır; bunlar gerçek motor haritası yerine geçmez. Düşük SOC deneyinde örnek 15 kW deşarj ve 30 Nm tork sınırı uygulanır. Deşarj sınırı şarj sınırından bağımsızdır.
- Görsel hedef süre `850 / oynatma hızı` ms: 2× için 425 ms. Tarayıcı zamanlaması gerçek zaman garantisi değildir.

## AB kapsamı

Temel çerçeve AB 2018/858 ve 2019/2144. Seçilen davranışların R100, R21, R158, R155, R156 ve AB eCall düzenlemeleri ile bağlantıları matristedir. eCall değerlendirmesi yalnızca 2024/1180’de bırakılmadı; 2025/1871’in 2026 geçiş metni de incelendi. ABD FMVSS 111 sınırı AB kuralı olarak kullanılmaz. ASIL değerleri HARA ve gereksinim tahsisi yapılmadan atanmaz.

ISA, AEB, ELKS, sürücü izleme, EDR, TPMS, fiziksel fren/direksiyon, EMC, çarpışma dayanımı, batarya kötüye kullanım deneyleri, aydınlatma fotometrisi, buğu çözme/yıkama-silme performansı ve tüm üretim gereksinimleri uygulanmış değildir. Bu liste de eksiksiz bir homologasyon kontrol listesi değildir.

## Görsel Takip

Aktif mesajın iki ucu tam görünür; diğer bileşenler %13 opaklığa, diğer hatlar %7 opaklığa iner. Bu görsel odak, diğer ECU'ların fiziksel olarak kapandığı anlamına gelmez. Kamera aktarım bölgesine sönümlü hareketle yaklaşır. Takip düğmesi kapatabilir; elle sürükleme mevcut aktarımın kamera hareketini durdurur, sonraki aktarımda etkin takip devam eder. Görsel animasyon sanal mesaj zamanı değildir.

## Doğrulama

`npm test`: hat/düğüm arızası, gerçek durum–HMI ayrımı, izin sınırı, yerel sıkışma, RC ön şarj, şarj tahrik kilidi, AC/DC yol ayrımı, OTA özgünlük girdisi/geri dönüş, bağımsız eCall, enerji hesabı ve tork watchdog testleri.

`npm run test:browser`: Google Chrome ile 24 deney, aynı görünümde gösterge, multimedya ve kumanda ekranı, IVI komutları, arıza düğmeleri, kaynak matrisi, rapor indirme, 3D döndürme/ayrıştırma, masaüstü/mobil piksel kontrolleri. Çıktılar `tests/pro-*.png` ve `tests/example-report.json`.

Bu kontroller uygulama davranışını doğrular. Üretim aracı güvenliği, ASIL, siber güvenlik sertifikası veya AB tip onayı kanıtı sağlamaz.

05.09.2026 yeniden inceleme kaydı: [AUDIT.md](AUDIT.md). Gerçek OEM yazılım sürümü ve model yılı doğrulanmadı; katalog tarihi model yılı değildir. OTA deneyindeki 3.4.1 / 3.5.0 sürümleri yalnız örnektir.
