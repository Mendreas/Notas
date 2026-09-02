(()=>{
  const api=window.NOTE_TECHNICAL;if(!api?.families)return;
  Object.assign(api.families,{
    NZD:{
      material:'Polímero',
      dimensions:{5:'135 × 66 mm',10:'140 × 68 mm',20:'145 × 70 mm',50:'150 × 72 mm',100:'155 × 74 mm'},
      security:'Série 7 em polímero com grande janela holográfica, feto e mapa da Nova Zelândia, ave com mudança de cor, número formado por elementos frente/verso e impressão em relevo. A série 6, também em polímero, continua igualmente em circulação.',
      circulation:'As séries 6 e 7 circulam em paralelo e ambas têm curso legal. Existem cinco denominações correntes: 5, 10, 20, 50 e 100 dólares neozelandeses.',
      source:'Reserve Bank of New Zealand — Te Pūtea Matua',sourceUrl:'https://www.rbnz.govt.nz/money-and-cash/banknotes-and-coins/banknotes-in-circulation'
    },
    HKD:{
      material:'Papel; 10 HKD também em polímero',
      dimensions:{10:'134 × 66 mm',20:'143 × 71,5 mm',50:'148 × 74 mm',100:'153 × 76,5 mm',500:'158 × 79 mm',1000:'163 × 81,5 mm'},
      security:'Na série 2018 de 20 a 1 000 HKD: padrão dinâmico cintilante, fio metálico com janela, denominação oculta, impressão em relevo, marca de água melhorada e denominação frente/verso fluorescente. A nota governamental de 10 HKD em polímero usa janela transparente, imagem-sombra da bauínia, imagem-sombra do valor e elemento com mudança de cor.',
      circulation:'As notas da série 2018 circulam juntamente com séries anteriores. As notas emitidas pelos três bancos emissores continuam a ter curso legal independentemente do ano de emissão. A nota de 10 HKD é emitida pelo Governo da Região Administrativa Especial de Hong Kong e existe em versões de papel e polímero.',
      source:'Hong Kong Monetary Authority',sourceUrl:'https://www.hkma.gov.hk/eng/key-functions/money/hong-kong-currency/notes/'
    }
  });
  api.apply?.();
})();
