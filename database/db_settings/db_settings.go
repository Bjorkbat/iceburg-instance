/*
 * Basically used to define things like what database type you're using, the
 * username, it's password, etc
 * * * * */

package db_settings

type DBSettings struct {
  DBType string       // MySQL, Postgres, SQLite, etc
  Username string     // Self-explanatory
  Passwd string       // also self-explanatory
  DBName string       // the name of the database we're connecting to
}

const db_type string = "mysql"
const db_username string = "iceburg"
const db_passwd string = "1c3burG"
const db_name string = "Iceburg"

// Creates a new DBSettings struct and returns it to caller, presumably so it
// can connect to the database
func GetSettings() *DBSettings {
  return &DBSettings { DBType: db_type, Username: db_username,
    Passwd: db_passwd, DBName: db_name }
}
