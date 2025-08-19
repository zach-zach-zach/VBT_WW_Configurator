import React from 'react';
export function Button({ children, onClick, asChild, variant='default', className='', ...rest }) {
  const base = { padding:'10px 14px', borderRadius:'12px', border:'1px solid transparent', cursor:'pointer' };
  const style = variant==='outline' ? { ...base, background:'#fff', borderColor:'#e2e8f0' } : { ...base, background:'#0f172a', color:'#fff' };
  if (asChild) {
    const child = React.Children.only(children);
    return React.cloneElement(child, { onClick, style, className: (child.props.className||'') + ' ' + className, ...rest });
  }
  return <button onClick={onClick} style={style} className={className} {...rest}>{children}</button>;
}