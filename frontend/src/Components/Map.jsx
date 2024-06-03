import Map, { Layer, Label, Tooltip, Size } from 'devextreme-react/vector-map';
import { useState, useEffect } from 'react';
import { getCellIdDataFromAPI } from './api'; // Assumer que vous avez une fonction pour récupérer les données des cell_id depuis votre API

export default function App() {
  const [cellIdData, setCellIdData] = useState([]);

  useEffect(() => {
    // Récupérer les données des cell_id depuis votre API
    getCellIdDataFromAPI()
      .then((data) => setCellIdData(data))
      .catch((error) => console.error('Erreur lors de la récupération des données:', error));
  }, []);

  return (
    <Map bounds={mapBounds}>
      <Size height={500} />

      {/* Ajouter une couche pour représenter les cell_id */}
      <Layer
        name="cellIdLayer"
        dataSource={cellIdData}
        // Personnaliser la couleur, la taille ou les autres attributs en fonction des données des cell_id
        customize={(elements) => {
          elements.forEach((element) => {
            // Personnaliser l'apparence des cell_id en fonction des données
            const region = element.attribute('region');
            // Utiliser les données pour personnaliser les éléments de la carte
          });
        }}
      >
        <Label
          dataField="cell_id"
          enabled={true}
        />
      </Layer>

      {/* Ajouter d'autres composants de la carte (tooltip, légende, etc.) si nécessaire */}
      <Tooltip enabled={true} />
    </Map>
  );
}
