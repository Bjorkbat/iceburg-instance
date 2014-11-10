/*
 * Package for handling things like logging in and signing up
 * * * * */

package accounts

import (
  "html/template"
  "net/http"
)

// TODO: Add regex url parsing

var templates *template.Template

func InitTemplates() {
  templates = template.Must(template.ParseFiles(
    "templates/accounts/login.html",
    "templates/accounts/signup.html",
    "templates/partials/header.html",
    "templates/partials/footer.html" ))
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
  templates.ExecuteTemplate(w, "login.html", nil)
}

func SignUpHandler(w http.ResponseWriter, r *http.Request) {
  templates.ExecuteTemplate(w, "signup.html", nil)
}
