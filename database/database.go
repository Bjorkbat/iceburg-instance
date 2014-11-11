/*
 * A wrapper for the database.
 * * * * */

package database

import (
  "database/sql"
  _ "github.com/go-sql-driver/mysql"

  "github.com/iceburg-instance/database/db_settings"
)

var db *sql.DB

// Self-explanatory, open a connection, but store the db as a global variable,
// that way parts of the code that need the database can simply call the wrapper
// rather than awkwardly passing around a pointer to the db
func Open() error {

  var err error
  settings := db_settings.GetSettings()
  db, err = sql.Open(settings.DBType, settings.Username + ":" +
    settings.Passwd + "@/" + settings.DBName)
  if err != nil {
    return err
  }

  // No error, so now let's ping the database and see what happens
  err = db.Ping()
  if err != nil {
    return err
  }

  // No error, then return nil and be happy
  return nil
}

// Simple
func Close() {
  db.Close()
  return
}

// Wrapper for exec, which executes a string without returning any rows.
// Good for basically any sql query besides SELECT
func Execute(query string) (sql.Result, error) {
  return db.Exec(query)
}

// Wrapper for QueryRow
func QueryRow(query string, args ...interface{}) *sql.Row {
  return db.QueryRow(query, args)
}
