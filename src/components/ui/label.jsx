import React from 'react';
export function Label({children, htmlFor}){ return <label htmlFor={htmlFor} style={{fontSize:'12px', fontWeight:600}}>{children}</label>; }