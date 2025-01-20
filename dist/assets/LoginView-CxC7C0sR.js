import{f as p,r as n,o as r,g as _,e as N,w as o,b as e,_ as C,d as x,j as D,t as F,k as u,c as b,l as $,n as i,h as L}from"./index-CBL1Pzhd.js";import{_ as V,a as I,b as B,f as w,d as G,g as W,e as A,h as U}from"./RouterLink-40CPGKft.js";const j={__name:"FormResetPasswordInput",props:{divTxt:String,placeholder:String},setup(m){const l=p(""),t=p(!1);return(s,a)=>{const v=n("v-text-field");return r(),_(v,{modelValue:l.value,"onUpdate:modelValue":a[0]||(a[0]=c=>l.value=c),"append-inner-icon":t.value?"mdi-eye-off-outline":"mdi-eye-outline",type:t.value?"text":"password",density:"compact",placeholder:m.placeholder,"prepend-inner-icon":"mdi-lock-outline",variant:"outlined","onClick:appendInner":a[1]||(a[1]=c=>t.value=!t.value),clearable:""},null,8,["modelValue","append-inner-icon","type","placeholder"])}}},J={key:1},M={key:0},q={key:0},H={__name:"LoginForm",setup(m){const l=N(),t=p(!1),s=p(!1),a=()=>{s.value=!0},v=()=>{try{t.value=!0,W(l)}finally{t.value=!1}},c=()=>{A(l)},P=()=>{try{t.value=!0;const y=L.email;U(y),l.push("/")}finally{t.value=!1}};return(y,d)=>{const k=n("v-progress-linear"),R=n("v-alert"),f=n("v-divider"),g=n("v-card"),h=n("v-scale-transition"),z=n("v-dialog"),S=n("v-icon"),E=n("v-container");return r(),_(E,{fluid:""},{default:o(()=>[e(g,{class:"mx-auto pa-8","max-width":"448",rounded:"lg","toolbar-loader":""},{default:o(()=>[e(k,{active:t.value,indeterminate:t.value,absolute:"",bottom:"",color:"red-darken-4"},null,8,["active","indeterminate"]),e(C,{titleText:"Log in",class:"pl-0"}),e(V,{subtitleText:"Account",class:"pl-0 mb-4"}),e(I,{"div-txt":"Email"}),e(B,{"div-txt":"Password",placeholder:"Enter your password"}),x(w)?(r(),_(R,{key:0,dense:"",outlined:"",type:"error"},{default:o(()=>[D(F(x(w)),1)]),_:1})):u("",!0),x(w)?(r(),b("br",J)):u("",!0),e(f,{class:"py-3"}),e(g,{class:"mb-6",color:"surface-variant",variant:"tonal"},{default:o(()=>[e($,{class:"text-medium-emphasis text-caption",html:`Warning: after 3 consecutive failed login attempts,
                you account will be temporarily locked for three hours. <br>
                If you must login now, or forgot your password,
                you can also click 'Forgot login password?''
                below to reset the login password.`})]),_:1}),e(i,{block:"",variant:"tonal",color:"warning",size:"large",btnText:"Forgot login password? Click here",onClick:a,class:"text-none px-0 mb-4 rounded-pill",appendIcon:"mdi-cursor-default-click-outline"}),e(z,{modelValue:s.value,"onUpdate:modelValue":d[1]||(d[1]=T=>s.value=T)},{default:o(()=>[e(g,{width:"440",class:"mx-auto pa-8"},{default:o(()=>[e(k,{active:t.value,indeterminate:t.value,absolute:"",bottom:"",color:"red-darken-4"},null,8,["active","indeterminate"]),e(C,{"title-text":"Reset your password",class:"pl-0"}),e(V,{subtitleText:"Account",class:"pl-0 mb-4"}),e(I,{"div-txt":"Email"}),e(j,{"div-txt":"New Password",placeholder:"Enter your new password"}),e(f,{class:"py-3"}),e(h,null,{default:o(()=>[t.value?u("",!0):(r(),b("div",M,[e(i,{block:"",variant:"tonal",color:"primary",size:"large",btnText:"Reset",onClick:P,class:"text-none mx-auto rounded-pill"}),e(i,{block:"",variant:"tonal",color:"error",size:"large",btnText:"Close",class:"text-none mx-auto mt-8 rounded-pill",onClick:d[0]||(d[0]=T=>s.value=!1)})]))]),_:1})]),_:1})]),_:1},8,["modelValue"]),e(f,{class:"py-3"}),e(h,null,{default:o(()=>[t.value?u("",!0):(r(),b("div",q,[e(i,{block:"",color:"primary",size:"large",variant:"tonal","append-icon":"mdi-login",btnText:"Log in",onClick:v,class:"text-none mb-8 rounded-pill"}),e(i,{block:"",color:"error",size:"large",variant:"tonal",btnText:"Sign in with Google",onClick:c,class:"text-none mb-8 rounded-pill"},{default:o(()=>[e(S,{size:"24",class:"ml-4",icon:"mdi-google"})]),_:1})]))]),_:1}),e($,{class:"text-subtitle-1 text-medium-emphasis pl-0 pt-0",cardText:"Not registered yet? Join now and start exploring!"}),e(G,{to:"/register",class:"text-decoration-none"},{default:o(()=>[e(i,{block:"",size:"large",color:"secondary",variant:"tonal",btnText:"Sign up",class:"text-none rounded-pill",prependIcon:"mdi-chevron-left"})]),_:1})]),_:1})]),_:1})}}},Q={__name:"LoginView",setup(m){return(l,t)=>{const s=n("v-container"),a=n("v-responsive");return r(),_(a,null,{default:o(()=>[e(s,{fluid:""},{default:o(()=>[e(H)]),_:1})]),_:1})}}};export{Q as default};
