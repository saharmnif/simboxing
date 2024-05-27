class User {
    constructor(databaseConnection) {
      this.db = databaseConnection;
    }
  
    async getUsers() {
      const query = 'SELECT * FROM users';
      const result = await this.db.pool.query(query);
      return result.rows;
    }
    async getById(userId) {
        const query = 'SELECT * FROM users WHERE id_user = $1';
        const values = [userId];
      
        const result = await this.db.pool.query(query, values);
        return result.rows[0];
      }
    async deleteUser(userId) {
      const query = 'DELETE FROM users WHERE id_user = $1 RETURNING *';
      const values = [userId];
  
      const result = await this.db.pool.query(query, values);
      return result.rows[0];
    }
  
async addUser(newUser) {
  const query = 'INSERT INTO users (firstname, lastname, email,  created_at, updated_at , post) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP , $4) RETURNING *';
  const values = [newUser.firstname, newUser.lastname, newUser.email, newUser.post];

  const result = await this.db.pool.query(query, values);
  return result.rows[0];
}

async updateUser(userId, updatedUser) {
    const query = 'UPDATE users SET firstname = $1, lastname = $2, email = $3, updated_at = CURRENT_TIMESTAMP , post = $4 WHERE id_user = $5 RETURNING *';
    const values = [updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.post, userId];
  
    const result = await this.db.pool.query(query, values);
    return result.rows[0];
  }
  }
  
  module.exports = User;
