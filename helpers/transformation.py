import pandas as pd

# Load the CSV file
input_file = 'region.csv'  # Replace with your actual input file path
output_file = 'output.csv'  # Desired output file path

# Load the CSV into a DataFrame
df = pd.read_csv(input_file, encoding='ISO-8859-1', sep=';')

# Define a function to clean each field in the DataFrame
def clean_field(value):
    if isinstance(value, str):
        # Replace special characters
        value = value.replace('�', '')
        # Strip leading and trailing whitespace
        value = value.strip()
        # Replace multiple spaces with a single space
        value = ' '.join(value.split())
        # Return the cleaned value
    return value

# Apply the cleaning function to all fields in the DataFrame
df = df.applymap(clean_field)

# Standardize the 'REGION' column
df['REGION'] = df['REGION'].str.lower().str.title()

# Save the cleaned DataFrame to a new CSV file
df.to_csv(output_file, index=False, sep=';')

print(f"Cleaned data saved to {output_file}")