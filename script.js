document.getElementById("year").textContent=new Date().getFullYear();
const phone=document.getElementById("phoneField");
phone.addEventListener("input",()=>{phone.value=phone.value.replace(/\D/g,"").slice(0,10);});
const form=document.getElementById("leadForm"),err=document.getElementById("formError");
form.addEventListener("submit",function(e){
  const value=phone.value;
  if(!/^05\d{8}$/.test(value)){
    e.preventDefault();err.style.display="block";err.textContent="יש להזין מספר נייד ישראלי תקין: בדיוק 10 ספרות המתחילות ב־05";phone.focus();return;
  }
  err.style.display="none";
  window.dataLayer.push({event:"lead_form_submit",form_id:"pirsumix_main_lead_form"});
});
const topBtn=document.getElementById("toTop"),mascot=document.getElementById("mascot");
window.addEventListener("scroll",()=>{
  const y=window.scrollY;
  topBtn.classList.toggle("show",y>500);
  mascot.style.transform=`translateY(${Math.sin(y/180)*28}px) rotate(${y/35}deg)`;
  mascot.style.opacity=y>250?".20":".10";
});
topBtn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
