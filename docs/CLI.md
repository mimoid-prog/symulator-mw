# Symulator MW

Symulator zasobów i przebiegu mistrzostwa walk. Strona i lokalne CLI korzystają
z istniejącego silnika i obliczeń kosztów w `lib/Store.ts`.
CLI wywołuje bezpośrednio `Store.generateMwSimulation(maxTurns)`.
Szczegółowy raport jest zwracany przez tę metodę osobno od dotychczasowego
`Store.simulation` używanego przez stronę; kod widoku i jego typy pozostają bez zmian.
Wyniki nie są oceną obrażeń, DPS, skuteczności buildu ani szans wygrania walki.

## Lokalne CLI dla agenta

Wymagany **Node.js 22.22+** oraz zależności projektu, w tym `tsx`. Jednorazowa
instalacja z lokalnego cache, bez pobierania czegokolwiek z internetu:

```sh
cd /Users/mateuszszkop/Projects/symulator-mw
pnpm install --offline --frozen-lockfile
```

Jeśli lokalny cache jest niekompletny, instalacja zgłosi błąd. CLI nie uruchamia
strony, przeglądarki, Next.js, serwera HTTP, MCP ani aktualizacji danych.
Nie wymaga `pnpm build`.

Dokładne polecenie dla drugiego projektu, działające z dowolnego katalogu:

```sh
node /Users/mateuszszkop/Projects/symulator-mw/cli/simulate.mjs < /Users/mateuszszkop/Projects/symulator-mw/examples/simulation-input.json
```

Ścieżki powyżej zakładają przeniesienie zmian do głównego checkoutu projektu.
Aby uruchomić aktualny checkout/worktree, w jego katalogu wykonaj:

```sh
node cli/simulate.mjs < examples/simulation-input.json
```

Proces czyta **jeden dokument JSON do EOF** ze stdin i wypisuje **jeden dokument
JSON zakończony znakiem nowej linii** na stdout. Diagnostyka techniczna trafia
wyłącznie na stderr. Wywołuj bezpośrednio `node`, ponieważ menedżer pakietów
może dopisać własny nagłówek do stdout. Pomocniczy skrypt `pnpm simulate` jest
przeznaczony do ręcznego użycia.

### Wejście

Gotowy plik: [`examples/simulation-input.json`](../examples/simulation-input.json).

```json
{
  "build": {
    "profession": "w",
    "level": 50,
    "skills": {"23": 10, "72": 10, "22": 6},
    "mastery": {"skills": [23, 22, -1], "repeat": true},
    "weapon_tags": ["2h", "wound"]
  },
  "character": {
    "mana": 0,
    "energy": 100,
    "manaRegen": 0,
    "energyRegen": 5
  },
  "max_turns": 1000
}
```

- `build`: pełny lokalny JSON z `margonem-builds`, z wymaganymi `profession`,
  `level`, `skills`. Nie przekazuj całej otoczki eksportu (`url`, `validation`
  itd.); przekaż jej pole `build`.
- Profesje: `w` wojownik, `p` paladyn, `b` tancerz ostrzy, `m` mag, `h` łowca,
  `t` tropiciel. Akceptowane są też polskie nazwy i aliasy angielskie używane
  przez `margonem-builds` (`warrior`, `paladin`, `dancer`, `mage`, `hunter`, `tracker`).
- `level`: liczba całkowita 24–500. `skills`: źródłowe ID zapisane jako klucze
  tekstowe i rangi całkowite 0–10; 0 oznacza brak przydziału.
- `mastery.skills`: kolejność maksymalnie 20 akcji, domyślnie `[]`.
  `mastery.repeat`: wartość logiczna, domyślnie `true`.
  Brak `mastery` odpowiada pustej sekwencji z powtarzaniem.
- `-1` to zwykły atak (ID 0 w silniku); `-2` to nieobsługiwany krok do przodu
  i daje błąd. Nieznane, pasywne, nieprzydzielone i niedostępne na poziomie
  akcje również dają błędy; nie są zamieniane na zwykły atak.
- Wszystkie cztery pola `character` są wymagane: **końcowe** pule many i energii
  (zarazem wartości początkowe i maksima) oraz regeneracja na wykonaną turę.
  Liczby muszą być skończone, nieujemne i nie większe od `9007199254740991`.
  Ułamki są zachowane. Pasywne bonusy, ekwipunek i inne stałe efekty uwzględnij
  wcześniej w tych wartościach; CLI ich nie dolicza.
- `max_turns`: dodatnia bezpieczna liczba całkowita (do `9007199254740991`),
  domyślnie 1000. Ogranicza wykonane akcje. Historia jest przechowywana w pamięci,
  dlatego bardzo duże limity mogą wymagać dużo RAM i czasu.
- Opcjonalne `weapon_tags`, `name`, `goal`, `notes`, `data_version`, `snapshot_id`
  są akceptowane w formacie drugiego projektu. Tagi nie zmieniają obliczeń.
  Nieznane pola i błędne typy są odrzucane.

CLI sprawdza strukturę, ID w drzewku profesji, rangi i wykonalność wskazanych
akcji. **Nie zastępuje walidatora buildu**: nie sprawdza budżetu punktów,
progów rzędów ani wymagań wybranego zestawu broni. Najpierw uruchom
`margonem validate`, następnie symuluj. Pasywne oraz niewykorzystane w MW aktywne
umiejętności nie muszą występować w tabeli akcji silnika.

### Wynik

Kod wyjścia **0** oznacza poprawnie przeprowadzoną symulację, także jeśli
skończyła się brakiem zasobów albo brakiem postępu. Wynik zawiera:

| Pole | Znaczenie |
| --- | --- |
| `ok`, `schema_version` | `true`, wersja kontraktu wyniku (1) |
| `mapping` | Snapshot, wersja i SHA-256 danych użytych do mapowania ID |
| `profession`, `level`, `repeat`, `max_turns` | Efektywne ustawienia |
| `turns_executed` | Liczba rzeczywiście wykonanych akcji |
| `termination` | Kod, komunikat i ewentualne szczegóły zakończenia |
| `final` | Końcowe `mana`, `energy`, `combination_points` |
| `combination_points_cap` | Limit punktów kombinacji profesji |
| `turns` | Płaska historia wykonanych tur |

Kody `termination.code`:

| Kod | Znaczenie |
| --- | --- |
| `sequence_completed` | Ukończono jeden obieg przy `repeat: false`, z pominięciem cooldownów |
| `insufficient_resources` | Następnej dostępnej akcji nie da się opłacić |
| `turn_limit` | Osiągnięto limit; **nie jest to dowód działania w nieskończoność** |
| `no_progress` | Pusta sekwencja (`detail: empty_sequence`) lub cały obieg bez akcji (`detail: all_actions_on_cooldown`) |

Jeśli niepowtarzana sekwencja kończy się dokładnie na limicie, zwracane jest
`sequence_completed`. Jeżeli limit zatrzymuje dalsze przetwarzanie sekwencji
lub kolejne powtórzenie, zwracane jest `turn_limit`.

Każda pozycja `turns` ma:

- `turn`, `round`: numery wykonanej tury i obiegu, liczone od 1;
- `sequence_index`: indeks pozycji w oryginalnym `mastery.skills`, od 0;
- `action_id`: źródłowe ID (`-1` dla ataku), `simulator_ability_id`: wewnętrzne ID,
  `name`: nazwa w symulatorze, `rank`: ranga (0 dla zwykłego ataku);
- `mana`, `energy`: `{ "before": ..., "cost": ..., "after": ... }`;
  koszt to faktycznie odejmowana, zaokrąglona wartość, a `after` uwzględnia
  odzyskiwanie, efekty punktów kombinacji, buffy i regenerację tej tury;
- `combination_points`: `{ "before": ..., "after": ... }`.

Pominięte przez cooldown pozycje nie są wykonanymi turami i nie trafiają do
historii. Akcja przerwana przez brak zasobów też nie jest turą. Jej dane są
w `termination.blocked_action`: `action_id`, `sequence_index`, `resource`
(`mana` lub `energy`), `required`, `available`.

Dołączony przykład zwraca `turns_executed: 4`,
`termination.code: "insufficient_resources"`, końcową manę 0 i energię 12.
Następny Ogłuszający cios wymaga 40 energii.

Błędy wejścia mają kod wyjścia **2** i np. taki JSON na stdout:

```json
{"ok":false,"error":{"code":"unsupported_action","message":"Krok do przodu (-2) nie jest obsługiwany przez symulator.","path":"build.mastery.skills[0]"}}
```

Pozostałe kontrolowane kody: `invalid_json`, `invalid_input`,
`invalid_profession`, `unknown_skill`, `unknown_action`, `passive_action`,
`unlearned_action`, `action_level_locked`, `unsupported_data_version`,
`unsupported_snapshot`. `path` występuje, gdy błąd dotyczy konkretnego pola.
Awaria ładowania lub nieoczekiwany błąd daje kod wyjścia **1** oraz
`startup_error` lub `internal_error`, ze szczegółami technicznymi na stderr.

### Wywołanie z Pythona

```python
import json
import subprocess
from pathlib import Path

simulator = Path("/Users/mateuszszkop/Projects/symulator-mw")
build = json.loads(Path("builds/wojownik-50.json").read_text())
payload = {
    "build": build,
    "character": {"mana": 0, "energy": 100, "manaRegen": 0, "energyRegen": 5},
    "max_turns": 1000,
}
process = subprocess.run(
    ["node", str(simulator / "cli/simulate.mjs")],
    input=json.dumps(payload), text=True, capture_output=True, timeout=30,
)
result = json.loads(process.stdout)
if process.returncode:
    raise RuntimeError(result["error"])
print(result["turns_executed"], result["termination"], result["final"])
```

## Mapowanie i ograniczenia mechaniki

[`data/margonem-builds-mapping.json`](../data/margonem-builds-mapping.json) zawiera
jawny katalog wszystkich 252 pozycji sześciu drzewek z obecnego lokalnego
snapshotu `20261029T202143496087Z-2166ddefba1f`, `data_version: 2`.
SHA-256 pliku źródłowego `skills.json`:
`51093450791fb6fec0ab6728f957ec6d81b0484e78c340815a2b7108df388c6c`.
Nie jest potrzebny dostęp do `margonem-builds` podczas symulacji.

Każde źródłowe ID ma nazwę, oznaczenie aktywności i jawną nazwę docelową
`simulatorName` albo `null`. Mapowanie 80 obsługiwanych akcji uwzględnia profesję.
Przykład: `t/244`, „Emanujące strzały” → „Emanująca strzała”.
Wewnętrzne ID powstają przez `getId()` i zależą od kolejności importów, dlatego
nie służą jako stałe ID integracji. Wyszukanie po jawnej nazwie musi dać dokładnie
jedną akcję w danej profesji. Oczyszczenie łowcy (`h/238`) jest aktywne w źródle,
ale nieobsługiwane w osobistym MW symulatora; użycie go w sekwencji daje błąd.

Build ze wskazanym innym `data_version` lub `snapshot_id` jest odrzucany,
aby nie stosować starego mapowania do niesprawdzonych danych. Te pola są
opcjonalne dla buildów bez metadanych. Aktualizacja tabeli wymaga świadomego
odczytu nowego lokalnego snapshotu i ponownej weryfikacji; nie ma automatycznego
pobierania ani synchronizacji.

Zachowane reguły i rozbieżności, których ta zmiana nie koryguje:

- Cooldown jest sprawdzany w ostatnich **wykonanych akcjach**. Pominięcie slotu
  nie zużywa tury, nie regeneruje zasobów i nie zmniejsza cooldownu. Gdy cały
  powtarzany obieg nic nie wykona, symulacja kończy się `no_progress`.
  Reguła blokady slotów w edytorze strony liczy odległości pozycji; przy
  pomijanych akcjach może różnić się od wyniku silnika.
- Zasoby muszą wystarczyć **przed** odzyskiwaniem i regeneracją. Silnik nie
  czeka na zasoby. Najpierw odejmuje zaokrąglone koszty, następnie uwzględnia
  odzyskanie, efekty CP, buffy i regenerację; na końcu aktualizuje CP.
  Sprawdzenie wypłacalności używa kosztu przed zaokrągleniem.
- „Srebrzysty blask” regeneruje energię przez osiem kolejnych wykonanych tur;
  pierwsza porcja nie występuje w turze rzucenia.
- Każde kolejne użycie umiejętności odzyskującej zasoby osłabia jej zwrot o 10%
  względem poprzedniego użycia (zaokrąglenie na końcu). Mana jest przycinana do
  maksimum przy regeneracji nawet przy regen=0. Energia jest przycinana tylko,
  gdy łączny przyrost z regeneracji i buffów jest dodatni; przy regen=0 samo
  odzyskiwanie lub CP może podnieść ją powyżej maksimum.
- Koszty zależne od poziomu używają w symulatorze **pełnego poziomu** postaci.
  Źródłowe formuły z `cplvl` w `margonem-builds` ograniczają go do 300.
  Przykładowo Srebrzysty blask na randze 1 i poziomie 500 kosztuje tu 400 many,
  a według źródłowego `0.8*cplvl` kosztowałby 240. Nie zmieniono tej mechaniki.
- Zużycie CP zeruje całą ich pulę, nawet jeśli `cpUse` jest mniejsze od
  aktualnej liczby. Zwroty CP wykorzystują minimum z puli i `cpUse`.
  Limity CP: wojownik 5, mag 4, pozostałe profesje 3. Krytyki i pasywne źródła
  punktów kombinacji nie są symulowane.
- Brak obrażeń, celów, przeciwnika, losowości walki, leczenia HP, trafień,
  zasięgu i ruchu. Pełny build dostarcza rangi i kolejność MW, nie dodaje tych
  mechanik. Dane kosztów/efektów silnika pozostają niezależne od snapshotu
  użytego do mapowania nazw i ID.

## Weryfikacja i strona

```sh
pnpm test
pnpm typecheck
pnpm lint

# Dodatkowo sprawdź mapę względem rzeczywistego lokalnego snapshotu (tylko odczyt):
MARGONEM_BUILDS_DIR=/Users/mateuszszkop/Projects/margonem-builds pnpm test
```

Testy obejmują wszystkie 80 mapowanych akcji, koszty rang, sekwencję i powtarzanie,
brak zasobów, regenerację i odzyskiwanie, buffy, CP, cooldowny, pustą sekwencję,
brak postępu, limit i błędy wejścia. Testy procesowe uruchamiają `node` z JSON-em
na stdin i katalogiem roboczym poza repozytorium. Opcjonalny test snapshotu
porównuje ID, profesje, nazwy, aktywność, wersję oraz sumę kontrolną; zwykłe testy
nie wymagają obecności drugiego projektu. Wszystkie testy działają offline.

Strona pozostaje aplikacją Next.js. Jej uruchomienie, niezależne od CLI:

```sh
pnpm dev
```

Dane silnika uwzględniają wpisy bloga zmian po 10.11.2025 do 14.07.2026.
