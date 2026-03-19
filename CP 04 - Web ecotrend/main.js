let produtos=[]
let carrinho=JSON.parse(localStorage.getItem('carrinho'))||[]

async function carregar(){
 const res=await fetch('produtos.json')
 produtos=await res.json()
 render(produtos)
 renderCarrinho()
}

function render(lista){
 const div=document.getElementById('produtos')
 div.innerHTML=''
 lista.forEach(p=>{
  const preco=p.preco.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
  const old=p.preco_original>p.preco?`<span class='old'>${p.preco_original.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>`:''
  const stars='⭐'.repeat(Math.round(p.avaliacoes?.media||4))

  const el=document.createElement('div')
  el.className='card'
  el.innerHTML=`
    <img src="${p.imagens?.[0]||''}">
    <h2>${p.nome}</h2>
    <p>${p.descricao}</p>
    <div class="price">${preco} ${old}</div>
    <div class="stars">${stars}</div>
    <button onclick="add('${p.id}')">Adicionar</button>
  `
  div.appendChild(el)
 })
}

function add(id){
 const p=produtos.find(x=>x.id===id)
 const item=carrinho.find(x=>x.id===id)
 if(item){item.qtd+=1}else{carrinho.push({...p,qtd:1})}
 salvar();renderCarrinho()
}

function remover(id){
 carrinho=carrinho.filter(x=>x.id!==id)
 salvar();renderCarrinho()
}

function salvar(){localStorage.setItem('carrinho',JSON.stringify(carrinho))}

function renderCarrinho(){
 const cont=document.getElementById('carrinho-itens')
 const totalEl=document.getElementById('carrinho-total')
 const countEl=document.getElementById('cart-count')
 const totalTop=document.getElementById('cart-total')

 if(carrinho.length===0){
  cont.innerHTML='<p>Vazio</p>';totalEl.innerHTML='';countEl.textContent=0;totalTop.textContent='R$ 0,00';return
 }

 cont.innerHTML=carrinho.map(i=>`
  <div class="item">
    <span>${i.nome} x${i.qtd}</span>
    <span>${(i.preco*i.qtd).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
    <button onclick="remover('${i.id}')">X</button>
  </div>
 `).join('')

 const total=carrinho.reduce((a,i)=>a+i.preco*i.qtd,0)
 totalEl.innerHTML=`<strong>Total: ${total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong>`
 countEl.textContent=carrinho.length
 totalTop.textContent=total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
}

function filtrar(cat){
 if(cat==='todos') render(produtos)
 else render(produtos.filter(p=>p.categoria===cat))
}

carregar()
