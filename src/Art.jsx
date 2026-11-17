import React from 'react';
export default function Art({index,className='',style={},...props}){
  const sheet=index<16?{file:'ingredients',columns:4,rows:4,cell:index}
    :index<28?{file:'ingredients-extra-1',columns:4,rows:3,cell:index-16}
    :index<40?{file:'ingredients-extra-2',columns:4,rows:3,cell:index-28}
    :{file:'ingredients-extra-3',columns:3,rows:3,cell:index-40};
  return <span aria-hidden="true" className={`art ${className}`} style={{
    backgroundImage:`url('/art/${sheet.file}.png')`,
    backgroundSize:`${sheet.columns*100}% ${sheet.rows*100}%`,
    backgroundPosition:`${sheet.cell%sheet.columns*100/(sheet.columns-1)}% ${Math.floor(sheet.cell/sheet.columns)*100/(sheet.rows-1)}%`,...style,
  }} {...props}/>;
}
