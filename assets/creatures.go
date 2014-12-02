/*
 * Package for extracting creature data from the database and returning to the
 * calling function
 * * * * */

package assets

import (
  "fmt"
  "github.com/iceburg-instance/database"
  "github.com/iceburg-instance/database/models/creature"
)

type CreatureList struct {
  Creatures []creature.CreatureTuple
}

func GetCreatures() ( *CreatureList, error ) {

  // Generate string to extract all the creatures
  qString := creature.GenAll()
  rows, err := database.Query(qString)
  if err != nil {
    fmt.Println(err)
    return nil, err
  }
  defer rows.Close()

  var creatureSlice []creature.CreatureTuple
  var creatureTuple creature.CreatureTuple

  for rows.Next() {
    creatureTuple = creature.CreatureTuple{}
    if err := rows.Scan(&creatureTuple.CreatureType, &creatureTuple.Count); err != nil {
      fmt.Println(err)
      return nil, err
    }
    creatureSlice = append(creatureSlice, creatureTuple)
  }

  // Create new HeightData struct using heightSlice
  return &CreatureList{Creatures: creatureSlice}, nil

}
