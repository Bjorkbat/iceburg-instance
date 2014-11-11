/*
 * Package used for initializing a fresh database, or for syncing it
 * * * * */

package db_init

import (

  "database/sql"
  "fmt"
  _ "github.com/go-sql-driver/mysql"

  "github.com/iceburg-instance/database/db_settings"
  "github.com/iceburg-instance/database/models/user"
  "github.com/iceburg-instance/database/models/session"
)

// Initializes a fresh database.  Also used to reset the database if necessary
// (note,not for long)
func Init() error {
  // first, get the settings
  settings := db_settings.GetSettings()
  // Open the connection
  db, err := sql.Open(settings.DBType, settings.Username + ":" +
    settings.Passwd + "@/" + settings.DBName)

  if err != nil {
    return err
  }
  defer db.Close()

  // Ping to make sure it's really open
  err = db.Ping()
  if err != nil {
    return err
  }

  // Finally, create the necessary tables for the models
  qString := user.GetInit()
  _, err = db.Exec(qString)
  if err != nil {
    return err
  }
  fmt.Println("Added user table")

  qString = session.GetInit()
  _, err = db.Exec(qString)
  if err != nil {
    return err
  }
  fmt.Println("Added session table")

  return nil
}
