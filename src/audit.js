import {components} from './architecture.js';
import {references} from './references.js';
export const audit={date:'2026-09-05',type:'Kaynak içeriği ve yazılım kapsamı denetimi',vehicle:'Togg T10F V2 RWD Uzun Menzil',market:'Türkiye',brochure:'15.06.2026',oemFirmware:null,homologationVerified:false,
 verdict:'Katalog referansı doğrulandı; OEM iç mimarisi ve fiziksel uygunluk doğrulanmadı.',
 corrections:[
  'OBC 11 kW katalog verisi olarak düzeltildi. Brüt kapasite ile kullanılabilir kapasite ayrımı korundu.',
  'R100 Supplement 3, yanlışlıkla Ek 3 diye yazılmıştı; düzeltildi.',
  'R21 ve R158 erişilemeyen UNECE sayfaları yerine okunabilen EUR-Lex metinlerine bağlandı. R21 2025 değişiklik dosyasının tam metni bu denetimde okunamadı; güncel seri onayı verilmedi.',
  'TI ön şarj sayfası içerik yerine gezinme kabuğu döndürüyordu; okunabilen TIDUF73 pasif ön şarj PDF’iyle değiştirildi.',
  'NXP sunucusundaki ASIL belgesinin gerçek yazarı ZVEI (2012). Kaynak adı ve yaşı düzeltildi.',
  'Buğu çözme ve yıkama için kapsam daraltıldı; yalnız silecek komutu var. Ek IV/VI için doğrudan kaynak eklendi.',
  '2× oynatmada 450 ms alt sınırı iddiası kaldırıldı; hedef süre 425 ms. Gerçek zaman garantisi yok.',
  'Düşük SOC deşarj sınırı ile şarj sınırı ayrıldı; tork ve güç sınırları integratöre uygulandı.',
  'Şarj portu T10F dış görseline göre sol öne taşındı; kablo güzergahı hâlâ varsayım.',
  '3.4.1 / 3.5.0 OTA sürümleri örnektir; Togg/Trumore sürümü bilinmiyor.'
 ],
 sources:Object.fromEntries(Object.entries(references).map(([id,r])=>[id,{url:r.url,checkedOn:'2026-09-05',result:id==='r21'?'Temel metin okundu; sonraki değişiklikler eksik':id==='ccs'?'Kaynak dizini okundu; normatif standartlar tam denetlenmedi':id==='a2b'?'Teknoloji sayfası okundu; Togg kullanımı doğrulanmadı':r.kind==='Mevzuat'?'Belirtilen metin ve ilgili maddeler okundu; araç uygunluğu değil':'Kaynak okundu; yalnız belirtilen iddiaya dayanak',locator:r.section}]))
};
const groups=[
 ['Çekiş / batarya',['battery','bms','pdu','imd','inverter','motor','charge'],'RC, enerji, kontaktör ve basit tahrik','Hücre eğrisi, izolasyon direnci ölçümü, kontaktör kaynak yapması, gerçek motor haritası yok.'],
 ['Şarj',['obc','port','evcc','evse'],'AC/DC ayrı yollar ve soket kilidi','CCS kodlayıcısı, CP voltajı, PLC protokolü, CC/CV ve şarj eğrisi yok.'],
 ['Alçak gerilim',['dcdc','aux','fuse'],'Besleme erişimi ve kesik dal','Akım/gerilim düşümü, akü kapasitesi ve sigorta seçiciliği yok.'],
 ['Ağ / kontrol',['vcu','gw','canpt','canch','bcm','zfr','zrl','zrr'],'Mesaj rotası, izin ve timeout','Togg DBC/ARXML, ECU parça numarası, pinout ve gerçek bus zamanlaması bilinmiyor.'],
 ['Termal / klima',['hvac','pump'],'Tek kabin soğutma ve yığılmış batarya ısı modeli','Çift bölge, ısıtma, buğu çözme, soğutucu akışkan ve ısı pompası çevrimi yok.'],
 ['HMI',['screen','cluster'],'Fotoğraf referanslı ekran; son teslim edilmiş gösterge değerleri','Gerçek Trumore sürümü ve OEM ekran durum makinesi bilinmiyor. R121 doğrulaması yok.'],
 ['Telematik / OTA / eCall',['tcu','backup','antenna','ecallspeaker','phone','cloud','psap'],'Sanal oturum, yedek besleme, örnek A/B geri dönüş','Gerçek SIM/LTE/GNSS, MSD kodlama, IMS, kriptografi, manuel SOS ve şebeke testleri yok.'],
 ['Ses',['audio','speaker'],'Dijital / analog yol ayrımı','Hoparlörler toplulaştırılmış; gerçek ses üretimi, Meridian DSP ve Togg A²B kullanımı doğrulanmadı.'],
 ['Kapı / cam / anahtar',['window','winfr','winrl','winrr','lock','key'],'Sol ön cam hareketi, yerel geri açma, sol ön kilit','Diğer üç cam yalnız ağ düğümü. Kuvvet ölçümü, kapı/pencere geometrisi ve gerçek anahtar güvenliği yok.'],
 ['Far / silecek',['lights','wiper'],'Aç/kapat mesajı ve görsel durum','Fotometri, otomatik far, yağmur sensörü, yıkama ve silme alanı yok.'],
 ['Şasi / güvenlik',['abs','eps','camera','airbag'],'Fren isteği, kamera yolu, çarpışma girdisi','Hidrolik fren, direksiyon dinamiği, gerçek görüntü, airbag ateşleme, ADAS, EDR, TPMS ve çarpışma fiziği yok.']
];
export const systemAudit=groups.map(([system,ids,implemented,missing])=>({system,components:ids,implemented,missing,oemArchitectureVerified:false}));
export function auditCoverage(){const ids=systemAudit.flatMap(s=>s.components);return {components:components.length,covered:new Set(ids).size,missing:components.filter(c=>!ids.includes(c.id)).map(c=>c.id),duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i)};}
