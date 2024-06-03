import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix

# Charger les données
cdr_data = pd.read_csv('msc 1.csv', delimiter=';')

# Afficher les premières lignes pour vérifier le chargement
print(cdr_data.head())

# Encodage des variables catégorielles
label_encoder = LabelEncoder()

# Exemple: Encodage de 'CALL_TYPE' et 'EVENT_TYPE'
cdr_data['CALL_TYPE'] = label_encoder.fit_transform(cdr_data['CALL_TYPE'])
cdr_data['EVENT_TYPE'] = label_encoder.fit_transform(cdr_data['EVENT_TYPE'])

# Vous pouvez encoder d'autres colonnes de la même manière

# Ajout d'une colonne de label (par exemple, pour indiquer la fraude)
# Vous devrez définir vos propres règles pour détecter la fraude
cdr_data['fraud_label'] = cdr_data.apply(lambda row: 1 if some_condition(row) else 0, axis=1)

# Séparer les caractéristiques (features) et les étiquettes (labels)
X = cdr_data.drop('fraud_label', axis=1)
y = cdr_data['fraud_label']

# Séparer les données en ensembles d'entraînement et de test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Créer et entraîner le modèle XGBoost
model = xgb.XGBClassifier()
model.fit(X_train, y_train)

# Prédire sur l'ensemble de test
y_pred = model.predict(X_test)

# Évaluer le modèle
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred))

# Appliquer le modèle sur les données complètes pour identifier les appels frauduleux
cdr_data['fraud_prediction'] = model.predict(X)

# Agréger les résultats par gouvernorat pour identifier celui avec le plus de numéros frauduleux
fraud_by_governorate = cdr_data[cdr_data['fraud_prediction'] == 1].groupby('CELL_ID').size()
print(fraud_by_governorate.sort_values(ascending=False))

# Sauvegarder les résultats
fraud_by_governorate.to_csv('fraud_by_governorate.csv', index=True)

# Affichage des résultats
import matplotlib.pyplot as plt

fraud_by_governorate.sort_values(ascending=False).plot(kind='bar')
plt.title('Nombre de numéros frauduleux par gouvernorat')
plt.xlabel('Gouvernorat')
plt.ylabel('Nombre de numéros frauduleux')
plt.show()
