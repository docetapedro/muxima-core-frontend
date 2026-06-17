import{i as p,a0 as h,S as i}from"./index-BUQf__vo.js";import{u as v}from"./useApiErrorHandler-B3ilRM96.js";/**
 * @license lucide-vue-next v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=p("SearchIcon",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);function k(l){const r=i([]),u=i(null),n=i(!1),{handleApiError:c}=v();async function f(t={}){var e,s,a,m;n.value=!0;try{const o=await l.listar(t);r.value=((s=(e=o.data)==null?void 0:e.dados)==null?void 0:s.items)??[],u.value=((m=(a=o.data)==null?void 0:a.dados)==null?void 0:m.paginacao)??null}catch(o){console.error(o),c(o)}finally{n.value=!1}}function d(t){r.value=r.value.filter(e=>e.id!==t)}async function y(t,e){var s;try{const a=await l.eliminar(t);return d(t),h.success(((s=a==null?void 0:a.data)==null?void 0:s.message)||"Registo eliminado com sucesso."),!0}catch(a){return console.error(a),e?e.value=c(a):c(a),!1}}return{items:r,paginacao:u,loading:n,fetchItems:f,removeFromList:d,destroy:y,handleApiError:c}}export{I as S,k as u};
