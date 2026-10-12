# MCP opinnäytetyön vaiheet

Tämä projekti on tehty Web-ohjelmointi 2 -kurssilla. Käytin tehtävässä opettajan antamaa valmista pohjaa ja koodiesimerkkejä.

Tein MCP-serverin, joka hakee tietoja MariaDB-tietokannasta. Serverissä on kaksi työkalua. Ensimmäisellä voi hakea kaikki opinnäytetyön vaiheet ja toisella valitun vaiheen selityksen.

Testasin molempien työkalujen toimintaa Claude Desktopilla.

## Käytetyt teknologiat

-	TypeScript
-	Node.js
-	Express.js
-	MariaDB
-	Model Context Protocol (MCP)
-	Claude Desktop (testaus)

## Käynnistäminen

Asenna ensin projektin riippuvuudet:

npm install

Luo tietokanta database.sql-tiedoston avulla esimerkiksi HeidiSQLä.

Luo projektin pääkansioon `.env`-tiedosto ja lisää siihen omat tietokantayhteyden asetukset:

```env
DB_HOST=localhost
DB_USER=oma_kayttaja
DB_PASSWORD=oma_salasana
DB_NAME=opinnaytetyot
```
Käynnistä serveri komennolla:

npm run dev

Serveri käynnistyy porttiin 3000.

Claude Desktopilla testaamista varten MCP-yhteys pitää vielä määrittää erikseen.

## Testaus

### Opinnäytetyön vaiheiden haku

<img width="822" height="297" alt="image" src="https://github.com/user-attachments/assets/5d90698f-3610-47a5-9084-747262a630fb" />


### Viimeistelyvaiheen selityksen haku

<img width="796" height="351" alt="image" src="https://github.com/user-attachments/assets/50952920-4171-4d38-acc9-11f3cd44e1e3" />

