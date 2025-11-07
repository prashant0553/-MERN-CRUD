const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, opts = {}) {
  const res = await fetch(API + path, opts);
  const data = await res.json().catch(()=>({}));
  return data;
}

export function postJSON(path, body, token){
  return request(path, { method:'POST', headers:{'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{})}, body: JSON.stringify(body) });
}
export function getJSON(path, token){
  return request(path, { headers: { ...(token?{Authorization:`Bearer ${token}`}:{}) } });
}
export function putJSON(path, body, token){
  return request(path, { method:'PUT', headers:{'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{})}, body: JSON.stringify(body) });
}
export function delJSON(path, token){
  return request(path, { method:'DELETE', headers: { ...(token?{Authorization:`Bearer ${token}`}:{}) } });
}
