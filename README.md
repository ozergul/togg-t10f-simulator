# EV Atölye · Togg T10F

Togg T10F V2 RWD Uzun Menzil referanslı Türkçe 3D araç sistem laboratuvarı. Aynı görünümde araç ağı, direksiyon arkası gösterge ve merkezi multimedya ekranı. İlk 20 senaryoya güvenlik/OTA/uzak klima/gövde deneyleri eklenerek 24 deney sağlanır.

## Açılış

Canlı uygulama: https://ozergul.github.io/togg-t10f-simulator/

`main` dalına gönderilen değişiklikler GitHub Actions ile test edilir ve GitHub Pages'e yayımlanır.

macOS: `Baslat.command` dosyasını açın. Sunucu çalışıyorsa [uygulama](http://127.0.0.1:5178/) doğrudan açılır.

```sh
npm install
npm run dev -- --port 5178 --strictPort
```

## Deney

- Soldan senaryo seçin. Başlat otomatik oynatır; sonraki-adım düğmesi tek aktarım ilerletir. Yeni senaryo kendi başlangıç koşullarını yükler.
- ICM ve IVI aynı deney motoruna bağlıdır. IVI'deki cam, kilit, far, silecek, klima, telefon, medya ve şarj kontrolleri mesaj yollarını çalıştırır.
- Bileşene tıklayın: kaynaklarını, arayüzlerini ve bağlantılarını inceleyin. Makas ile hat kesilir; düğüm devre dışı bırakılabilir.
- Gerçek motor konumu ile HMI geri bildirimi ayrı tutulur. Kesik kablo veya kayıp besleme başarılı yanıt üretmez.
- Aktarımda kaynak/hedef belirgin, diğer bileşenler %13 opaklıkta görünür. Odak simgesi kamera takibini açar/kapatır; elle sürüklemek o aktarımın otomatik kamera hareketini durdurur.
- Panoramik kokpit ve alt kumanda T10F fotoğrafına göre yeniden çizilmiştir. Fotoğraf düğmesi referansı, büyütme düğmesi kokpit görünümünü açar. Alt uygulama simgeleri araç/medya/navigasyon/enerji sayfalarını seçer.
- Fırça simgesiyle T10F dış tasarımı ve şeffaf iç mimari arasında geçin. Üretici verileri: Haziran 2026 Türkiye kataloğu; iç E/E mimarisi temsili, Togg tesisat şeması değildir.
- Ağ/Güç/Termal katmanları, demet filtreleri, ayrıştırma ve üst görünüm bulunur. Modeli sürükleyin; tekerlek veya pinch ile yakınlaştırın.
- Arıza sekmesinde şebeke, ana/yedek besleme, engel, ön şarj, yetki ve OTA doğrulama girdileri değiştirilebilir.
- Kaynaklar & kapsam: dayanaklar, gereksinim matrisi, eksik fiziksel kanıtlar ve model varsayımları.
- İndirme: zaman damgalı deney raporu, durum, arızalar, parametreler ve kaynaklar tek JSON'da. Kamera düğmesi 3D PNG üretir.

## Kontroller

```sh
npm test
npm run test:browser
npm run build
```

Tarayıcı testleri kurulu Google Chrome ve çalışan yerel sunucu gerektirir. `dist/` üretim çıktısıdır.

## Kapsam

Hedef M1/AB/BEV varsayımıdır. Bu, kaynaklarla ilişkilendirilmiş davranış ve basitleştirilmiş fizik modelidir; üretim CAD'i, OEM kablo projesi, protokol uygunluk test sistemi veya tip onaylı araç değildir. Gerçek Bluetooth/LTE/şarj cihazı/112 bağlantısı kurulmaz. Düzenlemeler, mimari kararlar ve temsilî parametreler ayrı belirtilir.

Ayrıntılar: [ENGINEERING.md](ENGINEERING.md). Yeniden inceleme: [AUDIT.md](AUDIT.md). Uygulamadaki Denetim kaydı sekmesi ve JSON raporu, 47 düğümün kapsamını ve kaynak inceleme sonuçlarını içerir. Kaynak ve gereksinim verisi: `src/references.js`. Mimari: `src/architecture.js`. Motor: `src/simulation.js`. Arayüz: `src/app.js`. 3D: `src/scene-v2.js`.
