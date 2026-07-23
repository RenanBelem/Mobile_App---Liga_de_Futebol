import { describe, expect, it } from 'vitest';
import { competicoes, midia, temporadas, times } from '@/dados/dadosbase';

describe('seed inicial da wiki LFA', () => {
  it('carrega times com identidade, logo e fotografia da wiki', () => {
    const estrela = times.find((time) => time.slug === 'estrela-vermelha');

    expect(estrela).toBeDefined();
    expect(estrela?.descricao).toContain('Clube de Futebol');
    expect(estrela?.url_logo).toBeTruthy();
    expect(estrela?.url_foto_capa).toBeTruthy();
    expect(estrela?.titulos?.length).toBeGreaterThan(0);
  });

  it('carrega campeonatos e temporadas com resultados principais', () => {
    const tacaCecilia = competicoes.find((competicao) => competicao.slug === 'taca-cecilia');
    const temporada = temporadas.find((item) => item.slug === 'apertura-26');

    expect(tacaCecilia).toBeDefined();
    expect(tacaCecilia?.descricao?.toLowerCase()).toContain('campeonato');
    expect(tacaCecilia?.url_banner).toBeTruthy();
    expect(temporada?.resumo_competicoes?.length).toBeGreaterThan(0);
  });

  it('carrega mídias com categoria e escopo', () => {
    const primeiraMidia = midia[0];

    expect(primeiraMidia).toBeDefined();
    expect(primeiraMidia?.categoria).toBeTruthy();
    expect(primeiraMidia?.escopo).toBeTruthy();
  });
});
