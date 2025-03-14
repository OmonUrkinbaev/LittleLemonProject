import * as SQLite from 'expo-sqlite';

let db = null;

// Initialize database connection
const getDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('littlelemon.db');
  }
  return db;
};

export const initDatabase = async () => {
  try {
    const database = await getDatabase();
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT,
        category TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Other functions remain similar but use getDatabase()
export const saveMenuItems = async (menuItems) => {
  try {
    const database = await getDatabase();
    await database.withTransactionAsync(async () => {
      await database.runAsync('DELETE FROM menu;');
      for (const item of menuItems) {
        await database.runAsync(
          'INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?);',
          [item.name, item.description, item.price, item.image, item.category]
        );
      }
    });
  } catch (error) {
    console.error('Error saving menu items:', error);
    throw error;
  }
};

export const getMenuItems = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM menu;');
    return result;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const clearMenuItems = async () => {
  try {
    await db.runAsync('DELETE FROM menu;');
  } catch (error) {
    console.error('Error clearing menu items:', error);
    throw error;
  }
};

export const filterByQueryAndCategories = async (query, selectedCategories) => {
  try {
    const database = await getDatabase();
    
    // Build the WHERE clause dynamically
    let whereClause = '';
    const params = [];
    
    // Handle categories filter
    if (selectedCategories.length > 0) {
      whereClause += `category IN (${selectedCategories.map(() => '?').join(',')})`;
      params.push(...selectedCategories);
    }
    
    // Handle search query
    if (query) {
      if (whereClause) whereClause += ' AND ';
      whereClause += `(name LIKE ? OR description LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`);
    }

    // Build the final query
    const sql = `
      SELECT * FROM menu
      ${whereClause ? `WHERE ${whereClause}` : ''}
      ORDER BY name ASC;
    `;

    // Execute the query
    const result = await database.getAllAsync(sql, params);
    return result;
    
  } catch (error) {
    console.error('Error filtering menu items:', error);
    throw error;
  }
};