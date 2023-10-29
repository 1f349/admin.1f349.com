package main

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/1f349/mjwt"
	"github.com/1f349/mjwt/auth"
	"github.com/1f349/mjwt/claims"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/rs/cors"
)

func main() {
	log.Println("Starting test server")
	signer, err := mjwt.NewMJwtSignerFromFileOrCreate("Test SSO Service", "private.key.local", rand.Reader, 2048)
	if err != nil {
		log.Fatal(err)
	}

	go ssoServer(signer)
	go apiServer(signer)
	done := make(chan struct{})
	<-done
}

func ssoServer(signer mjwt.Signer) {
	r := http.NewServeMux()
	r.HandleFunc("/popup", func(w http.ResponseWriter, r *http.Request) {
		ps := claims.NewPermStorage()
		ps.Set("violet:route")
		ps.Set("violet:redirect")
		ps.Set("domain:owns=example.com")
		ps.Set("domain:owns=example.org")
		accessToken, err := signer.GenerateJwt("81b99bd7-bf74-4cc2-9133-80ed2393dfe6", uuid.NewString(), jwt.ClaimStrings{"d0555671-df9d-42d0-a4d6-94b694251f0b"}, 15*time.Minute, auth.AccessTokenClaims{
			Perms: ps,
		})
		if err != nil {
			http.Error(w, "Failed to generate access token", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Test SSO Service</title>
  <script>
    let loginData = {
      target: "http://localhost:5173",
      userinfo: {
        "aud": "d0555671-df9d-42d0-a4d6-94b694251f0b",
        "email": "admin@localhost",
        "email_verified": true,
        "name": "Admin",
        "preferred_username": "admin",
        "sub": "81b99bd7-bf74-4cc2-9133-80ed2393dfe6",
        "picture": "http://localhost:5173/1f349.svg",
        "updated_at": 0
      },
      tokens: {
        access: "%s",
        refresh: "%s",
      },
    };
    window.addEventListener("load", function () {
      setTimeout(function() {
        window.opener.postMessage(loginData, loginData.target);
      },2000);
    });
  </script>
</head>
<body>
<header>
  <h1>Test SSO Service</h1>
</header>
<main id="mainBody">Loading...</main>
</body>
</html>
`, accessToken, "")
	})
	log.Println("[SSO Server]", http.ListenAndServe(":9090", r))
}

var serveApiCors = cors.New(cors.Options{
	AllowedOrigins: []string{"*"}, // allow all origins for api requests
	AllowedHeaders: []string{"Content-Type", "Authorization"},
	AllowedMethods: []string{
		http.MethodGet,
		http.MethodHead,
		http.MethodPost,
		http.MethodPut,
		http.MethodPatch,
		http.MethodDelete,
		http.MethodConnect,
	},
	AllowCredentials: true,
})

func apiServer(verify mjwt.Verifier) {
	r := http.NewServeMux()
	r.Handle("/v1/violet/route", hasPerm(verify, "violet:route", func(rw http.ResponseWriter, req *http.Request) {
		json.NewEncoder(rw).Encode([]map[string]any{
			{
				"src":    "example.com",
				"dst":    "127.0.0.1:8080",
				"desc":   "This is a test description",
				"flags":  181,
				"active": true,
			},
			{
				"src":    "test.example.com",
				"dst":    "127.0.0.1:8081",
				"desc":   "This is a test description",
				"flags":  17,
				"active": true,
			},
			{
				"src":    "example.org/hello",
				"dst":    "127.0.0.1:8082",
				"desc":   "This is a test description",
				"flags":  16,
				"active": true,
			},
			{
				"src":    "test.example.org/hello",
				"dst":    "127.0.0.1:8083",
				"desc":   "This is a test description",
				"flags":  15,
				"active": true,
			},
		})
	}))
	r.Handle("/v1/violet/redirect", hasPerm(verify, "violet:redirect", func(rw http.ResponseWriter, req *http.Request) {
		json.NewEncoder(rw).Encode([]map[string]any{
			{
				"src":    "example.org",
				"dst":    "127.0.0.1:8084",
				"desc":   "This is a test description",
				"flags":  181,
				"code":   307,
				"active": true,
			},
			{
				"src":    "test.example.org",
				"dst":    "127.0.0.1:8085",
				"desc":   "This is a test description",
				"flags":  17,
				"code":   302,
				"active": true,
			},
			{
				"src":    "example.org/hello",
				"dst":    "127.0.0.1:8086",
				"desc":   "This is a test description",
				"flags":  16,
				"code":   308,
				"active": true,
			},
			{
				"src":    "test.example.org/hello",
				"dst":    "127.0.0.1:8087",
				"desc":   "This is a test description",
				"flags":  15,
				"code":   301,
				"active": true,
			},
		})
	}))

	logger := http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		log.Println("[API Server]", req.URL.String())
		r.ServeHTTP(rw, req)
	})
	http.ListenAndServe(":9095", serveApiCors.Handler(logger))
	log.Println("[API Server]", http.ListenAndServe(":9090", r))
}

func hasPerm(verify mjwt.Verifier, perm string, next func(rw http.ResponseWriter, req *http.Request)) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		a := req.Header.Get("Authorization")
		if !strings.HasPrefix(a, "Bearer ") {
			http.Error(rw, "Missing bearer authorization", http.StatusForbidden)
			return
		}
		_, b, err := mjwt.ExtractClaims[auth.AccessTokenClaims](verify, a[len("Bearer "):])
		if err != nil {
			http.Error(rw, "Invalid token", http.StatusForbidden)
			log.Println("Invalid token:", err)
			return
		}
		if !b.Claims.Perms.Has("violet:route") {
			http.Error(rw, "Missing permission", http.StatusForbidden)
			return
		}
		next(rw, req)
	})
}
