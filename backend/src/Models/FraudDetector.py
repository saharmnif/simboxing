import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
import matplotlib.pyplot as plt
import joblib

joblib.dump(model, 'trained_model.pkl')

# Load the dataset
data = pd.read_csv('../backend/Data/msc 1.csv')  # Replace with your actual data path
data.head()

# Check for missing values
missing_values = data.isnull().sum()
print(missing_values)

# Feature engineering
# Extract features from ORIG_START_TIME
data['day_of_week'] = pd.to_datetime(data['ORIG_START_TIME']).dt.dayofweek
data['hour_of_day'] = pd.to_datetime(data['ORIG_START_TIME']).dt.hour
# ... (consider time zone if relevant)

# Extract call duration
data['duration_minutes'] = data['EVENT_DURATION'].apply(lambda x: int(x.split(':')[0]))

# International roaming indicator
data['is_roaming'] = data['roamingCallForwarding'].apply(lambda x: 1 if 'roaming' in x.lower() else 0)

# Handle categorical features
categorical_features = ['RECORD_TYPE', 'SUBSCRIBER_TYPE', 'TRUNK_IN','TRUNK_OUT']  # Adjust based on your data
encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')  # Consider different encoding methods
categorical_data = encoder.fit_transform(data[categorical_features])
data = pd.concat([data.drop(categorical_features, axis=1), pd.DataFrame(categorical_data, columns=encoder.get_feature_names_out(categorical_features))], axis=1)

# Feature scaling
numerical_features = ['scaled_amount', 'scaled_time', 'duration_minutes', 'is_roaming', 'day_of_week', 'hour_of_day']  # Adjust based on your features
scaler = StandardScaler()
data[numerical_features] = scaler.fit_transform(data[numerical_features])

# Define features and target
X = data.drop('Class', axis=1)
y = data['Class']

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f'Training set size: {X_train.shape[0]}')
print(f'Testing set size: {X_test.shape[0]}')

# Initialize and train the XGBClassifier
model = XGBClassifier(n_estimators=100, random_state=42, use_label_encoder=False, eval_metric='logloss')
model.fit(X_train, y_train)

# Perform predictions
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

# Evaluate the model
classification_rep = classification_report(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_prob)

print("Classification Report:")
print(classification_rep)
print("Confusion Matrix:")
print(conf_matrix)
print("ROC AUC Score:")
print(roc_auc)

# Plot ROC Curve
fpr, tpr, thresholds = roc_curve(y_test, y_prob)
plt.figure(figsize=(10, 6))
plt.plot(fpr, tpr, label=f'XGBoost (area = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], 'k--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic (ROC) Curve')
plt.legend(loc="lower right")
plt.show()
