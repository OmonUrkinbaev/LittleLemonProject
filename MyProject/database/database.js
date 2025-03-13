import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, image TEXT);',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const saveMenuItems = (menuItems) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      menuItems.forEach(item => {
        tx.executeSql(
          'INSERT INTO menu (name, description, price, image) VALUES (?, ?, ?, ?);',
          [item.name, item.description, item.price, item.image],
          () => {},
          (_, error) => reject(error)
        );
      });
      resolve();
    });
  });
};

export const getMenuItems = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM menu;',
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

export const clearMenuItems = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM menu;',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};