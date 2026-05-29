const P = {
  compute:{
    AWS:{
      "t3.micro":{p:0.0104},"t3.small":{p:0.0208},"t3.medium":{p:0.0416},"t3.large":{p:0.0832},
      "m5.large":{p:0.096},"m5.xlarge":{p:0.192},"m5.2xlarge":{p:0.384},
      "c5.large":{p:0.085},"c5.xlarge":{p:0.17},"r5.large":{p:0.126}
    },
    GCP:{
      "e2-micro":{p:0.0084},"e2-small":{p:0.0134},"e2-medium":{p:0.0268},
      "n1-standard-1":{p:0.0475},"n1-standard-2":{p:0.095},"n1-standard-4":{p:0.19},
      "n2-standard-2":{p:0.0971},"n2-standard-4":{p:0.1942},"c2-standard-4":{p:0.2088}
    },
    Azure:{
      "B1s":{p:0.0104},"B2s":{p:0.0416},"D2s_v3":{p:0.096},"D4s_v3":{p:0.192},
      "D8s_v3":{p:0.384},"E2s_v3":{p:0.126},"F2s_v2":{p:0.085},"F4s_v2":{p:0.17}
    }
  },
  storage:{
    AWS:{
      "S3 Standard":{ppg:0.023,free:5},"S3 Infrequent Access":{ppg:0.0125,free:0},
      "S3 Glacier":{ppg:0.004,free:0},"EBS gp3":{ppg:0.08,free:30}
    },
    GCP:{
      "Cloud Storage Standard":{ppg:0.02,free:5},"Cloud Storage Nearline":{ppg:0.01,free:0},
      "Cloud Storage Coldline":{ppg:0.004,free:0},"Persistent Disk SSD":{ppg:0.17,free:30}
    },
    Azure:{
      "Blob Hot Tier":{ppg:0.018,free:5},"Blob Cool Tier":{ppg:0.01,free:0},
      "Blob Archive":{ppg:0.00099,free:0},"Managed Disk P10":{ppg:0.095,free:32}
    }
  },
  database:{
    AWS:{
      "RDS MySQL t3.micro":{p:0.017},"RDS MySQL t3.small":{p:0.034},"RDS MySQL m5.large":{p:0.171},
      "RDS Postgres t3.micro":{p:0.017},"RDS Postgres m5.large":{p:0.171},"Aurora Serverless v2":{p:0.12}
    },
    GCP:{
      "Cloud SQL MySQL Shared":{p:0.0105},"Cloud SQL MySQL n1-s1":{p:0.0965},
      "Cloud SQL MySQL n1-s2":{p:0.1929},"Cloud SQL Postgres Shared":{p:0.0105},
      "Cloud SQL Postgres n1-s2":{p:0.1929},"Cloud Spanner":{p:0.90}
    },
    Azure:{
      "Azure SQL Basic":{p:0.0067},"Azure SQL S1":{p:0.03},"Azure SQL S3":{p:0.15},
      "Azure DB MySQL B1":{p:0.018},"Azure DB MySQL GP2":{p:0.17},"Cosmos DB Serverless":{p:0.25}
    }
  },
  networking:{
    AWS:{
      "Data Transfer Out":{ppg:0.09,free:1},"CloudFront CDN":{ppg:0.0085,free:1024},
      "Data Transfer In":{ppg:0,free:999999},"NAT Gateway":{ppg:0.045,free:0}
    },
    GCP:{
      "Egress Americas/EU":{ppg:0.08,free:1},"Egress Asia/APAC":{ppg:0.12,free:1},
      "Cloud CDN":{ppg:0.008,free:0},"Ingress":{ppg:0,free:999999}
    },
    Azure:{
      "Outbound Zone 1":{ppg:0.087,free:5},"Outbound Zone 2":{ppg:0.083,free:5},
      "Azure CDN":{ppg:0.0075,free:0},"Inbound":{ppg:0,free:999999}
    }
  }
};

const PROVIDERS = ['AWS','GCP','Azure'];
const state = {compute:false,storage:false,database:false,networking:false};

function pop(id,keys){ document.getElementById(id).innerHTML=keys.map(k=>`<option value="${k}">${k}</option>`).join(''); }
function upd(inp,lbl,fmt){ document.getElementById(lbl).textContent=fmt(parseInt(document.getElementById(inp).value)); }
function gv(id){ return document.getElementById(id).value; }
function gi(id){ return parseInt(document.getElementById(id).value)||0; }
function gf(id){ return parseFloat(document.getElementById(id).value)||0; }
function money(n){ return '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); }

function flipToggle(s){
  state[s]=!state[s];
  document.getElementById('toggle-'+s).classList.toggle('on',state[s]);
  document.getElementById('body-'+s).classList.toggle('open',state[s]);
}
function toggleSection(s){
  if(!state[s]) return;
  document.getElementById('body-'+s).classList.toggle('open');
}

function calcCosts(){
  const res={};
  PROVIDERS.forEach(prov=>{
    const pk=prov.toLowerCase();
    let total=0; const bd={};

    if(state.compute){
      const inst=gv('compute-'+pk);
      const count=gi('compute-count');
      const hours=gi('compute-hours');
      const tbl=P.compute[prov];
      const rate=(tbl[inst]||Object.values(tbl)[0]).p;
      bd.compute=+(rate*hours*count).toFixed(2);
      total+=bd.compute;
    }
    if(state.storage){
      const tier=gv('storage-'+pk);
      const gb=gf('storage-gb');
      const tbl=P.storage[prov];
      const info=tbl[tier]||Object.values(tbl)[0];
      bd.storage=+(Math.max(0,gb-info.free)*info.ppg).toFixed(2);
      total+=bd.storage;
    }
    if(state.database){
      const inst=gv('database-'+pk);
      const hours=gi('db-hours');
      const sg=gf('db-storage');
      const tbl=P.database[prov];
      const info=tbl[inst]||Object.values(tbl)[0];
      bd.database=+(info.p*hours + sg*0.115).toFixed(2);
      total+=bd.database;
    }
    if(state.networking){
      const tier=gv('networking-'+pk);
      const gb=gf('networking-gb');
      const tbl=P.networking[prov];
      const info=tbl[tier]||Object.values(tbl)[0];
      bd.networking=+(Math.max(0,gb-info.free)*info.ppg).toFixed(2);
      total+=bd.networking;
    }

    res[prov]={total:+total.toFixed(2),bd};
  });
  const totals={};
  PROVIDERS.forEach(p=>totals[p]=res[p].total);
  const cheapest=PROVIDERS.reduce((a,b)=>totals[a]<=totals[b]?a:b);
  return {res,totals,cheapest};
}

function calculate(){
  if(!Object.values(state).some(Boolean)){
    alert('Please enable at least one service using the toggle switches.');
    return;
  }
  const {res,totals,cheapest}=calcCosts();
  const maxVal=Math.max(...Object.values(totals));
  const colorMap={AWS:'aws',GCP:'gcp',Azure:'azure'};
  const nameMap={AWS:'Amazon Web Services',GCP:'Google Cloud Platform',Azure:'Microsoft Azure'};
  const lblMap={compute:'Compute',storage:'Storage',database:'Database',networking:'Network'};

  // update sidebar badges
  ['compute','storage','database','networking'].forEach(s=>{
    const badge=document.getElementById('badge-'+s);
    if(state[s]&&res.AWS.bd[s]!==undefined){
      badge.textContent=money(res.AWS.bd[s]);
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }
  });

  let html='';

  // Summary bar
  html+=`<div class="summary-bar"><h3>Monthly cost comparison</h3><div class="bar-chart">`;
  PROVIDERS.forEach(p=>{
    const pct=maxVal>0?(totals[p]/maxVal*100).toFixed(1):0;
    html+=`<div class="bar-row">
      <span class="bar-label">${p}</span>
      <div class="bar-track"><div class="bar-fill bar-fill-${colorMap[p]}" style="width:${pct}%"></div></div>
      <span class="bar-amount">${money(totals[p])}/mo</span>
    </div>`;
  });
  html+=`</div></div>`;

  // Cards
  PROVIDERS.forEach(p=>{
    const d=res[p];
    const cls=colorMap[p];
    const isBest=p===cheapest;
    html+=`<div class="provider-card${isBest?' cheapest':''}">
      <div class="provider-header">
        <div class="provider-logo logo-${cls}">${p}</div>
        <span class="provider-name">${nameMap[p]}</span>
        <span class="best-badge${isBest?' visible':''}">Lowest cost</span>
        <span class="provider-total">${money(d.total)}<span>/mo</span></span>
      </div>
      <div class="breakdown-grid">`;
    Object.entries(d.bd).forEach(([k,v])=>{
      html+=`<div class="breakdown-cell"><div class="bc-label">${lblMap[k]||k}</div><div class="bc-value">${money(v)}</div></div>`;
    });
    html+=`</div><div class="yearly-row">Yearly estimate: ${money(d.total*12)}/yr</div></div>`;
  });

  document.getElementById('results').innerHTML=html;
}

// Populate all dropdowns on load
pop('compute-aws',   Object.keys(P.compute.AWS));
pop('compute-gcp',   Object.keys(P.compute.GCP));
pop('compute-azure', Object.keys(P.compute.Azure));
pop('storage-aws',   Object.keys(P.storage.AWS));
pop('storage-gcp',   Object.keys(P.storage.GCP));
pop('storage-azure', Object.keys(P.storage.Azure));
pop('database-aws',  Object.keys(P.database.AWS));
pop('database-gcp',  Object.keys(P.database.GCP));
pop('database-azure',Object.keys(P.database.Azure));
pop('networking-aws',   Object.keys(P.networking.AWS));
pop('networking-gcp',   Object.keys(P.networking.GCP));
pop('networking-azure', Object.keys(P.networking.Azure));