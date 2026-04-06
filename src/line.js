/** {f:'line.js', v:'1.1.2', d:'2022-01-22', du:'2024-12-17'} **/

/*
   GLOBALNA PREMENNA __LINE__, KTORA VRATI NAZOV SUBORU a RIADOK
   priklad: console.log("poziacia:", __LINE__ );

import '/library/js/line.min.js'


*/

if( typeof getLine === 'undefined' ){
  const getLine = () => {
    const stack  = new Error().stack.split('\n');
    const offset = typeof stack[3] === 'string' ? 3 : (typeof stack[2] === 'string' ? 2 : 1);
    const file   = stack[offset].split('/').slice(-1)[0];
    const ary    = file.split(':');
    const str    = `${ary[0]}:${String(ary[1])}`;
    return str;
  };

  Object.defineProperty(window, '__LINE__', {
      get: () => {
          return getLine();
      }
  });

}
