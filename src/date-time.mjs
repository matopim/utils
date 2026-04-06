/** {f:'date-time.mjs', v:'1.3.2', d:'2023-02-16', du:'2025-12-09'} **/

/*

	import {toDate,now,dateNow,convertSkToIso,betweenDateTime,isInTime,modifyDate,modifyTimestamp,durationFormat,firstDate,lastDate,difference,betweenMonths,timeElapsed} from '/library/js/date-time.mjs'

  bezne priklady pouzitia:
  - do minut:
    input_datetime_local = toDate( now(), 'datetime' ).slice(0,-7);
  - predchadzajuci mesiac:
    mesbefore = toDate( modifyDate( now(), -1, 'm' ), 'month' )



*/


// toDate - vrati upraveny, formatovany datum podla pozadovaneho vystupu
// rType = return type    ['number', 'date', 'datetime']
// typ number a timestamp su v [ms]

const toDate = ( d, rType='number' )=>{
  // zakomentovane 22.10.2024, pretoze pri konverzii z cisla na datum dochadzalo k casovemu posunu timezome
  // novy kod navrhla AI
  // -----------------------
  // // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  // // console.group('toDate')
  // if( typeof d === 'string' )
  //   d = d.replace(' ', 'T');
  // // console.log('d: ', d);
  // const date = new Date(d);
  // // console.log('date: ', date);
  // const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  // // console.log('dateString: ', dateString);
  // const dateNumber = Date.parse(dateString);
  // // console.log('dateNumber: ', dateNumber);
  // // console.groupEnd();


  if( typeof d === 'string' )
    d = d.replace(' ', 'T');


  if( typeof d === 'number' )
    if( d <= 946684799000 ) // 1999-12-30 23:59:59
      console.warn( `Zadal si datum ako timestamp, ale ma nizku hodnotu. Pravdepodobne je v [s] no potrebujem [ms].`, d );


  // const date = typeof d === 'number' ? new Date(d) : new Date(d);
  const date = new Date(d);

  // Vytvorenie správneho miestneho dátumového reťazca bez UTC konverzie
  const pad = (n) => (n < 10 ? '0' : '') + n;
  // const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.000`;
  const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

  const dateNumber = date.getTime();

  switch( rType ){
    case 'timestamp':
    case 'number'  : return dateNumber;
    case 'date'    : return dateString.split("T")[0];
    case 'year'    : return dateString.split("T")[0].substring(0,4);
    case 'month'   : return dateString.split("T")[0].substring(0,7);
    case 'time'    : return dateString.split("T")[1].replace('Z','');
    case 'datetime': return dateString.replace('Z','');
    case 'datetime-local': return dateString.substring(0,16);
    case 'ymd'     : return dateString.substring(0,10).replaceAll('-','');
    default:
          console.warn(`Zadal si neplatny typ navratovej hodnoty: `, rType);
  }
}


// konvertuje SK format datumu na ISO format
// napr z 1.2.2024 na 2024-02-01
// '1.2.2024 13:56' -> '2024-02-01 13:56'
// '1. 2. 2024 13:56' -> '2024-02-01 13:56'
const convertSkToIso = ( dateString ) => {
  // kontroly
  if( new RegExp(/\-/).test(dateString) )
    return dateString;
  // Rozdelenie dátumu podľa bodiek
  dateString = dateString.replace(/\.\ /, '.');
  const dt = new RegExp(/\:/) ? dateString.split(' ') : [dateString,''];
  const a = dt[0].split('.');
  if( a.length != 3 )
    return dateString;
  const Y = a[2].trim();
  const m = a[1].trim().padStart(2, '0');
  const d = a[0].trim().padStart(2, '0');
  // console.log( 'convertSkToIso(): ', dateString, Y, m, d);
  // return dateString;
  // Formátovanie do ISO formátu
  const isoDate = `${Y}-${m}-${d} ${dt[1]}`.trim();
  return isoDate;
}

// vrati aktualny cas v aktualnej casovej zone s prihliadnutim na letny a zimny cas
// hasMs - pri vystupe pouzivat aj milisekundy
// hasZ  - pri vystupe pouzivat pismeno "Z" za milisekundami => Z oznacuje UTC, ale moze dochadzat k posunom miestneho casu, takze je lepsie nepouzit
const now = ( hasMs = false, hasZ = false )=>{
  // return new Date().toISOString(); // vrati cas bez lokalneho posunu
  const dp = new Date;
  const posun = dp.getTimezoneOffset() * -1; // Pretože getTimezoneOffset() vracia posun v opačnom smere
  const cp = posun * 60000;
  // const  d = new Date( Date.now() + cp ).toISOString().substr(0, 19); // vratit bez koncovky '.###Z'
  let  d = new Date( Date.now() + cp ).toISOString();
  if( hasMs === false )
    d = d.substr(0, 19);
  if( hasZ === false )
    d = d.replace('Z','');
  // console.log( 'now: ', d )
  return d
}

const lastDate = (d) => {
  // Parsovanie datumu explicitne z reťazca, aby sa zabránilo problémom s časovým pásmom
  let year, month;
  if (typeof d === 'string') {
    // Formát YYYY-MM-DD alebo YYYY-M-D
    const parts = d.split('-');
    if (parts.length >= 2) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1; // mesiac v UTC začína 0 (január = 0)
    } else {
      // Fallback na pôvodné parsovanie
      const date = new Date(d);
      year = date.getUTCFullYear();
      month = date.getUTCMonth();
    }
  } else {
    // Ak nie je string, použijeme pôvodné parsovanie
    const date = new Date(d);
    year = date.getUTCFullYear();
    month = date.getUTCMonth();
  }
  // Nastavíme mesiac na ďalší mesiac a deň na 0 (čo predstavuje posledný deň predchádzajúceho mesiaca)
  // UTC mesiac zacina 0 => januar = 0 (nie 1)
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  return lastDay.toISOString().split('T')[0];
}


const firstDate = (d) => {
  // Parsovanie datumu explicitne z reťazca, aby sa zabránilo problémom s časovým pásmom
  let year, month;
  if (typeof d === 'string') {
    // Formát YYYY-MM-DD alebo YYYY-M-D
    const parts = d.split('-');
    if (parts.length >= 2) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1; // mesiac v UTC začína 0 (január = 0)
    } else {
      // Fallback na pôvodné parsovanie
      const date = new Date(d);
      year = date.getUTCFullYear();
      month = date.getUTCMonth();
    }
  } else {
    // Ak nie je string, použijeme pôvodné parsovanie
    const date = new Date(d);
    year = date.getUTCFullYear();
    month = date.getUTCMonth();
  }
  const firstDay = new Date(Date.UTC(year, month, 1));
  return firstDay.toISOString().split('T')[0];
}

// const lastDate = ( ...opt )=>{
//   let y = 0
//   let m = 0
//   for( const o of opt )
//     if( o <= 12 )
//       m = o
//     else
//       y = o
//   if( !y )
//     y = new Date().getFullYear()
//   if( !m )
//     m = new Date().getMonth()
//   return  new Date(y, m, 0);
// }

// porovnanie 2 az 3 datumov
const betweenDateTime = ( dTestStr, dFromStr = null, dToStr = null )=>{
    const dTest = new Date(dTestStr)
    const dFrom = dFromStr ? new Date(dFromStr) : null
    const dTo   = dToStr ? new Date(dToStr) : null

    if( !dFrom && !dTo )
      return false

    // musi byt vacsi
    if( dFrom && !dTo )
      return ( dTest >= dFrom ) ? true : false

    // musi byt mensi
    if( !dFrom && dTo )
      return ( dTest <= dTo ) ? true : false

    // musi byt medzi
      return ( dTest >= dFrom && dTest <= dTo ) ? true : false
  }


// porovna 2 datumy s casovou jenotkou v sekundach (def. 6 hodin)
// vrati [true/false], pri porovnani vstupneho datumu casu s aktualnym casom a ich rozdiel ma byt mensi ako casova jednotka
    // Príklady použitia
    // const isShowTime6hour = isInTime("2024-10-30 08:00:00");
    // console.log(isShowTime6hour); // true alebo false v závislosti od aktuálneho času
    // const isShowTime2hour = isInTime("2024-10-30 08:00:00", "2024-10-30 09:00:00", 7200);
    // console.log(isShowTime2hour); // očakávaný výstup: true

const isInTime = (compareDateTime, nowDateTime = null, limitTime = 21600)=>{
  // Ak nowDateTime nie je zadaný, použijeme aktuálny dátum a čas
  nowDateTime = nowDateTime ? new Date(nowDateTime) : new Date();
  // Vstupný dátum compareDateTime je potrebné skonvertovať na dátumový objekt
  const compareDate = new Date(compareDateTime);
  // Ak je niektorý z dátumov neplatný, vrátime false
  if (isNaN(compareDate) || isNaN(nowDateTime)) return false;
  // Vypočítame rozdiel v sekundách medzi dátumami
  const timeDifference = Math.abs(nowDateTime - compareDate) / 1000;

  // console.group(isInTime)
  // console.log('compareDateTime: ', compareDateTime)
  // console.log('nowDateTime: ', nowDateTime)
  // console.log('limitTime: ', limitTime)
  // console.log('compareDate: ', compareDate)
  // console.log('timeDifference: ', timeDifference)
  // console.groupEnd()

  // Vrátime true, ak je rozdiel menší ako limitTime, inak false
  return timeDifference <= limitTime;

  // // navrh od AI
  // // Vrátime objekt s výsledkom a ďalšími informáciami
  // return {
  //   isInLimit: timeDifference <= limitTime,
  //   isBefore: timeDifference > limitTime,
  //   isAfter: timeDifference < -limitTime,
  // };

}



// uprava datumu s pridanim / ubranim casovej jednotky
  // date  = datum
  // value = +- hodnota
  // unit  = typ upravovanej hodnoty: y,m,d,H,i,s
const modifyDate = (date, value, unit)=>{
  const newDate = new Date(date);
  switch (unit) {
    case 'y':
      newDate.setFullYear(newDate.getFullYear() + value);
      break;
    case 'm':
      newDate.setMonth(newDate.getMonth() + value);
      break;
    case 'd':
      newDate.setDate(newDate.getDate() + value);
      break;
    case 'H':
      newDate.setHours(newDate.getHours() + value);
      break;
    case 'i':
      newDate.setMinutes(newDate.getMinutes() + value);
      break;
    case 's':
      newDate.setSeconds(newDate.getSeconds() + value);
      break;
    default:
      throw new Error('Neplatná časová jednotka. Použi "y", "m", "d", "H", "i" alebo "s".');
  }
  return newDate;
}

// vrati sekundy podla unit
// unit  = typ upravovanej hodnoty: y,m,d,H,i,s
// napr. (5,d) = 5 * ( 24*60*60 )
const modifyTimestamp = ( value, unit )=>{
  const s1 = 1,
        i1 = 60,
        H1 = 60 * i1,
        d1 = 24 * H1,
        m1 = 30.44 * d1, // priemerna dlzka mesiaca: 30,44 dni
        y1 = 12 * m1;
  const u = { y:y1, m:m1, d:d1, H:H1, i:i1, s:s1 };
  const t = value * u[unit];
  // console.log( 'modifyTimestamp():', value, unit, u[unit], t )
  return t;
}

// duration = trvanie
const durationFormat = ( seconds )=>{
  seconds = parseFloat(seconds)
  const m = seconds < 0 ? '-' : ''
  seconds = Math.abs( seconds )
  const f = ['y','m','d','','','']
  const a = durationConvert( seconds )
  let  ad = [], at = [], s = '';
  if( a.years )  ad.push( `${a.years}${f[0]}` )
  if( a.years || a.months ) ad.push( `${a.months}${f[1]}` )
  if( a.years || a.months || a.days )   ad.push( `${a.days}${f[2]}` )
  at.push( `${a.hours.toLocaleString('default', {minimumIntegerDigits: 2, useGrouping: false})}${f[3]}` )
  at.push( `${a.minutes.toLocaleString('default', {minimumIntegerDigits: 2, useGrouping: false})}${f[4]}` )
  at.push( `${a.seconds.toLocaleString('default', {minimumIntegerDigits: 2, useGrouping: false})}${f[5]}` )
  // console.log( `durationFormat(): `, [ seconds, m, a, ad, at ] )
  s = `${m}${ad.join(' ')} ${at.join(':')}`
  return s.trim()
}

const durationConvert = ( seconds )=>{
  let years = 0,
      months = 0,
      days = 0,
      hours = 0,
      minutes = 0;
  years = Math.floor(seconds / (365 * 24 * 60 * 60));
  seconds -= years * 365 * 24 * 60 * 60;
  months = Math.floor(seconds / (30 * 24 * 60 * 60));
  seconds -= months * 30 * 24 * 60 * 60;
  days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * 24 * 60 * 60;
  hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * 60 * 60;
  minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return {
    'years': years,
    'months': months,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
    };
}

// vrati cislo v ms ako rozdiel datumov/casov
const difference = (date1, date2) => {
    // Prevod dátumov na časové hodnoty v milisekundách
    const time1 = new Date(date1).getTime();
    const time2 = new Date(date2).getTime();
    // Vypočítanie rozdielu
    // const difference = Math.abs(time1 - time2);
    const difference = time1 - time2;
    return difference;
}

// vrati aktualny cas s ohladom na lokalny casovy posun
// !! doladit posun !!
function dateNow(){
  // const cp = 60 * 60000; // casovy posun +2 hod.
  const dp = new Date;
  const posun = dp.getTimezoneOffset() / -60; // Pretože getTimezoneOffset() vracia posun v opačnom smere
  const cp = posun * 60 * 60000;
  const  d = new Date( Date.now() + cp ).toISOString().substring(0, 16);
  return d
}


// vrati pocet mesiacov medzi datumami
function betweenMonths(d1, d2) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const yearDiff = date2.getFullYear() - date1.getFullYear();
    const monthDiff = date2.getMonth() - date1.getMonth();
    return yearDiff * 12 + monthDiff + 1; // +1 zahrňuje aj aktuálny mesiac
}


// uplynule obdobie v citatelnom tvare
// napr.: timeElapsed(1234567)  // 2w 0d 6h 56m 7s
function timeElapsed(secs, maxUnit = 's') {
  const units = ['y', 'w', 'd', 'h', 'm', 's'];
  const seconds = {
    y: 31556926,
    w: 604800,
    d: 86400,
    h: 3600,
    m: 60,
    s: 1
  };

  const ret = [];
  for (const unit of units) {
    if (secs < seconds[unit]) continue;
    const val = Math.floor(secs / seconds[unit]);
    secs %= seconds[unit];
    ret.push(val + unit);
    if (unit === maxUnit) break;
  }

  return ret.join(' ');
}




export {
	toDate,
  now,
  dateNow,
  convertSkToIso,
  betweenDateTime,
  isInTime,
  modifyDate,
  modifyTimestamp,
  durationFormat,
  firstDate,
  lastDate,
  difference,
  betweenMonths,
  timeElapsed,
}