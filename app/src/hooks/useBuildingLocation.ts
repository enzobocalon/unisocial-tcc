import cidade from '../assets/images/cidade.png';
import blocos from '../assets/images/bloco.png';
import cantina from '../assets/images/cantina.png';
import biblioteca from '../assets/images/biblioteca.png';
import ensinoInfantil from '../assets/images/ensinoInfantil.png';
import hospitalVeterinario from '../assets/images/hospitalVeterinario.png';
import nucleoDePraticasJuridicas from '../assets/images/nucleoDePraticasJuridicas.png';
import conjuntoPoliesportivo from '../assets/images/conjuntoPoliesportivo.png';
import { useMemo } from 'react';

export function useBuildingLocation() {
  const BUILDINGS = useMemo(
    () => ({
      campus: {
        image: cidade,
      },
      'Bloco 1': {
        image: blocos,
      },
      'Bloco 2': {
        image: blocos,
      },
      'Bloco 3': {
        image: blocos,
      },
      'Bloco 4': {
        image: blocos,
      },
      'Bloco 5': {
        image: blocos,
      },
      'Bloco 8': {
        image: blocos,
      },
      Cantina: {
        image: cantina,
      },
      Biblioteca: {
        image: biblioteca,
      },
      'Ensino Infantil': {
        image: ensinoInfantil,
      },
      'Hospital Veterinário': {
        image: hospitalVeterinario,
      },
      'Núcleo de Práticas Jurídicas': {
        image: nucleoDePraticasJuridicas,
      },
      'Conjunto Poliesportivo': {
        image: conjuntoPoliesportivo,
      },
    }),
    []
  );

  return { BUILDINGS };
}
