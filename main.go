/*
 * Main Iceburg backend file.  It's primary function is to respond to a number
 * of command line args, as well as function as a routing file of sorts, taking
 * in urls and passing them along to the appropriate views
 * * * * */

package main

import (
  // Base imports
  "fmt"
  "net/http"
  "os"

  // Custom imports
  "github.com/iceburg-instance/home"
  "github.com/iceburg-instance/public"
)

func main() {

  // Currently only one command line arg defined.  Will add more as needs
  // arise
  args := os.Args
  if len(args) <= 1 {
    // TODO: Print out usage help
    return
  } else {
    switch args[1] {
      case "runserver":
      // Prep the server and run it
      defineRoutes()
      fmt.Println("Server is Running on Port :8080")
      http.ListenAndServe(":8080", nil)
    }
  }
}

// Contrary to the name, this function does more than simply define the routes
// that the server will accept.  It also sets up any templates that the routes
// might need as well.
func defineRoutes() {

  // Static handler
  // TODO: Add function to handle static files
  http.HandleFunc("/public/", public.PublicHandler)

  // Homepage
  home.InitTemplates()
  http.HandleFunc("/", home.HomeHandler)

  // Dashboard
  // TODO: Add functions for working the dashboard, starting with login and
  // signup
}
