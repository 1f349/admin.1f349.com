package main

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
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
	r.HandleFunc("/authorize", func(w http.ResponseWriter, r *http.Request) {
		// request url: http://localhost:9090/authorize?response_type=token&redirect_uri=http://localhost:5173/&scope=openid%20profile%20name&client_id=b5a9a8df-827c-4925-b1c1-1940abcf356b
		// redirect url: http://localhost:5173/#access_token=<token>&scope=openid%20profile%20name&token_type=Bearer
		if r.FormValue("response_type") != "token" {
			panic("invalid response_type")
		}
		if r.FormValue("redirect_uri") != "http://localhost:5173/" {
			panic("invalid redirect_uri")
		}
		if r.FormValue("scope") != "openid profile name" {
			panic("invalid scope")
		}
		if r.FormValue("client_id") != "b5a9a8df-827c-4925-b1c1-1940abcf356b" {
			panic("invalid client_id")
		}

		ps := claims.NewPermStorage()
		ps.Set("violet:route")
		ps.Set("violet:redirect")
		ps.Set("azalea:domains")
		ps.Set("domain:owns=example.com")
		ps.Set("domain:owns=example.org")
		accessToken, err := signer.GenerateJwt("81b99bd7-bf74-4cc2-9133-80ed2393dfe6", uuid.NewString(), jwt.ClaimStrings{"b5a9a8df-827c-4925-b1c1-1940abcf356b"}, 15*time.Minute, auth.AccessTokenClaims{
			Perms: ps,
		})
		if err != nil {
			http.Error(w, "Failed to generate access token", http.StatusInternalServerError)
			return
		}
		v := url.Values{}
		v.Set("access_token", accessToken)
		v.Set("scope", "openid profile name")
		v.Set("token_type", "Bearer")
		v.Set("expires_in", "900")
		http.Redirect(w, r, "http://localhost:5173/#"+v.Encode(), http.StatusFound)
	})
	var corsAccessControl = cors.New(cors.Options{
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:5173"
		},
		AllowedMethods:   []string{http.MethodGet, http.MethodOptions},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})
	r.HandleFunc("/userinfo", func(w http.ResponseWriter, r *http.Request) {
		corsAccessControl.ServeHTTP(w, r, func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"aud":"b5a9a8df-827c-4925-b1c1-1940abcf356b","name":"Test User","picture":"https://picsum.photos/id/392/200","profile":"http://localhost:9090/user/test-user","sub":"b429562a-20e9-4466-9e8e-bdeb55f2f4a3@localhost","updated_at":1572278406,"website":""}`))
		})
	})
	log.Println("[SSO Server]", http.ListenAndServe(":9090", r))
}

var serveApiCors = cors.New(cors.Options{
	AllowOriginFunc: func(origin string) bool {
		return origin == "http://localhost:5173"
	}, // allow all origins for api requests
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
	subdomains := []string{
		"",
		"www.",
		"admin.",
		"staff.",
		"sso.",
		"login.",
		"status.",
	}

	r := http.NewServeMux()
	r.Handle("/v1/violet/route", hasPerm(verify, "violet:route", func(rw http.ResponseWriter, req *http.Request) {
		m := make([]map[string]any, 0, len(subdomains)*2)
		for _, i := range subdomains {
			m = append(m, map[string]any{
				"src":    i + "example.com",
				"dst":    "127.0.0.1:8080",
				"desc":   "This is a test description",
				"flags":  181,
				"active": true,
			})
			m = append(m, map[string]any{
				"src":    i + "example.org",
				"dst":    "127.0.0.1:8085",
				"desc":   "This is a test description",
				"flags":  17,
				"active": true,
			})
		}
		json.NewEncoder(rw).Encode(m)
	}))
	r.Handle("/v1/violet/redirect", hasPerm(verify, "violet:redirect", func(rw http.ResponseWriter, req *http.Request) {
		m := make([]map[string]any, 0, len(subdomains)*2)
		for _, i := range subdomains {
			m = append(m, map[string]any{
				"src":    i + "example.com",
				"dst":    "test1.example.com",
				"desc":   "This is a test description",
				"flags":  1,
				"code":   308,
				"active": true,
			})
			m = append(m, map[string]any{
				"src":    i + "example.org",
				"dst":    "test2.example.org",
				"desc":   "This is a test description",
				"flags":  3,
				"code":   307,
				"active": true,
			})
		}
		json.NewEncoder(rw).Encode(m)
	}))
	r.Handle("/v1/orchid/owned", hasPerm(verify, "orchid:cert", func(rw http.ResponseWriter, req *http.Request) {
		m := make([]map[string]any, 0, len(subdomains)*2)
		for i := 0; i < len(subdomains); i++ {
			u := subdomains[i] + "example.com"
			m = append(m, map[string]any{
				"id":           i + 1,
				"auto_renew":   true,
				"active":       true,
				"renewing":     false,
				"renew_failed": false,
				"not_after":    "2024-02-06T11:52:05Z",
				"updated_at":   "2023-11-08T07:32:08Z",
				"domains": []string{
					u,
					"*." + u,
				},
			})
			u = subdomains[i] + "example.org"
			m = append(m, map[string]any{
				"id":           i + 21,
				"auto_renew":   false,
				"active":       false,
				"renewing":     false,
				"renew_failed": false,
				"not_after":    "2024-02-06T11:52:05Z",
				"updated_at":   "2023-11-08T07:32:08Z",
				"domains": []string{
					u,
					"*." + u,
				},
			})
		}
		json.NewEncoder(rw).Encode(m)
	}))
	r.Handle("/v1/azalea/domains", hasPerm(verify, "domains:manage", func(rw http.ResponseWriter, req *http.Request) {
		type Zone struct {
			ID   int64  `json:"id"`
			Name string `json:"name"`
		}
		json.NewEncoder(rw).Encode([]Zone{
			{ID: 1, Name: "example.com."},
			{ID: 2, Name: "example.org."},
		})
	}))
	r.Handle("/v1/azalea/domains/example.com/records", hasPerm(verify, "domains:manage", func(rw http.ResponseWriter, req *http.Request) {
		fmt.Fprintln(rw, `[
  {
    "Hdr": {
      "Name": "example.com.",
      "Rrtype": 6,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "Ns": "ns1.example.com.",
    "Mbox": "hostmaster.example.com.",
    "Serial": 2024062001,
    "Refresh": 7200,
    "Retry": 1800,
    "Expire": 1209600,
    "Minttl": 300
  },
  {
    "Hdr": {
      "Name": "example.com.",
      "Rrtype": 2,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "Ns": "ns1.example.com."
  },
  {
    "Hdr": {
      "Name": "example.com.",
      "Rrtype": 2,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "Ns": "ns2.example.com."
  },
  {
    "Hdr": {
      "Name": "example.com.",
      "Rrtype": 2,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "Ns": "ns3.example.com."
  },
  {
    "Hdr": {
      "Name": "ns1.example.com.",
      "Rrtype": 1,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "A": "10.54.0.1"
  }
]`)
	}))
	r.Handle("/v1/azalea/domains/example.org/records", hasPerm(verify, "domains:manage", func(rw http.ResponseWriter, req *http.Request) {
		fmt.Fprintln(rw, `[
  {
    "Hdr": {
      "Name": "example.org.",
      "Rrtype": 6,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "Ns": "ns1.example.com.",
    "Mbox": "hostmaster.example.com.",
    "Serial": 2024062001,
    "Refresh": 7200,
    "Retry": 1800,
    "Expire": 1209600,
    "Minttl": 300
  },
  {
    "Hdr": {
      "Name": "example.org.",
      "Rrtype": 2,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "Ns": "ns1.example.com."
  },
  {
    "Hdr": {
      "Name": "example.org.",
      "Rrtype": 2,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "Ns": "ns2.example.com."
  },
  {
    "Hdr": {
      "Name": "example.org.",
      "Rrtype": 2,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "Ns": "ns3.example.com."
  },
  {
    "Hdr": {
      "Name": "example.org.",
      "Rrtype": 1,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "A": "10.36.0.1"
  },
  {
    "Hdr": {
      "Name": "example.org.",
      "Rrtype": 28,
      "Class": 1,
      "Ttl": 300,
      "Rdlength": 0
    },
    "AAAA": "2001:db8::15"
  }
]`)
	}))
	r.Handle("/v1/sites", hasPerm(verify, "sites:manage", func(rw http.ResponseWriter, req *http.Request) {
		if req.Method == http.MethodPost {
			defer req.Body.Close()
			dec := json.NewDecoder(req.Body)
			var m map[string]string
			if err := dec.Decode(&m); err != nil {
				http.Error(rw, err.Error(), http.StatusBadRequest)
				return
			}
			switch m["submit"] {
			case "secret":
				rw.WriteHeader(http.StatusOK)
				fmt.Fprintf(rw, "{\"secret\":\"%s\"}\n", uuid.NewString())
				return
			case "delete-branch":
				rw.WriteHeader(http.StatusOK)
			}
			return
		}
		m := make([]any, 0, len(subdomains))
		for _, i := range subdomains {
			m = append(m, map[string]any{
				"domain":   i + "example.com",
				"branches": []string{"", "beta"},
			})
			m = append(m, map[string]any{
				"domain":   i + "example.org",
				"branches": []string{"", "alpha"},
			})
		}
		json.NewEncoder(rw).Encode(m)
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
