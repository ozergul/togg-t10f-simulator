export const types={
 eth:{label:'Ethernet',color:'#138879',kind:'network',speed:'100BASE-T1'},can:{label:'CAN-FD',color:'#b57a12',kind:'network',speed:'500k / 2M'},lin:{label:'LIN',color:'#8753ca',kind:'network',speed:'19,2 kbit/s'},a2b:{label:'A²B / ses',color:'#c04787',kind:'network',speed:'Dijital / analog'},rf:{label:'RF / kablosuz',color:'#237cc6',kind:'wireless',speed:'LTE · BLE · GNSS'},pilot:{label:'CP / PLC',color:'#668223',kind:'network',speed:'Şarj kontrol'},signal:{label:'Ayrık / sensör',color:'#799394',kind:'network',speed:'Yerel I/O'},hv:{label:'HV güç',color:'#e86928',kind:'power',speed:'DC çift / 3 faz'},lv:{label:'12 V güç',color:'#b69b3b',kind:'power',speed:'Besleme + dönüş'},thermal:{label:'Soğutma',color:'#36a2c1',kind:'thermal',speed:'Sıvı devresi'}
};
const node=(id,tag,name,pos,size,type,description,refs=['zonal'],extra={})=>({id,tag,name,pos,size,type,description,refs,spec:extra.spec||types[type].speed,...extra});
export const components=[
 node('battery','REESS','Çekiş bataryası',[0,.35,0],[2.7,.16,1.4],'hv','Hücre grubu; gerilim ve sıcaklık BMS’ye sensör bağlantısıyla gider.',['r100'],{spec:'T10F: 89,6 kWh brüt · 400 V: model varsayımı'}),
 node('bms','BMS','Batarya yönetimi',[.94,.53,.46],[.28,.1,.22],'can','Hücre izleme, şarj/deşarj izinleri. İzolasyon ölçümünü IMD’den alır.',['r100','precharge']),
 node('pdu','BDU','Batarya bağlantı ünitesi',[-.95,.58,0],[.35,.18,.44],'hv','Ana +/- kontaktör ve dirençli ön şarj kolu. Kontaktör kontrolü BMS’ye aittir.',['r100','precharge']),
 node('imd','IMD','İzolasyon izleme',[-.53,.51,.46],[.19,.1,.18],'signal','HV izolasyon ölçümü; arıza girdisi BMS kontrolünü etkiler.',['r100']),
 node('inverter','INV','Çekiş inverteri',[1.51,.65,0],[.45,.2,.52],'hv','DC-link ve üç faz güç katı; tork talebi CAN-FD güç aktarma ağından gelir.',['r100'],{spec:'160 kW motor referansı · inverter yapısı varsayım'}),
 node('motor','EM','Elektrik motoru',[1.61,.37,0],[.45,.28,.64],'hv','Arka aks tahriki. Rejenerasyonda enerji akış yönü tersine döner.',['r100']),
 node('obc','OBC','AC dahili şarj cihazı',[-1.57,.58,.43],[.4,.18,.36],'hv','AC girişini DC’ye çevirir. DC hızlı şarj güç yolu OBC’den geçmez.',['ccs','togg'],{spec:'11 kW · T10F katalog azamisi'}),
 node('port','CCS2','Şarj girişi',[-1.2,.88,-.89],[.15,.23,.09],'pilot','AC/DC güç pinleri ve pilot bağlantıları farklı hatlarla gösterilir.',['ccs']),
 node('evcc','EVCC','Şarj haberleşme kontrolcüsü',[1.25,.66,.6],[.23,.12,.2],'can','Pilot/PLC el sıkışması, soket kilidi ve BMS ile şarj koordinasyonu.',['ccs']),
 node('charge','K-DC','DC şarj kontaktörleri',[.99,.48,.06],[.28,.1,.2],'hv','DC girişini REESS’e bağlayan ayrı kontaktör yolu.',['ccs','r100']),
 node('dcdc','DC/DC','Düşük gerilim dönüştürücü',[-1.51,.59,-.44],[.37,.17,.33],'hv','HV’den 12 V ağına güç aktarır.',['r100']),
 node('aux','BAT12','12 V akü',[-1.94,.63,-.47],[.28,.22,.31],'lv','Kontrol üniteleri ve başlangıç işlemi için düşük gerilim kaynağı.',['zonal']),
 node('fuse','LV-PDU','Sigortalı LV dağıtımı',[-1.83,.6,.1],[.25,.13,.28],'lv','Toplulaştırılmış sigorta ve besleme dalları. Fiziksel sigorta değeri tanımlanmamıştır.',['zonal']),
 node('vcu','VCU','Araç kontrol ünitesi',[-1.14,.77,-.34],[.26,.12,.23],'can','Sürüş izni ve tork talepleri; ağ geçidi ayrı bileşendir.',['zonal','r100']),
 node('gw','CGW','Merkezi gateway / Ethernet switch',[.15,.64,0],[.32,.12,.29],'eth','Alanlar arası yetkili mesaj yönlendirme. Seçilen örnek mimarinin güven sınırı.',['zonal','r155']),
 node('canpt','PT-BUS','Güç aktarma CAN-FD',[.65,.45,-.27],[.13,.06,.13],'can','Paylaşılan bus kesimi; ECU değildir. Fiziksel ağ gövdesi toplulaştırılmıştır.',['zonal'],{bus:true}),
 node('canch','CH-BUS','Şasi CAN-FD',[-1.32,.46,.1],[.13,.06,.13],'can','Fren, direksiyon ve SRS için ayrı paylaşılan bus; ECU değildir.',['zonal'],{bus:true}),
 node('bcm','ZC-FL','Ön sol bölge kontrolcüsü',[-.47,.72,-.78],[.24,.13,.19],'eth','Yerel LIN ve 12 V çıkışları. Sol ön cam ve kilit kontrolü.',['zonal','r21']),
 node('zfr','ZC-FR','Ön sağ bölge kontrolcüsü',[-.47,.72,.78],[.24,.13,.19],'eth','Sağ ön kapı, far ve silecek için seçilen yerel dağıtım.',['zonal']),
 node('zrl','ZC-RL','Arka sol bölge kontrolcüsü',[.96,.72,-.78],[.24,.13,.19],'eth','Arka sol cam bağlantısı; bağımsız hareket durumu ve kilit aktüatörü modellenmedi.',['zonal']),
 node('zrr','ZC-RR','Arka sağ bölge kontrolcüsü',[.96,.72,.78],[.24,.13,.19],'eth','Arka sağ cam bağlantısı; bağımsız hareket durumu ve kilit aktüatörü modellenmedi.',['zonal']),
 node('hvac','HVAC','Klima kontrolü / kompresör',[-1.49,.85,0],[.37,.25,.32],'can','Kontrol mesajı ile HV güç girişi ayrıdır. Soğutma hedefi yerel denetimle uygulanır.',['zonal']),
 node('pump','PUMP','Termal pompa / radyatör',[-2.02,.68,0],[.15,.38,.78],'lin','Soğutma devresi; LIN komutu ve LV güç kaynağı bağımsızdır.',['r100']),
 node('screen','IVI','Multimedya / VHAL',[-.67,1.15,0],[.065,.26,.44],'eth','Uygulama → CarService/VHAL → araç arayüzü. İzin sonucu model politikasıyla hesaplanır.',['vhal','r155']),
 node('cluster','ICM','Sürücü gösterge paneli',[-.77,1.18,-.48],[.07,.2,.28],'eth','READY, yön ve arıza bildirimi. IVI’den ayrı görüntü yolu.',['r100']),
 node('tcu','TCU','Telematik / eCall',[1.1,.92,0],[.28,.12,.23],'eth','OEM bulut bağlantısı ve bağımsız 112 eCall yolu. Yedek besleme seçilmiş mimaridir.',['ecall','ecall26']),
 node('backup','BKP','eCall yedek beslemesi',[1.45,.85,-.43],[.23,.12,.2],'lv','TCU ve özel acil ses çıkışının ana LV kaybındaki rezervi.',['ecall'],{reserve:true}),
 node('antenna','ANT','LTE / GNSS anteni',[.72,1.55,0],[.2,.1,.1],'rf','TCU’ya RF bağlantısı. Uydu konumu ve hücresel kapsama ayrı girdilerdir.',['ecall26']),
 node('audio','AMP','Ses amfisi / DSP',[.77,.56,-.49],[.29,.12,.23],'a2b','IVI’nin A²B alt düğümü; pasif hoparlöre güçlendirilmiş analog ses verir.',['a2b']),
 node('speaker','SPK','Kabin hoparlörü',[-.06,.72,-.85],[.16,.18,.07],'a2b','Amfinin analog ses çıkışı; A²B düğümü olarak gösterilmez.',['a2b']),
 node('ecallspeaker','SOS-AUD','Acil ses / mikrofon',[.13,1.14,0],[.16,.09,.14],'signal','TCU’ya bağlı özel acil ses yolu. IVI çökmesi normal medya sesini keser; bu yol ayrı kalır.',['ecall']),
 ...[['window','WIN-FL',-.12,-.88],['winfr','WIN-FR',-.12,.88],['winrl','WIN-RL',.9,-.88],['winrr','WIN-RR',.9,.88]].map(([id,tag,x,z])=>node(id,tag,'Cam motoru '+tag.slice(4),[x,.79,z],[.16,.13,.07],'lin','LIN kontrollü akıllı motor düğümü; yerel sıkışma geri açması bu tasarımda motor düğümündedir. Karar IVI’ye bağlı değildir.',['r21','zonal'])),
 node('lock','LOCK','Sol ön kilit aktüatörü',[.24,.88,-.88],[.14,.1,.06],'signal','Bölge kontrolcüsünün yerel çıkışı.',['zonal']),
 node('lights','LED','Far sürücüsü',[-2.12,.83,.5],[.09,.12,.31],'lin','Ön sağ bölge LIN komutu ve ayrı LV güç dalı.',['gsr']),
 node('wiper','WIPER','Silecek sürücüsü',[-.91,1.04,.32],[.17,.09,.24],'lin','Yerel motor kontrolü; yıkama/silme performans testi yapılmaz.',['gsr']),
 node('abs','ESC','Fren / ESC',[-1.86,.58,.67],[.25,.15,.18],'can','Fren isteği, hız sinyali ve rejenerasyon koordinasyonu. Hidrolik fren hesapları kapsam dışı.',['gsr']),
 node('eps','EPS','Elektrikli direksiyon',[-1.15,.52,-.54],[.23,.17,.21],'can','Direksiyon kontrol alanı. IVI’den ham kontrol mesajı kabul edilmez.',['r155','gsr']),
 node('camera','CAM-R','Geri görüş kamerası',[2.15,.91,0],[.08,.1,.14],'eth','Kamera → IVI Ethernet video yolu. Görüntü şematik; gerçek kamera veya CV motoru yok.',['r158']),
 node('key','KEY','Anahtar alıcısı',[-.51,.94,-.77],[.18,.1,.07],'signal','Yerel anahtar yetkisi ve başlatma talebi. Kriptografik eşleştirme modellenmez.',['r155']),
 node('airbag','SRS','Çarpışma kontrolcüsü',[.02,.47,.14],[.2,.1,.17],'can','Çarpışma olayı girdisi, HV kesme ve bağımsız eCall tetik hattı.',['r100','ecall']),
 node('phone','PHONE','Kullanıcı telefonu',[-1.7,1.8,1.65],[.07,.33,.18],'rf','Bluetooth medya cihazı ve OEM uzak komut istemcisi.',['vhal'],{external:true}),
 node('cloud','OEM','OEM arka ucu',[.12,2.25,1.7],[.42,.2,.3],'rf','Uzak komut ve OTA hizmeti. 112 PSAP ile aynı sistem değildir.',['r155','r156'],{external:true}),
 node('psap','112','112 PSAP',[1.7,2.05,-1.6],[.37,.2,.28],'rf','Acil çağrı karşılama noktası. Simülasyon dışında ağ çağrısı yapılmaz.',['ecall','ecall26'],{external:true}),
 node('evse','EVSE','Şarj istasyonu',[1.7,.84,1.9],[.25,.95,.32],'pilot','Harici AC/DC kaynak ve şarj kontrolü.',['ccs'],{external:true})
];
export const byId=Object.fromEntries(components.map(c=>[c.id,c]));
export const wires=[];
const add=(from,to,type,label='',extra={})=>wires.push({id:`${from}:${to}:${type}`,from,to,type,label:label||types[type].label,...extra});
for(const n of ['screen','cluster','tcu','bcm','zfr','zrl','zrr'])add('gw',n,'eth','100BASE-T1 · çift yönlü');
for(const n of ['gw','vcu','bms','inverter','evcc','obc','hvac','dcdc'])add('canpt',n,'can','PT-CAN · paylaşılan bus dalı');
for(const n of ['gw','abs','eps','airbag','vcu'])add('canch',n,'can','CH-CAN · paylaşılan bus dalı');
for(const [a,b] of [['bcm','window'],['zfr','winfr'],['zrl','winrl'],['zrr','winrr'],['zfr','lights'],['zfr','wiper'],['zfr','pump']])add(a,b,'lin');
for(const [a,b,label] of [['battery','bms','Hücre sensörleri'],['imd','bms','İzolasyon ölçümü'],['bms','pdu','Kontaktör kumandası / geri bildirim'],['bms','charge','DC kontaktör kumandası'],['key','bcm','Yerel anahtar olayı'],['bcm','lock','Yerel çıkış'],['airbag','pdu','Bağımsız HV kesme'],['airbag','tcu','Bağımsız çarpışma tetik'],['tcu','ecallspeaker','Özel acil ses']])add(a,b,'signal',label);
add('camera','screen','eth','Video · örnek Ethernet taşıması');add('screen','audio','a2b','A²B: IVI ana → AMP alt düğüm');add('audio','speaker','a2b','Analog ses güç çıkışı');
for(const [a,b,label] of [['tcu','antenna','Koaksiyel RF'],['antenna','cloud','LTE/IP · OEM servisi'],['antenna','psap','IMS eCall · PSAP'],['phone','screen','Bluetooth'],['phone','cloud','Telefon interneti']])add(a,b,'rf',label,{wireless:b!=='antenna'});
add('evse','evcc','pilot','CP/PP veya PLC · port üzerinden');
for(const [a,b,label] of [['battery','pdu','HV DC + / −'],['pdu','inverter','HV DC + / −'],['inverter','motor','U / V / W'],['pdu','dcdc','HV DC + / −'],['pdu','hvac','HV DC + / −'],['evse','port','Harici şarj kablosu'],['port','obc','AC L1/L2/L3/N/PE'],['obc','battery','OBC DC çıkış çifti'],['port','charge','DC şarj çifti'],['charge','battery','DC kontaktör çıkışı']])add(a,b,'hv',label);
add('dcdc','aux','lv');add('aux','fuse','lv');
for(const n of ['bms','imd','vcu','gw','bcm','zfr','zrl','zrr','screen','cluster','tcu','audio','camera','evcc','abs','eps','airbag','hvac','inverter','obc','dcdc'])add('fuse',n,'lv','Sigortalı LV dalı + dönüş');
for(const [a,b] of [['bcm','window'],['zfr','winfr'],['zrl','winrl'],['zrr','winrr'],['bcm','lock'],['zfr','lights'],['zfr','wiper'],['zfr','pump'],['bcm','key'],['backup','tcu'],['backup','ecallspeaker']])add(a,b,'lv','Yerel besleme + dönüş');
for(const n of ['battery','inverter','hvac'])add('pump',n,'thermal','Toplulaştırılmış gidiş / dönüş');
export const link=(a,b,type)=>wires.find(w=>w.type===type&&((w.from===a&&w.to===b)||(w.from===b&&w.to===a)));
export const pt=(a,b)=>[a,'canpt',b];
export const ch=(a,b)=>[a,'canch',b];
