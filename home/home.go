/*
 * Simple no-frills package for, you guessed it, rendering the home page.
 * Giving the home page it's own package seems like overkill, but it's better
 * than stuffing it inside the main file
 * * * * */

package home

import (
  "html/template"
  "net/http"
)

var templates *template.Template

// Parse both the home page as well as the header and footer partials
func InitTemplates() {
  templates = template.Must(template.ParseFiles("templates/home/home.html" ))
}

// Simplest function ever (not really).  Execute the home template
func HomeHandler(w http.ResponseWriter, r *http.Request) {
  templates.ExecuteTemplate(w, "home.html", nil)
}
