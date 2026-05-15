# RangeTech Service App

Projekt zaliczeniowy z aplikacji mobilnych. Aplikacja jest niezalezna od LeadFlow, ale tematycznie nawiazuje do RangeTech / LeadFlow: mobilny klient serwisowy komunikuje sie z klasycznym backendem REST API.

## Struktura

- `backend` - ASP.NET Core Web API na .NET 10.
- `mobile` - React Native z TypeScriptem, React Navigation i Context API.

## Stack

### Backend

- ASP.NET Core Web API
- .NET 10
- C#
- Entity Framework Core
- SQL Server LocalDB / lokalny SQL Server
- Swagger/OpenAPI
- MediatR - przygotowana struktura pod CQRS/use cases
- Mapster - przygotowana konfiguracja mapowania DTO
- Docker Compose dla SQL Server jako opcja alternatywna

### Mobile

- React Native 0.84.0
- React 19.2.3
- TypeScript
- React Navigation
- Context API
- `fetch` do komunikacji z API

React Native 0.84.0 zostal utworzony aktualnym CLI `@react-native-community/cli`. Nie byl potrzebny fallback na starsza wersje stabilna.

## Uruchomienie

### Visual Studio

1. Otworz projekt `backend/RangeTech.ServiceApp.Api.csproj` w Visual Studio.
2. Upewnij sie, ze masz dostepny SQL Server LocalDB (`(localdb)\MSSQLLocalDB`).
3. W Package Manager Console albo terminalu w katalogu `backend` uruchom migracje:

```powershell
dotnet ef database update
```

4. Uruchom profil backendu z Visual Studio.

Swagger UI:

```text
http://localhost:5000/swagger
```

### Terminal bez Dockera

Jesli `dotnet ef` nie jest jeszcze dostepne po sklonowaniu projektu, uruchom najpierw:

```powershell
cd backend
dotnet tool restore
```

```powershell
cd backend
dotnet ef database update
dotnet run --urls "http://localhost:5000"
```

Endpointy:

- Health check: `http://localhost:5000/api/health`
- Swagger UI: `http://localhost:5000/swagger`

### Docker jako opcja alternatywna

Projekt zawiera `backend/docker-compose.yml`, ale Docker nie jest domyslna sciezka uruchamiania. Domyslny connection string korzysta z LocalDB:

```json
"Server=(localdb)\\MSSQLLocalDB;Database=RangeTechServiceDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

### Mobile Android

W osobnym terminalu uruchom Metro:

```powershell
cd mobile
npm start
```

Nastepnie, przy wlaczonym emulatorze Androida:

```powershell
cd mobile
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
npm run android
```

Aplikacja mobilna uzywa adresu `http://10.0.2.2:5000`, czyli dostepu emulatora Androida do backendu uruchomionego na komputerze hosta.

## Zakres aktualnego etapu

- Utworzono backend i klienta mobilnego.
- Dodano konfiguracje SQL Server, Swagger, EF Core, MediatR i Mapster.
- Dodano podstawowa nawigacje mobilna, Context API i klienta `fetch`.
- Nie zaimplementowano jeszcze pelnego CRUD.
