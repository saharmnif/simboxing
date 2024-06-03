const { Pool } = require('pg');

class Detection {
  constructor(pool) {
    this.pool = pool;
  }

  async Firstrule() {
    const id_regle = 111; // Identifiant de la règle à appliquer
    let client; // Déclaration de la variable client

    try {
      client = await this.pool.connect();

      // Récupérer les paramètres de la règle spécifiée
      const paramQuery = `
        SELECT nom_parametre, valeur, comparaison
        FROM parametre
        WHERE id_regle = $1
      `;
      const paramResult = await client.query(paramQuery, [id_regle]);

      if (paramResult.rows.length === 0) {
        throw new Error(`Aucun paramètre trouvé pour la règle ID ${id_regle}`);
      }

      // Construire dynamiquement les conditions de la requête
      const conditions = paramResult.rows.map(param => {
        const column = param.nom_parametre;
        const value = param.valeur;
        const comparison = param.comparaison;

        if (column === 'bspred_mo') {
          // Cast bspred_mo as float to compare with value
          return `CAST(${column} AS FLOAT) ${comparison} ${value}`;
        } else {
          // Cast other columns as bigint to compare with value
          return `CAST(${column} AS BIGINT) ${comparison} ${value}`;
        }
      });

      // Construire la requête principale
      let query = `
        SELECT a_msisdn
        FROM t_agg
        WHERE ${conditions.join(' AND ')}
      `;

      // Exécuter la requête SQL pour récupérer les numéros
      const result = await client.query(query);

      // Insérer les numéros trouvés dans la table alarme
      const insertQuery = `
      INSERT INTO alarme (numero_fraude, date, id_regle)
      SELECT $1::character varying(255), NOW(), $2
      WHERE NOT EXISTS (
        SELECT 1
        FROM alarme
        WHERE numero_fraude = $1
      )
    `;
      for (const row of result.rows) {
        await client.query(insertQuery, [row.a_msisdn, id_regle]);
      }

      // Retourner les numéros trouvés
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de l'exécution de la fonction Firstrule : ${error.message}`);
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}

module.exports = Detection;