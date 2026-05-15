# RangeTech Service App

Projekt zaliczeniowy z aplikacji mobilnych. Aplikacja jest niezależna od LeadFlow, ale tematycznie nawiązuje do RangeTech / LeadFlow: mobilny klient serwisowy komunikuje się z klasycznym backendem REST API.

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
- MediatR dla obsługi komend i zapytań
- Mapster do mapowania encji i DTO
- Docker Compose dla SQL Server jako opcja alternatywna

### Mobile

- React Native 0.84.0
- React 19.2.3
- TypeScript
- React Navigation
- Context API
- `fetch` do komunikacji z API

React Native 0.84.0 został utworzony aktualnym CLI `@react-native-community/cli`. Nie był potrzebny fallback na starszą wersję stabilną.

## Funkcje

Projekt zawiera:

- backend ASP.NET Core Web API z klasycznym REST API,
- bazę SQL Server LocalDB,
- Swagger UI,
- aplikację mobilną React Native,
- dashboard ze statystykami,
- pasek statusu połączenia z API,
- podstawowe walidacje formularzy,
- obsługę zgłoszeń i raportów serwisowych,
- CRUD dla 8 głównych klas:
  - Employee,
  - Client,
  - Device,
  - TaskType,
  - WorkTask,
  - ServiceTicket,
  - ServiceReport,
  - ServicePart,
- relacje z kluczami obcymi:
  - Device -> Client,
  - WorkTask -> Employee, Device, TaskType,
  - ServiceTicket -> Client, Device,
  - ServiceReport -> ServiceTicket, Employee,
- relację wiele-do-wielu `ServiceReport` <-> `ServicePart` przez `ServiceReportPart`.

## Uruchomienie

### Visual Studio

1. Otwórz projekt `backend/RangeTech.ServiceApp.Api.csproj` w Visual Studio.
2. Upewnij się, że masz dostępny SQL Server LocalDB (`(localdb)\MSSQLLocalDB`).
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

Jeśli `dotnet ef` nie jest jeszcze dostępne po sklonowaniu projektu, uruchom najpierw:

```powershell
cd backend
dotnet tool restore
```

Następnie:

```powershell
cd backend
dotnet ef database update
dotnet run --urls "http://localhost:5000"
```

Endpointy:

- Health check: `http://localhost:5000/api/health`
- Swagger UI: `http://localhost:5000/swagger`

### Docker jako opcja alternatywna

Projekt zawiera `backend/docker-compose.yml`, ale Docker nie jest domyślną ścieżką uruchamiania. Domyślny connection string korzysta z LocalDB:

```json
"Server=(localdb)\\MSSQLLocalDB;Database=RangeTechServiceDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

### Mobile Android

W osobnym terminalu uruchom Metro:

```powershell
cd mobile
npm start
```

Następnie, przy włączonym emulatorze Androida:

```powershell
cd mobile
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
npm run android
```

Aplikacja mobilna używa adresu `http://10.0.2.2:5000`, czyli dostępu emulatora Androida do backendu uruchomionego na komputerze hosta.

