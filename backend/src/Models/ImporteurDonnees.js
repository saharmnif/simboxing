const fs = require('fs');
const readline = require('readline');

class ImporteurDonnees {
  constructor(pool) {
    this.pool = pool;
  }

  async importerDonneesDossier(cheminDossier) {
    try {
      const fichiers = fs.readdirSync(cheminDossier);
      for (const fichier of fichiers) {
        const cheminFichier = `${cheminDossier}/${fichier}`;
        if (fichier.endsWith('.csv')) {
          const alreadyImported = await this.isFileImported(fichier);
          if (alreadyImported) {
            console.log(`Le fichier ${fichier} a déjà été importé. Ignoré.`);
            continue;
          }
          await this.insertBatch(cheminFichier, fichier);
          await this.markFileAsImported(fichier);
        }
      }
    } catch (err) {
      console.error('Erreur lors de la lecture du dossier :', err);
    }
  }

  async isFileImported(filename) {
    try {
      const result = await this.pool.query('SELECT 1 FROM imported_files WHERE filename = $1 LIMIT 1', [filename]);
      return result.rowCount > 0;
    } catch (err) {
      console.error('Erreur lors de la vérification du fichier importé :', err);
      return false;
    }
  }

  async markFileAsImported(filename) {
    try {
      await this.pool.query('INSERT INTO imported_files (filename) VALUES ($1)', [filename]);
    } catch (err) {
      console.error('Erreur lors de la marque du fichier comme importé :', err);
    }
  }

  async insertBatch(cheminFichier, filename) {
    const fileStream = fs.createReadStream(cheminFichier, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      for await (const line of rl) {
        try {
          const row = line.split(';');
          if (row.length !== 17) {
            console.error(`Erreur: le nombre de colonnes de la ligne n'est pas correct. Ligne ignorée : ${line}`);
            continue;
          }
          await client.query(`
            INSERT INTO t_msc_cdr (
              start_date,
              start_hour,
              a_msisdn,
              a_imsi,
              b_msisdn,
              c_num,
              call_reference,
              call_type,
              cell_id,
              event_duration,
              event_type,
              filename,
              orig_start_time,
              record_type,
              subscriber_type,
              trunk_in, 
              trunk_out 
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
            )
          `, row);
        } catch (error) {
          console.error('Erreur lors de l\'insertion des données :', error);
          throw error;  // Throw the error to rollback the transaction
        }
      }
      await client.query('COMMIT');
      console.log('Importation des données terminée pour le fichier :', cheminFichier);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erreur lors de l\'importation des données :', error);
    } finally {
      client.release();
    }
  }
}

module.exports = ImporteurDonnees;
