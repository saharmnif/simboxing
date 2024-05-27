const { Pool } = require('pg');
const fs = require('fs');
const csvParser = require('csv-parser');

class ConnexionPostgreSQL {
  constructor() {
    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'simboxing',
      password: '1234',
      port: 5432,
    });
  }

  

  async connect() {
    try {
      await this.pool.connect();
      console.log('Connexion à la base de données établie avec succès!');
    } catch (error) {
      console.error('Erreur lors de la connexion à la base de données:', error.message);
    }
  }





}

module.exports = ConnexionPostgreSQL;
