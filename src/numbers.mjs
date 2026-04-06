/** {f:'numbers.mjs', v:'1.1.5', d:'2022-12-05', du:'2025-02-19'} **/

// funkcie na pracu s cislami ~ ich uprava

/*

import {cislo,percento,percPodiel,formatBytes,cenaNa5Centov,cenaNa10Centov,ratio} from '/library/js/numbers.mjs'

*/



/*
	convertBite - premena jednotiek v Bytoch

*/

// povodne funkcia convert v php
// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(bytes, decimals=2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


function cislo( i, d = 3 ){ // prevedie text / alebo cislo na double s urcenym desatinnym miestom
  if( typeof i == 'string' ){
    i = i.replace( ' ', '' ).replace( ' ', '' ).replace( ',','.' ).replace( new RegExp('[aA-zZ]|\$|€|\%|\ ','') );
    i = parseFloat(i);
  }
  i = i.toFixed(d);
  return parseFloat(i);
}

function percento( zaklad, podiel, fraction = 3 ){
  if( zaklad === 0 )
    return 0;
  const perc = parseFloat((( podiel / zaklad ) * 100).toFixed(fraction));
  return perc;
}

function percPodiel( zaklad, percento, fraction = 3 ){
  if( zaklad === 0 )
    return 0;
  const podiel = parseFloat((( zaklad / 100 ) * percento).toFixed(fraction));
  return podiel;
}

// Finančné zaokrúhľovanie na 5 centov
// Násobíme sumu ×20 (keďže 1/0.05 = 20), aby sme dostali hodnotu v "päťcentových krokoch".
function cenaNa5Centov(cena){
  return Math.round(cena * 20) / 20;
}

// Finančné zaokrúhľovanie na 10 centov
function cenaNa10Centov(cena){
  return Math.round(cena * 10) / 10;
}


// ratio ~ class
// vypocet pomeru cisel
// ak mas napr. pole 4 cisel a chces upravit hodnoty ostatnych tak, ze definujes jedno cislo ako fixne
// fixne cisla je mozne pridavat postupne
// podmienka - musi byt aspon 1 cislo vypocitatelne (nie zafixovane)
// moznost pridavat podmienky:
//   dec - pocet desatinnych miest pouzitych pri vypocte
//   min - min. hodnota akehokolvek cisla => aj vypocitaneho
//   max - max. hodnota akehokolvek cisla => aj vypocitaneho
// vstupna povinna hodnota
//   nums - jednoduche pole cisel
//          [ 658, 658, 658, 658 ]
// priklad:
/*

const rat = new ratio( [10,10,10,10] );
if( rat.num( 2, 15 ) )
  myNums = rat.nums;    // => rat.nums = [ 8.33, 8.33, 15, 8.33 ]
                        // => raf.fix  = [ false, false, true, false ]

// alebo s podmienkami
const rat = new ratio( [10,10,10,10], { dec:1, min:5, fix:[ true, false, false, true ] } );
if( rat.num( 2, 15 ) )
  myNums = rat.nums;    // => rat.nums = [ 10, 5, 15, 10 ]
                        // => raf.fix  = [ true, false, true, true ]

*/
class ratio {
  "use strict";
  constructor( nums, options ) {
    this.name = this.__proto__.constructor.name;
    const opt = Object.assign( {dec: 2, min: null, max: null, fix: null}, options )
    this.nums = nums;
    this.dec  = opt.dec;
    this.min  = opt.min;
    this.max  = opt.max;
    this.sum  = nums.sum;
    if (opt.fix !== null) {
      this.fix = opt.fix;
    } else {
      this.fix = new Array(this.nums.length).fill(false);
    }
  }

  // vlozi nove cislo a prepocita ostatne, pokial vyhovuje vsetkym podmienkam
  // vrati true/false, ak sa podari/nepodari zmenit hodnoty
  // pouzitie: if( rat.num( 2, 20 ) ) myNums = rat.nums;
  num( index, number ){
    const nums = [...this.nums];
    const fix  = [...this.fix];
    const { sum, min, max, dec } = this;

    if (index < 0 || index >= nums.length) return false;
    // if (fix[index]) return false; // Nemôžeme meniť fixné číslo

    // Nastavenie novej hodnoty a označenie ako fixné
    nums[index] = number;
    fix[index] = true;

    // Prepočítanie zvyšných hodnôt
    let sumFixed  = 0;
    let countFree = 0;

    for (let i = 0; i < nums.length; i++) {
      if (fix[i]) {
        sumFixed += nums[i];
      } else {
        countFree++;
      }
    }

    if (countFree === 0) return false; // Musí zostať aspoň jedno nevypočítané číslo

    // let newValue = (sumFixed / (nums.length - countFree)).toFixed(dec);
    let newValue = (sum - sumFixed) / countFree;

    newValue = cislo( newValue , dec);

    // Uplatnenie podmienok min/max
    if (min !== null && newValue < min) newValue = min;
    if (max !== null && newValue > max) newValue = max;

    for (let i = 0; i < nums.length; i++) {
      if (!fix[i]) {
        nums[i] = newValue;
      }
    }

    this.nums = [...nums];
    this.fix  = [...fix];
    return true;
  }



  // resetuje fixnute hodnoty - uvolni ich
  reset(){
    this.fix = new Array(this.nums.length).fill(false);
  }


}


export{
  cislo,
  percento, percPodiel,
  formatBytes,
  cenaNa5Centov, cenaNa10Centov,
  ratio
}


