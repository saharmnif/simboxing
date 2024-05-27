const { Pool } = require('pg');

class MT {
  constructor(pool) {
    this.pool = pool;
  }

  async extractAndInsertData() {
    try {
      const client = await this.pool.connect();

      // Commencer une transaction
      await client.query('BEGIN');

      // Vérifier si des données spécifiques existent déjà dans t_mt
      const alreadyInserted = await this.checkIfDataExists(client);
      if (alreadyInserted) {
        console.log('Les données existent déjà dans la table t_mt. Ignoré.');
        await client.query('ROLLBACK');
        client.release();
        return;
      }

      // Extraction et insertion des données de t_msc_cdr_detail avec record_type = 'mSTerminating'
      await client.query(`
        INSERT INTO t_mt (a_msisdn, b_msisdn, event_duration, start_date, start_hour, cell_id)
        SELECT a_msisdn, b_msisdn, event_duration, start_date, start_hour, cell_id
        FROM t_msc_cdr_detail
        WHERE record_type = 'mSTerminating'
      `);

      await client.query('COMMIT');
      console.log('Données insérées avec succès dans la table t_mt.');
      client.release();
    } catch (error) {
      console.error('Erreur lors de l\'extraction et de l\'insertion des données:', error.message);
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Erreur lors du rollback de la transaction :', rollbackError.message);
      }
      client.release();
    }
  }

  async checkIfDataExists(client) {
    try {
      const result = await client.query(`
        SELECT 1 
        FROM t_mt 
        WHERE EXISTS (
          SELECT 1 
          FROM t_msc_cdr
          WHERE record_type = 'mSTerminating'
            AND t_mt.a_msisdn = t_msc_cdr.a_msisdn
            AND t_mt.b_msisdn = t_msc_cdr.b_msisdn
            AND t_mt.start_date = t_msc_cdr.start_date
            AND t_mt.start_hour = t_msc_cdr.start_hour
            AND t_mt.cell_id = t_msc_cdr.cell_id
        ) 
        LIMIT 1
      `);
      return result.rowCount > 0;
    } catch (err) {
      console.error('Erreur lors de la vérification des données existantes :', err);
      return false;
    }
  }
}

module.exports = MT;
