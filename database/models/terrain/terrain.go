/*
 * Model for terrain data, which for now consists solely of height data
 * * * * */

package terrain

import (
  "strconv"
  "strings"
)

func GetInit() string {
  var qString string = "CREATE TABLE IF NOT EXISTS terrain ( " +
  "id INTEGER PRIMARY KEY, " +
  "height FLOAT )"

  return qString
}

// Hey, string length doesn't matter.  So, generate one massive string to
// the height data.  Will find less hacky solution in the future
func GenInsertBulk(heights []float32) string {

  var insertString string = "INSERT INTO terrain (id, height) VALUES "

  // Now the tricky part.  Loop through the heights slice, and for each value,
  // create a new string representing a tuple to insert into the database
  var tupleString string
  var s []string
  for i := 0; i < len(heights); i ++ {
    tupleString = "(" + strconv.Itoa(i) + ", " + floatToString(heights[i]) + ")"
    if i < len(heights) - 1 {
      s = []string{insertString, tupleString, ","}
      insertString = strings.Join(s, " ")
    } else {
      s = []string{insertString, tupleString}
      insertString = strings.Join(s, " ")
    }
  }

  return insertString
}

// Special function to convert float32 height values into string
func floatToString(f float32) string {
  return strconv.FormatFloat(float64(f), 'f', -1, 32)
}
