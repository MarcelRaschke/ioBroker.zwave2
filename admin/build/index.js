import{c as H}from"./chunk-MTOBDWCR.js";import{A as ne,N as ae,O as se,S as z,Y as le,_ as E,a as L,b as i,ba as pe,c as y,d as re,e as K,ea as b,f as N,fa as ce,ga as ue,ha as me,ia as de,j as G,ja as fe,ka as ge,la as ye,ma as ve,na as ke,oa as be,p as U,q as j,s as oe,z as ie}from"./chunk-LGH3N725.js";var M=L(h=>{"use strict";var he=N(),Se=K();Object.defineProperty(h,"__esModule",{value:!0});h.default=void 0;var Ce=Se(y()),Te=he(z()),we=(0,Te.default)(Ce.createElement("path",{d:"M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"}),"Sync");h.default=we});var J=L(S=>{"use strict";var xe=N(),Ae=K();Object.defineProperty(S,"__esModule",{value:!0});S.default=void 0;var qe=Ae(y()),_e=xe(z()),Be=(0,_e.default)(qe.createElement("path",{d:"M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 16h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 11.9 13 12.5 13 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"}),"LiveHelp");S.default=Be});var e=i(y()),Z=i(re()),R=i(le()),C=i(E()),T=i(G()),u=i(ne());var F=i(ae()),w=i(U()),ee=i(M()),te=i(j()),I=i(oe()),x=i(ie());var a=i(y()),p=i(E()),V=i(pe()),W=i(j()),O=i(G()),g=i(U());var Ie=(0,O.makeStyles)(o=>({button:{margin:o.spacing(1,0)}})),$=()=>{let{alive:o,connected:m}=(0,p.useAdapter)(),{translate:l}=(0,p.useI18n)(),d=Ie(),{namespace:n}=(0,p.useGlobals)(),A=b(),[s]=(0,p.useIoBrokerState)({id:`${n}.info.configUpdate`}),[v]=(0,p.useIoBrokerState)({id:`${n}.info.configVersion`}),[q]=(0,p.useIoBrokerState)({id:`${n}.info.configUpdating`}),[_,k]=a.default.useState(!1);async function B(){k(!0);let r=await A.updateConfig();k(!1),r||alert(l("Updating the configuration DB failed!"))}if(!o||!m)return a.default.createElement(a.default.Fragment,null);if(s){if(_||q)return a.default.createElement(g.default,{variant:"body2"},l("Updating configuration DB - please wait..."))}else return a.default.createElement(a.default.Fragment,null,a.default.createElement(g.default,{variant:"body2"},l("Configuration DB is up to date"),a.default.createElement("br",null),l("Installed version"),": ",v));return a.default.createElement("div",null,a.default.createElement(g.default,{variant:"body2"},l("Update for configuration DB available"),": ",s),a.default.createElement(g.default,{variant:"body2"},l("Installed version"),": ",v),a.default.createElement(W.default,{className:d.button,variant:"contained",color:"primary",onClick:()=>B(),startIcon:a.default.createElement(V.default,null)},l("Update configuration DB")),a.default.createElement(g.default,{variant:"body2"},l("config update disclaimer")))};var Q=i(se()),D=i(y()),X=i(J()),Y=i(G()),Ge=(0,Y.makeStyles)(o=>({tooltip:{verticalAlign:"middle"},icon:{color:o.palette.text.hint,cursor:"help"}})),P=o=>{let m=Ge();return D.default.createElement(Q.default,{title:o.tooltip,className:m.tooltip},D.default.createElement(X.default,{className:m.icon}))};var De=(0,T.makeStyles)(o=>(0,T.createStyles)({root:{display:"flex",flexGrow:1,flexFlow:"column nowrap",gap:o.spacing(8)},keyGrid:{display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center",gap:o.spacing(2)},keyGridLabel:{marginTop:o.spacing(2),gridColumn:"1 / span 2"},keyGrid_TextField:{flexGrow:1},keyGrid_Button:{flexGrow:0}})),Pe=[[2,"networkKey_S2_AccessControl","S2 Access Control"],[1,"networkKey_S2_Authenticated","S2 Authenticated"],[0,"networkKey_S2_Unauthenticated","S2 Unauthenticated"],[7,"networkKey_S0","S0 (Legacy)"]],Fe=e.default.memo(()=>{let{settings:o,originalSettings:m,setSettings:l}=(0,C.useSettings)(),d=De(),{translate:n}=(0,C.useI18n)(),A=b(),s=(r,t)=>{l(f=>({...f,[r]:t}))},v=r=>{if(!o[r]||o[r]!==m[r]||confirm(n("network key confirm"))){let t=new Uint8Array(16);window.crypto.getRandomValues(t);let f=[...t].map(c=>c.toString(16).padStart(2,"0")).join("");s(r,f)}},q=r=>{let t=o[r];!t||/[0-9a-fA-F]{32}/.test(t)||(alert(n("Invalid network key")),s(r,m[r]))},_=(r,t)=>{t.stopPropagation(),t.preventDefault();let c=(t.clipboardData||window.clipboardData).getData("Text");c&&(c=c.trim().replace(/0x/g,"").replace(/[^0-9a-fA-F]+/g,"").toLowerCase().slice(0,32)),s(r,c)},[k,B]=e.default.useState([]);return e.default.useEffect(()=>{A.listSerialPorts().then(r=>{r.length&&B(r)}).catch(r=>{console.error(`Cannot retrieve serial ports: ${r}`)})},[]),e.default.createElement("div",{className:d.root},e.default.createElement(u.default,{container:!0,spacing:8},e.default.createElement(u.default,{container:!0,item:!0,xs:12,sm:!0,spacing:2,direction:"column"},e.default.createElement(u.default,{item:!0,xs:!0},e.default.createElement(H,{options:k,freeSolo:!0,forcePopupIcon:!0,noOptionsText:"",autoSelect:!0,clearOnBlur:!0,onChange:(r,t)=>s("serialport",t!=null?t:""),renderInput:r=>e.default.createElement(F.default,{...r,label:n("Select serial port"),margin:"normal"}),value:o.serialport}),e.default.createElement(w.default,{variant:"body2"},n("hosted port tip"))),e.default.createElement(u.default,{item:!0,xs:!0},e.default.createElement(x.default,{label:n("Write a detailed logfile"),control:e.default.createElement(I.default,{checked:o.writeLogFile,onChange:(r,t)=>s("writeLogFile",t)})}),e.default.createElement(w.default,{variant:"body2"},n("This should only be set for debugging purposes."))),e.default.createElement(u.default,{item:!0,xs:!0},e.default.createElement(x.default,{label:n("Preserve state names"),control:e.default.createElement(I.default,{checked:o.preserveStateNames,onChange:(r,t)=>s("preserveStateNames",t)})})),e.default.createElement(u.default,{item:!0,xs:!0},e.default.createElement(x.default,{label:e.default.createElement(e.default.Fragment,null,n("Legacy switch compatibility")," ",e.default.createElement(P,{tooltip:n("switch compat tooltip")})),control:e.default.createElement(I.default,{checked:o.switchCompat,onChange:(r,t)=>s("switchCompat",t)})}))),e.default.createElement(u.default,{item:!0,xs:12,sm:7,className:d.keyGrid},e.default.createElement(w.default,{variant:"body1",className:d.keyGridLabel},n("Network keys for secure communication"),e.default.createElement(P,{tooltip:n("network key tooltip")})),Pe.map(([r,t,f])=>e.default.createElement(e.default.Fragment,{key:`security-class-${r}`},e.default.createElement(F.default,{className:d.keyGrid_TextField,label:f,inputProps:{maxLength:32,style:{fontFamily:"monospace"},onPaste:_.bind(void 0,t)},fullWidth:!0,InputLabelProps:{shrink:!!o[t]},value:o[t],onChange:c=>s(t,c.target.value),onBlur:()=>q(t)}),e.default.createElement(te.default,{className:d.keyGrid_Button,variant:"contained",color:"primary",startIcon:e.default.createElement(ee.default,null),onClick:()=>v(t),style:{whiteSpace:"nowrap"}},n("Generate key")))))),e.default.createElement($,null))}),Le=o=>{o.networkKey&&(o.networkKey_S0=o.networkKey,delete o.networkKey)},Ke={en:ce(),de:ue(),ru:me(),pt:de(),nl:fe(),fr:ge(),it:ye(),es:ve(),pl:ke(),"zh-cn":be()},Ne=()=>e.default.createElement(R.SettingsApp,{name:"zwave2",afterLoad:Le,translations:Ke},e.default.createElement(Fe,null));Z.default.render(e.default.createElement(Ne,null),document.getElementById("root"));
//# sourceMappingURL=index.js.map
