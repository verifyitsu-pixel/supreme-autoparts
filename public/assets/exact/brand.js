document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('a').forEach(a=>{try{let u=new URL(a.href);if(u.hostname==='supreme-autoparts.com')a.href=u.pathname+u.search}catch{}});
  const makes=['Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC','Honda','Hyundai','Infiniti','Isuzu','Jaguar','Jeep','Kia','Land Rover','Lexus','Lincoln','Mazda','Mercedes-Benz','Nissan','Pontiac','Porsche','Saab','Saturn','Subaru','Suzuki','Toyota','Volkswagen','Volvo'];
  const parts=['Engine','Transmission','Axle Assembly','Transfer Case','Alternator','Starter','AC Compressor','Steering Rack','Differential','Brake Assembly','Body Part'];
  const groups=[...document.querySelectorAll('input[placeholder="Select make..."]')].map(make=>{let box=make.parentElement?.parentElement;if(!box)return null;let fields=[...box.querySelectorAll('input')];return fields.length>=4?fields.slice(0,4):null}).filter(Boolean);
  function list(input,values,id){let dl=document.getElementById(id);if(!dl){dl=document.createElement('datalist');dl.id=id;dl.innerHTML=values.map(v=>'<option value="'+v+'">').join('');document.body.appendChild(dl)}input.setAttribute('list',id)}
  groups.forEach((fields,i)=>{const [make,model,year,part]=fields;list(make,makes,'supreme-makes');list(part,parts,'supreme-parts');
    make.addEventListener('change',()=>{model.disabled=!make.value;if(make.value)model.focus()});model.addEventListener('change',()=>{year.disabled=!model.value;if(model.value)year.focus()});
    year.type='number';year.min='1980';year.max=String(new Date().getFullYear()+1);year.addEventListener('change',()=>{part.disabled=!year.value;if(year.value)part.focus()});
    const search=()=>{if(make.value&&model.value&&year.value&&part.value)location.href='/shop/?s='+encodeURIComponent([year.value,make.value,model.value,part.value].join(' '))+'&post_type=product'};
    part.addEventListener('change',search);part.addEventListener('keydown',e=>{if(e.key==='Enter')search()});
  });
});