class Age {
  constructor(pool) {
    this.pool = pool;
  }

  async extractAndInsertData() {
    let client;
    try {
      client = await this.pool.connect();
  
      // Vérification de l'existence de la contrainte num_unique
      const { rows } = await client.query(`
        SELECT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'num_unique' 
          AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        );
      `);
  
      const constraintExists = rows[0].exists;
  
      if (!constraintExists) {
        // Ajout de la contrainte unique sur la colonne num
        await client.query(`
          ALTER TABLE t_age
          ADD CONSTRAINT num_unique UNIQUE (num);
        `);
      }
  
      // Modification de la colonne num de la table t_age pour afficher uniquement les 8 derniers chiffres
      await client.query(`
        ALTER TABLE t_age
        ALTER COLUMN num TYPE VARCHAR(8) USING num::VARCHAR(8);
      `);
  
      // Insertion des données dans la table t_age
      const queryResult = await client.query(`
        INSERT INTO t_age (num, first_call_date, last_call_date, age)
        SELECT DISTINCT a_msisdn AS num,
               MIN(TO_DATE(CONCAT(SUBSTR(orig_start_time, 5, 2), '/', SUBSTR(orig_start_time, 3, 2), '/', SUBSTR(orig_start_time, 1, 2)), 'DD/MM/YYYY')) AS first_call_date,
               MAX(TO_DATE(CONCAT(SUBSTR(orig_start_time, 5, 2), '/', SUBSTR(orig_start_time, 3, 2), '/', SUBSTR(orig_start_time, 1, 2)), 'DD/MM/YYYY')) AS last_call_date,
               (MAX(TO_DATE(CONCAT(SUBSTR(orig_start_time, 5, 2), '/', SUBSTR(orig_start_time, 3, 2), '/', SUBSTR(orig_start_time, 1, 2)), 'DD/MM/YYYY')) - 
                MIN(TO_DATE(CONCAT(SUBSTR(orig_start_time, 5, 2), '/', SUBSTR(orig_start_time, 3, 2), '/', SUBSTR(orig_start_time, 1, 2)), 'DD/MM/YYYY'))) AS age
        FROM t_msc_cdr
        GROUP BY a_msisdn
        ON CONFLICT (num) DO UPDATE SET first_call_date = EXCLUDED.first_call_date, last_call_date = EXCLUDED.last_call_date, age = EXCLUDED.age;
      `);
  
      console.log('Données insérées avec succès dans t_age.');
    } catch (error) {
      console.error('Erreur lors de l\'extraction et de l\'insertion des données:', error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  }  
}  

module.exports = Age;
