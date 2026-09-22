const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup() {
  const store = new Map(); let fail = false;
  const element = () => ({value:'',textContent:'',hidden:false,innerHTML:'',className:'',style:{},classList:{add(){},remove(){},contains(){return false;}},focus(){},appendChild(){},querySelectorAll(){return [];},querySelector(){return element();}});
  const elements = new Map(); const get = id => { if (!elements.has(id)) elements.set(id,element()); return elements.get(id); };
  const context = { console:{error(){},warn(){}}, Date, Blob, Map, Set, URL, setTimeout(){}, window:{dispatchEvent(){}}, CustomEvent:function(){}, localStorage:{getItem:k=>store.get(k)??null,setItem(k,v){if(fail)throw Error('quota');store.set(k,v);},removeItem:k=>store.delete(k)},document:{body:{style:{}},addEventListener(){},getElementById:get,querySelector:get,createElement:element} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('js/catalog-data.js','utf8'),context);
  const admin=fs.readFileSync('js/admin.js','utf8').replace("  document.addEventListener('DOMContentLoaded'", "  window.testApi={state,els,saveState,getFilteredAndSortedItems,handleImportFile,handleConfirmAction,setSaved(items){savedItems=JSON.parse(JSON.stringify(items));},getImport(){return pendingImport;}};\n  document.addEventListener('DOMContentLoaded'");
  vm.runInContext(admin,context);
  const api=context.window.testApi;
  ['confirmTitle','confirmDesc','confirmAction','confirmCancel','modalConfirm','modalItem','itemNome','btnNewItem','categorySelect','itemCategoria','kpiTotalItems','kpiTotalCategories','kpiActiveItems','kpiStorageStatus','tableBody','tableEmptyState'].forEach(k=>api.els[k]=element());
  get('admin-status-filter').value='todos';
  return {data:context.window.GordinhoCatalogData,api,store,get,fail:()=>fail=true};
}
test('exclusão de produto padrão permanece após leitura',()=>{const t=setup(); const items=t.data.getItems(); const id=items[0].id;t.data.saveItems(items.slice(1));assert.equal(t.data.getItems().some(i=>i.id===id),false);});
test('foto e página de referência personalizadas permanecem',()=>{const t=setup();const items=t.data.getItems();items[0].foto='custom.webp';items[0].paginaRef='ref.webp';t.data.saveItems(items);assert.equal(t.data.getItems()[0].foto,'custom.webp');assert.equal(t.data.getItems()[0].paginaRef,'ref.webp');});
test('catálogo vazio é preservado',()=>{const t=setup();t.data.saveItems([]);assert.equal(t.data.getItems().length,0);});
test('falha de gravação retorna erro e reverte estado em memória',()=>{const t=setup();t.api.state.items=[{id:'old'}];t.api.setSaved(t.api.state.items);t.api.state.items.push({id:'new'});t.fail();assert.equal(t.api.saveState(),false);assert.equal(t.api.state.items.length,1);});
test('recentes usa data de criação e filtros respeitam rascunhos',()=>{const t=setup();t.api.state.items=[{id:'old',createdAt:'2025-01-01',ativo:true},{id:'new',createdAt:'2026-09-22',ativo:false},{id:'legacy'}];t.api.state.sortBy='recentes';assert.equal(t.api.getFilteredAndSortedItems()[0].id,'new');t.get('admin-status-filter').value='inactive';assert.equal(t.api.getFilteredAndSortedItems().length,1);});
test('importação rejeita tipos inválidos e IDs repetidos, sem gravar antes da confirmação',async()=>{const t=setup();const item={id:'one',nome:'Produto',categoria:'Teste',especificacao:'Descrição'};await t.api.handleImportFile({target:{files:[{size:50,text:async()=>JSON.stringify([item,{...item},{...item,id:'two',nome:42}])}],value:'file'}});assert.equal(t.api.getImport().length,1);assert.equal(t.store.size,0);assert.match(t.api.els.confirmDesc.textContent,/2 rejeitados/);});
test('importação vazia permite confirmação explícita sem restaurar padrões',async()=>{const t=setup();await t.api.handleImportFile({target:{files:[{size:2,text:async()=>'[]'}],value:'file'}});assert.equal(t.api.getImport().length,0);assert.equal(t.store.size,0);});

test('mesclar importação mantém ausentes, substitui IDs iguais e cria recuperação',async()=>{const t=setup(); const old={id:'one',nome:'Antigo',categoria:'Teste',especificacao:'Spec'};const kept={...old,id:'keep'};t.api.state.items=[old,kept];t.data.saveItems(t.api.state.items);t.api.setSaved(t.api.state.items);await t.api.handleImportFile({target:{files:[{size:10,text:async()=>JSON.stringify([{...old,nome:'Novo'}])}],value:''}});t.get('import-mode').value='merge';t.api.handleConfirmAction();assert.equal(t.data.getItems().length,2);assert.equal(t.data.getItems().find(i=>i.id==='one').nome,'Novo');assert.equal(JSON.parse(t.store.get('gordinho-catalog-recovery'))[0].nome,'Antigo');});
test('substituir com lista vazia mantém catálogo vazio após recarregar',async()=>{const t=setup();t.api.state.items=t.data.getItems();t.api.setSaved(t.api.state.items);await t.api.handleImportFile({target:{files:[{size:2,text:async()=>'[]'}],value:''}});t.get('import-mode').value='replace';t.api.handleConfirmAction();assert.equal(t.data.getItems().length,0);assert.ok(JSON.parse(t.store.get('gordinho-catalog-recovery')).length>0);});
