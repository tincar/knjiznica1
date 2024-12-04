const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3000;

// Parser za JSON podatke
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "ucka.veleri.hr",
  user: "dbanovac",
  password: "11",
  database: "dbanovac"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// Ruta za dohvat svih knjiga
app.get("/api/knjige", (request, response) => {
  connection.query("SELECT * FROM knjiga", (error, results) => {
    if (error) throw error;
    response.send(results);
  });
});

// Ruta za dohvat knjige po ID-u
app.get("/api/knjige/:id", (request, response) => {
  const id = request.params.id;
  connection.query("SELECT * FROM knjiga WHERE id = ?", [id], (error, results) => {
    if (error) throw error;
    response.send(results);
  });
});

// Dodavanje rezervacije
app.post("/api/rezerv_knjige", (request, response) => {
  const data = request.body;
  const rezervacija = [[data.datum, data.id_knjiga, data.id_korisnik]];
  connection.query(
    "INSERT INTO rezervacija (datum_rez, knjiga, korisnik) VALUES ?",
    [rezervacija],
    (error, results) => {
      if (error) throw error;
      response.send(results);
    }
  );
});

// 1. Ukupan broj knjiga kod korisnika
app.get("/api/korisnik/:id/broj-knjiga", (request, response) => {
  const idKorisnik = request.params.id;
  connection.query(
    "SELECT COUNT(*) AS brojKnjiga FROM rezervacija WHERE korisnik = ?",
    [idKorisnik],
    (error, results) => {
      if (error) throw error;
      response.send(results[0]);
    }
  );
});

// 2. Broj slobodnih primjeraka knjige
app.get("/api/knjige/:id/slobodne", (request, response) => {
  const idKnjiga = request.params.id;
  connection.query(
    `SELECT knjiga.stanje - COUNT(rezervacija.id) AS slobodno 
     FROM knjiga 
     LEFT JOIN rezervacija ON knjiga.id = rezervacija.knjiga 
     WHERE knjiga.id = ?`,
    [idKnjiga],
    (error, results) => {
      if (error) throw error;
      response.send(results[0]);
    }
  );
});

// 3. Broj rezerviranih primjeraka
app.get("/api/knjige/:id/rezervirano", (request, response) => {
  const idKnjiga = request.params.id;
  connection.query(
    "SELECT COUNT(*) AS rezervirano FROM rezervacija WHERE knjiga = ?",
    [idKnjiga],
    (error, results) => {
      if (error) throw error;
      response.send(results[0]);
    }
  );
});

// 4. Korisnici s određenom knjigom
app.get("/api/knjige/:id/korisnici", (request, response) => {
  const idKnjiga = request.params.id;
  connection.query(
    `SELECT korisnik.id, korisnik.ime, korisnik.prezime, korisnik.korime 
     FROM korisnik 
     INNER JOIN rezervacija ON korisnik.id = rezervacija.korisnik 
     WHERE rezervacija.knjiga = ?`,
    [idKnjiga],
    (error, results) => {
      if (error) throw error;
      response.send(results);
    }
  );
});

// 5. Ukupan broj primjeraka knjiga
app.get("/api/knjige/ukupno", (request, response) => {
  connection.query(
    "SELECT SUM(stanje) AS ukupnoKnjiga FROM knjiga",
    (error, results) => {
      if (error) throw error;
      response.send(results[0]);
    }
  );
});

// 6. Ukupan broj rezerviranih primjeraka
app.get("/api/rezervacije/ukupno", (request, response) => {
  connection.query(
    "SELECT COUNT(*) AS ukupnoRezervirano FROM rezervacija",
    (error, results) => {
      if (error) throw error;
      response.send(results[0]);
    }
  );
});

// 7. Ukupan broj slobodnih primjeraka
app.get("/api/knjige/slobodne", (request, response) => {
  connection.query(
    `SELECT SUM(knjiga.stanje) - COUNT(rezervacija.id) AS ukupnoSlobodno 
     FROM knjiga 
     LEFT JOIN rezervacija ON knjiga.id = rezervacija.knjiga`,
    (error, results) => {
      if (error) throw error;
      response.send(results[0]);
    }
  );
});

// 8. Knjige s manje od 3 primjerka
app.get("/api/knjige/nedostatne", (request, response) => {
  connection.query(
    "SELECT * FROM knjiga WHERE stanje < 3",
    (error, results) => {
      if (error) throw error;
      response.send(results);
    }
  );
});

// 9. Korisnici s rezervacijama starijim od mjesec dana
app.get("/api/rezervacije/starije-od-mjesec-dana", (request, response) => {
  connection.query(
    `SELECT korisnik.id, korisnik.ime, korisnik.prezime, knjiga.naslov, rezervacija.datum_rez 
     FROM korisnik 
     INNER JOIN rezervacija ON korisnik.id = rezervacija.korisnik 
     INNER JOIN knjiga ON knjiga.id = rezervacija.knjiga 
     WHERE rezervacija.datum_rez < NOW() - INTERVAL 1 MONTH`,
    (error, results) => {
      if (error) throw error;
      response.send(results);
    }
  );
});

// 10-11. Slanje podsjetnika korisnicima
app.get("/api/podsjetnik", (request, response) => {
  connection.query(
    `SELECT korisnik.email, korisnik.broj_telefona, knjiga.naslov, rezervacija.datum_rez 
     FROM korisnik 
     INNER JOIN rezervacija ON korisnik.id = rezervacija.korisnik 
     INNER JOIN knjiga ON knjiga.id = rezervacija.knjiga 
     WHERE rezervacija.datum_rez < NOW() - INTERVAL 1 MONTH`,
    (error, results) => {
      if (error) throw error;
      response.send(results);
    }
  );
});

// 12. Provjera duplih rezervacija korisnika
app.get("/api/korisnik/:id/duple-rezervacije", (request, response) => {
  const idKorisnik = request.params.id;
  connection.query(
    `SELECT knjiga, COUNT(*) AS broj_rezervacija 
     FROM rezervacija 
     WHERE korisnik = ? 
     GROUP BY knjiga 
     HAVING broj_rezervacija >= 2`,
    [idKorisnik],
    (error, results) => {
      if (error) throw error;
      response.send(results);
    }
  );
});

// 13. Ažuriranje podataka korisnika
app.put("/api/korisnik/:id", (request, response) => {
  const idKorisnik = request.params.id;
  const { ime, prezime, email, broj_telefona } = request.body;

  connection.query(
    `UPDATE korisnik 
     SET ime = ?, prezime = ?, email = ?, broj_telefona = ? 
     WHERE id = ?`,
    [ime, prezime, email, broj_telefona, idKorisnik],
    (error, results) => {
      if (error) throw error;
      response.send({ message: "Podaci uspješno ažurirani.", affectedRows: results.affectedRows });
    }
  );
});

// 14. Vraćanje knjige i arhiviranje rezervacije
app.post("/api/rezervacija/vrati", (request, response) => {
  const { idRezervacija, datumVracanja } = request.body;

  connection.query(
    `INSERT INTO povijest_rezervacija (korisnik, knjiga, datum_rez, datum_vracanja)
     SELECT korisnik, knjiga, datum_rez, ? 
     FROM rezervacija 
     WHERE id = ?`,
    [datumVracanja, idRezervacija],
    (error, results) => {
      if (error) throw error;

      connection.query(
        "DELETE FROM rezervacija WHERE id = ?",
        [idRezervacija],
        (delError, delResults) => {
          if (delError) throw delError;
          response.send({ message: "Rezervacija vraćena i arhivirana.", affectedRows: delResults.affectedRows });
        }
      );
    }
  );
});

// Pokretanje servera
app.listen(port, () => {
  console.log("Server running at port: " + port);
});
