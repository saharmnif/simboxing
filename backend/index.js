const { Pool } = require('pg');
const Age = require('../backend/src/Models/Age');
const MO = require('../backend/src/Models/MO');
const MT = require('../backend/src/Models/MT');
const ImporteurDonnees = require('../backend/src/Models/ImporteurDonnees');
const User = require('../backend/src/Models/User');
const Agregation = require('../backend/src/Models/Agregation');
const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const cheminDossier = '../backend/Data';
const ConnexionPostgreSQL = require('../backend/src/Models/ConnexionPostgreSQL');
const HotlistFraud = require('../backend/src/Models/Hotlistfraud');

const app = express();
const port = 3500;

// Définir les informations de connexion à la base de données
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'simboxing',
  password: '1234',
  port: 5432,
});

// Connexion à la base de données
const connexionPostgreSQL = new ConnexionPostgreSQL(pool);

const importeur = new ImporteurDonnees(connexionPostgreSQL.pool);

// Appeler la méthode importerDonneesDossier avec le chemin du dossier contenant les données à importer
importeur.importerDonneesDossier(cheminDossier).then(() => {
  console.log('Importation des données terminée avec succès !');
}).catch((error) => {
  console.error('Erreur lors de l\'importation des données:', error.message);
});

// HotlistFraud 
// Créer une instance de Hotlistfraud
const hotlistFraud = new HotlistFraud(pool);

// Appeler la méthode insererCellIdDeTRegionDansTHotlist
hotlistFraud.insererCellIdDeTRegionDansTHotlist().then((message) => {
  console.log(message);
}).catch((error) => {
  console.error(error.message);
});

// // Hotlist
// const hotlist = new Hotlist(pool);

// hotlist.insertCellIdFromDetail().then(insertedRows => {
//   console.log('Inserted rows:', insertedRows);
// }).catch(err => {
//   console.error('Error inserting cell_id:', err);
// });

//Detection
(async () => {
  try {
    await connexionPostgreSQL.connect();

    const detection = new Detection(connexionPostgreSQL.pool);
    const numeros = await detection.Firstrule();
    console.log("Numéros trouvés :", numeros);
    
  } catch (error) {
    console.error('Erreur lors de la détection :', error.message);
  } finally {
    // Fermer la connexion pool lorsque vous avez fini
    connexionPostgreSQL.pool.end();
  }
})();

// Créer une instance de MO et MT, puis appeler les méthodes d'extraction et d'insertion de données
(async () => {
  try {
    // Check if t_moo table exists
    const moCheckQuery = `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 't_moo')`;
    const moCheckResult = await pool.query(moCheckQuery);

    if (moCheckResult.rows[0].exists) {
      const mo = new MO(connexionPostgreSQL.pool);
      await mo.extractAndInsertData();
      console.log('Données MO insérées avec succès.');
    } else {
      console.error('La table t_moo n\'existe pas.');
    }
    
    const mt = new MT(connexionPostgreSQL.pool);
    await mt.extractAndInsertData();
    console.log('Données MT insérées avec succès.');
  } catch (error) {
    console.error('Erreur lors du traitement des données MO/MT:', error.message);
  }
})();

// Age
const ageProcessor = new Age(pool);

// Appeler la méthode extractAndInsertData pour extraire et insérer les données
ageProcessor.extractAndInsertData().then(() => {
  console.log('Traitement des données d\'âge terminé avec succès.');
}).catch((error) => {
  console.error('Erreur lors du traitement des données d\'âge:', error.message);
});

// Agregation
const connexionAg = new ConnexionPostgreSQL(pool);

(async () => {
  try {
    const aggregation = new Agregation(connexionAg.pool);
    await aggregation.fillAgregationTable();
    console.log('Agrégation des données terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'agrégation des données :', error.message);
  }
})();

// Configuration des middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to test the server 
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre application Node.js !');
});

// Route to test database connection
app.get('/test', async (req, res) => {
  try {
    await pool.connect();
    res.send('Connexion à la base de données PostgreSQL établie avec succès!');
  } catch (error) {
    res.status(500).send(`Erreur lors de la connexion à la base de données: ${error.message}`);
  }
});

// CRUD operations for users
// Retrieve all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.getUsers(pool);
    res.json(users);
  } catch (error) {
    res.status(500).send(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
  }
});

// Retrieve user by id
app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.getById(pool, userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).send('Utilisateur non trouvé');
    }
  } catch (error) {
    res.status(500).send(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
  }
});

// Delete user
app.delete('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.deleteUser(pool, userId);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).send(`Erreur lors de la suppression de l'utilisateur : ${error.message}`);
  }
});

// Add user 
app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;

    if (newUser && newUser.firstname) {
      const addedUser = await User.addUser(pool, newUser);
      res.json(addedUser);
    } else {
      res.status(400).send("Les informations de l'utilisateur sont incorrectes ou manquantes.");
    }
  } catch (error) {
    res.status(500).send(`Erreur lors de l'ajout de l'utilisateur : ${error.message}`);
  }
});

// Update user 
app.put('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUser = req.body;

    const result = await User.updateUser(pool, userId, updatedUser);

    if (result) {
      res.json(result);
    } else {
      res.status(404).send('Utilisateur non trouvé');
    }
  } catch (error) {
    res.status(500).send(`Erreur lors de la mise à jour de l'utilisateur : ${error.message}`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
