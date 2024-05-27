const { Pool } = require('pg');

class Agregation {
  constructor(pool) {
    this.pool = pool;
  }

  async fillAgregationTable() {
    const client = await this.pool.connect();

    try {
      // Remplir le champ a_msisdn à partir de la table t-msc_cdr_detail
      await client.query(`
        INSERT INTO t_agg (a_msisdn)
        SELECT t.a_msisdn
        FROM t_msc_cdr AS t
        WHERE NOT EXISTS (
          SELECT 1
          FROM t_agg AS a
          WHERE a.a_msisdn = t.a_msisdn)
        ON CONFLICT (a_msisdn) DO NOTHING;
      `);

      // NbCall_Mo
      await client.query(`
        MERGE INTO t_agg AS target
        USING (
          SELECT a_msisdn, COUNT(*) AS new_count
          FROM t_mo
          GROUP BY a_msisdn
        ) AS source ON target.a_msisdn = source.a_msisdn
        WHEN MATCHED THEN
          UPDATE SET nbcall_mo = COALESCE(target.nbcall_mo, 0) + source.new_count
        WHEN NOT MATCHED THEN
          INSERT (a_msisdn, nbcall_mo) VALUES (source.a_msisdn, source.new_count);
      `);

      // NbCall_MT
      await client.query(`
        MERGE INTO t_agg AS target
        USING (
          SELECT a_msisdn, COUNT(*) AS new_count
          FROM t_mt
          GROUP BY a_msisdn
        ) AS source ON target.a_msisdn = source.a_msisdn
        WHEN MATCHED THEN
          UPDATE SET nbcall_mt = COALESCE(target.nbcall_mt, 0) + source.new_count
        WHEN NOT MATCHED THEN
          INSERT (a_msisdn, nbcall_mt) VALUES (source.a_msisdn, source.new_count);
      `);

      // Duration_MO
      await client.query(`
        MERGE INTO t_agg AS target
        USING (
          SELECT a_msisdn, AVG(event_duration::bigint) AS total_duration
          FROM t_mo
          GROUP BY a_msisdn
        ) AS source ON target.a_msisdn = source.a_msisdn
        WHEN MATCHED THEN
          UPDATE SET avg_duration_mo = COALESCE(target.avg_duration_mo, 0) + source.total_duration
        WHEN NOT MATCHED THEN
          INSERT (a_msisdn, avg_duration_mo) VALUES (source.a_msisdn, source.total_duration);
      `);

      // Duration_MT
      await client.query(`
        MERGE INTO t_agg AS target
        USING (
          SELECT a_msisdn, AVG(event_duration::bigint) AS total_duration
          FROM t_mt
          GROUP BY a_msisdn
        ) AS source ON target.a_msisdn = source.a_msisdn
        WHEN MATCHED THEN
          UPDATE SET avg_duration_mt = COALESCE(target.avg_duration_mt, 0) + source.total_duration
        WHEN NOT MATCHED THEN
          INSERT (a_msisdn, avg_duration_mt) VALUES (source.a_msisdn, source.total_duration);
      `);

      // Age
      await client.query(`
        MERGE INTO t_agg AS target
        USING (
          SELECT t_agg.a_msisdn, t_age.age
          FROM t_agg
          JOIN t_age ON t_agg.a_msisdn = t_age.num
        ) AS source ON target.a_msisdn = source.a_msisdn
        WHEN MATCHED THEN
          UPDATE SET age = source.age
        WHEN NOT MATCHED THEN
          INSERT (a_msisdn, age) VALUES (source.a_msisdn, source.age);
      `);

      // Bspred_MO
      await client.query(`
        MERGE INTO t_agg AS target
        USING (
          SELECT 
            a_msisdn, 
            (COUNT(DISTINCT b_msisdn) * 10000.0 / COUNT(b_msisdn)) AS bspred_mo
          FROM t_mo
          GROUP BY a_msisdn
        ) AS source ON target.a_msisdn = source.a_msisdn
        WHEN MATCHED THEN
          UPDATE SET bspred_mo = source.bspred_mo
        WHEN NOT MATCHED THEN
          INSERT (a_msisdn, bspred_mo) VALUES (source.a_msisdn, source.bspred_mo);
      `);

      // Nombresms
      await client.query(`
        MERGE INTO t_agg AS target
        USING (
          SELECT 
            a_msisdn, 
            COUNT(*) AS nombresms
          FROM t_msc_cdr
          WHERE call_type='SMS' 
          GROUP BY a_msisdn
        ) AS source ON target.a_msisdn = source.a_msisdn
        WHEN MATCHED THEN
          UPDATE SET nombresms = source.nombresms
        WHEN NOT MATCHED THEN
          INSERT (a_msisdn, nombresms) VALUES (source.a_msisdn, source.nombresms);
      `);

      console.log('Champs de la table t_agg remplis avec succès.');
    } catch (error) {
      console.error('Erreur lors du remplissage de la table t_agg :', error.message);
    } finally {
      client.release();
    }
  }
}

module.exports = Agregation;