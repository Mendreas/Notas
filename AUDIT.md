# Notas do Mundo — Auditoria técnica v0.10.4

Data: 30-08-2026

## Estado geral

A aplicação está funcionalmente coerente, mas a auditoria encontrou dívida técnica criada pelo crescimento por vagas sucessivas. A prioridade não é reescrever a app: é estabilizar a cadeia atual e reduzir pontos de falha.

## Correções aplicadas nesta auditoria

- Cache da PWA alinhada com a versão v0.10.4 (`notas-mundo-v0104`).
- MXN: removido estado textual de “imagem não incorporada” depois de as imagens oficiais do Banco de México serem efetivamente carregadas.
- CNY: removido estado textual de “imagem não incorporada” depois de os assets locais serem efetivamente carregados.
- Confirmada a ordem das camadas editoriais no zoom: local/Sul da América → wave5 → wave4 → wave3 → wave2 → global/fallback.

## Achados importantes

### 1. Cadeia de `window.fetch` é o maior risco técnico

Grande parte da base de dados final é construída em runtime através de vários ficheiros que substituem sucessivamente `window.fetch`. O resultado depende da ordem exata dos scripts em `index.html`.

Risco: uma alteração futura de ordem pode voltar a introduzir placeholders, metadados antigos, avisos de reprodução desatualizados ou séries erradas.

Recomendação: manter a arquitetura atual nesta versão, mas numa futura limpeza consolidar os overrides num único carregador de dados ou gerar `countries/currencies/notes` finais antes do deploy.

### 2. `data/notes.json` não representa o estado final da aplicação

O ficheiro base ainda contém muitos placeholders. Isso é atualmente intencional porque os wave scripts os substituem em runtime. Uma auditoria apenas ao JSON daria falsos positivos.

Recomendação: não apagar os placeholders agora. Primeiro deve ser consolidada a cadeia de dados.

### 3. Dependências externas impedem offline completo

D3, TopoJSON e o atlas mundial são carregados por CDN. Muitas imagens também permanecem remotas (bancos centrais e Wikimedia Commons).

Risco: num primeiro arranque sem Internet, o mapa e parte das imagens podem não aparecer. Depois de visitadas, algumas imagens podem ficar em cache, mas não há garantia de pré-cache global.

Recomendação: numa versão futura, alojar localmente as bibliotecas essenciais e o ficheiro `countries-110m.json`. Não é necessário descarregar todas as imagens remotas imediatamente.

### 4. Imagens remotas frágeis

Existem URLs diretas para Bank of England, Norges Bank, Riksbank, NBP, CNB, Bank of Guyana, Wikimedia Commons e outros emissores. Mudanças nos sites podem quebrar imagens sem alteração no código.

Casos mais frágeis:
- VES 10/20/50: frente e verso obtidos por crop top/bottom de uma imagem composta via Netlify Image CDN.
- GYD: várias imagens dependem diretamente do site do Bank of Guyana.
- NOK/SEK/PLN/CZK: imagens oficiais remotas com paths internos do emissor.

Recomendação: manter fonte oficial, mas criar progressivamente cache/local mirror apenas para as imagens que apresentem falhas reais.

### 5. Hong Kong é um caso especial correto, mas não “completo” no mesmo sentido

HKD mantém links oficiais em vez de uma reprodução integral única. Isto é coerente porque há vários bancos emissores e múltiplos desenhos por denominação.

A descrição editorial deve continuar a indicar emissor/série em vez de fingir que existe uma única nota HKD por valor.

### 6. Algumas descrições mundiais são deliberadamente de nível temático

As descrições são específicas por denominação na maioria das moedas, mas algumas famílias ainda usam descrição prudente/temática quando a imagem ou série pode variar, nomeadamente HKD, MAD, SRD, VES e parte de GYD/PYG/UYU.

Isto não é erro de execução, mas significa que “cobertura mundial concluída” deve ser entendido como “todas as notas têm contexto”, não como “todos os elementos gráficos foram identificados individualmente”.

### 7. Pequena dívida de interface/documentação

- `app.js` ainda mostra o texto antigo “países na v0.2” na métrica inicial.
- `README.md` ainda descreve a antiga v0.4 e diz que os assets são demonstrativos.
- Existem duas localizações históricas para MKD (`assets/mkd` e `assets/notes/mkd`); a aplicação atual usa `assets/notes/mkd`.

Não afetam o funcionamento, mas devem ser limpas na próxima passagem.

## Cobertura de imagens verificada por arquitetura

A auditoria confirmou mecanismos de imagem para as famílias principais e para as vagas adicionadas posteriormente: Europa adicional, América do Sul, México, China, Singapura, Canadá/Coreia, Noruega/Nova Zelândia, Suécia/Polónia/Chéquia/Roménia, África e famílias finais da Europa.

A presença de um mecanismo não garante que uma URL externa continue online no futuro; por isso a próxima auditoria deve ser uma verificação HTTP/renderização real no deploy.

## Próxima fase recomendada

1. Limpeza pequena e segura: README, texto “v0.2”, diretório MKD duplicado se comprovadamente órfão.
2. Verificação de renderização real no Netlify: abrir todas as denominações e registar imagens 404/403/CORS.
3. Corrigir apenas os links realmente partidos.
4. Só depois considerar consolidação dos wave scripts.

## Critério de fecho da auditoria

A v0.10.4 pode ser considerada estável do ponto de vista estrutural após as correções acima, mas não deve ser considerada “auditada visualmente a 100%” enquanto não for executado o teste HTTP/renderização no domínio Netlify para todas as imagens remotas.