# Notas do Mundo — v0.10.4

Atlas monetário visual/PWA com navegação por mapa, continente, país, moeda e denominação.

## Estado atual

- cobertura geográfica distribuída por Europa, América do Norte, América do Sul, Ásia, África e Oceania;
- notas com frente/verso, fonte, material, dimensões e estado de circulação quando disponível;
- visualizador ampliado com contexto editorial para frente e verso;
- favoritos, comparação, pesquisa e câmbio;
- imagens locais, oficiais ou de referência conforme a política e disponibilidade de cada emissor;
- tratamento específico para moedas com múltiplos emissores ou restrições de reprodução, como HKD.

## Arquitetura atual

Os ficheiros `data/*.json` fornecem a base. Vários módulos `*-wave.js` e `*-assets.js` completam países, moedas, denominações, imagens e metadados em runtime. As descrições do zoom são divididas entre `note-context-global.js` e as waves editoriais.

Esta arquitetura é funcional, mas dependente da ordem dos scripts. A auditoria técnica está documentada em `AUDIT.md`.

## Nota sobre imagens

A aplicação usa uma combinação de assets locais, imagens oficiais remotas e reproduções de referência. Algumas moedas mantêm apenas ligação à fonte oficial quando não é adequado incorporar uma reprodução integral.