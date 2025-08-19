import React from 'react';
export function Card({ children, className='' }) { return <div className={`border ${className}`}>{children}</div>; }
export function CardHeader({ children }) { return <div style={{padding:'16px 16px 0'}}>{children}</div>; }
export function CardTitle({ children }) { return <h3 style={{fontSize:'18px', fontWeight:700, margin:0}}>{children}</h3>; }
export function CardContent({ children, className='' }) { return <div className={className} style={{padding:'16px'}}>{children}</div>; }