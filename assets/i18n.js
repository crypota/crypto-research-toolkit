/* Six complete UI catalogs. Russian source strings are gettext-style message IDs.
   Credentials and price data are never stored here. Only the language preference persists. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ToolkitI18n = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const LANGUAGES = ['en', 'ko', 'ja', 'de', 'ru', 'es'];
  const INDEX = { en: 0, ko: 1, ja: 2, de: 3, es: 4 };
  const LOCALES = { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP', de: 'de-DE', ru: 'ru-RU', es: 'es-ES' };
  const STORAGE_KEY = 'crt.language';
  const MESSAGES = {
  "Перейти к исследованию": [
    "Skip to research",
    "분석으로 건너뛰기",
    "分析へスキップ",
    "Zur Analyse springen",
    "Ir al análisis"
  ],
  "Crypto Research Toolkit, главная": [
    "Crypto Research Toolkit, home",
    "Crypto Research Toolkit 홈",
    "Crypto Research Toolkit ホーム",
    "Crypto Research Toolkit, Startseite",
    "Crypto Research Toolkit, inicio"
  ],
  "Crypto Research Toolkit — локальная панель": [
    "Crypto Research Toolkit — research dashboard",
    "Crypto Research Toolkit — 리서치 대시보드",
    "Crypto Research Toolkit — リサーチダッシュボード",
    "Crypto Research Toolkit — Analyse-Dashboard",
    "Crypto Research Toolkit — panel de análisis"
  ],
  "РАБОЧЕЕ ПРОСТРАНСТВО": [
    "WORKSPACE",
    "작업 공간",
    "ワークスペース",
    "ARBEITSBEREICH",
    "ESPACIO DE TRABAJO"
  ],
  "Исследование": [
    "Research",
    "분석",
    "分析",
    "Analyse",
    "Análisis"
  ],
  "Формат данных": [
    "Data format",
    "데이터 형식",
    "データ形式",
    "Datenformat",
    "Formato de datos"
  ],
  "НАБОР ДАННЫХ": [
    "DATASETS",
    "데이터 세트",
    "データセット",
    "DATENSÄTZE",
    "CONJUNTOS DE DATOS"
  ],
  "Выберите актив. Отметьте галочками ряды для сравнения.": [
    "Choose an asset. Check the series you want to compare.",
    "자산을 선택하고 비교할 시계열에 체크하세요.",
    "資産を選択し、比較する系列にチェックを入れてください。",
    "Asset wählen. Die zu vergleichenden Reihen ankreuzen.",
    "Elige un activo y marca las series que quieras comparar."
  ],
  "Загруженные активы": [
    "Loaded assets",
    "불러온 자산",
    "読み込み済みの資産",
    "Geladene Assets",
    "Activos cargados"
  ],
  "Загрузить CSV или перетащить файлы": [
    "Upload CSV or drop files",
    "CSV 업로드 또는 파일 끌어놓기",
    "CSVを読み込む、またはファイルをドロップ",
    "CSV laden oder Dateien ablegen",
    "Cargar CSV o arrastrar archivos"
  ],
  "Добавить CSV": [
    "Add CSV",
    "CSV 추가",
    "CSVを追加",
    "CSV hinzufügen",
    "Añadir CSV"
  ],
  "Перетащите файлы сюда": [
    "Drop files here",
    "여기에 파일을 끌어놓으세요",
    "ここにファイルをドロップ",
    "Dateien hier ablegen",
    "Arrastra los archivos aquí"
  ],
  "до 5 МБ · до 8 активов": [
    "up to 5 MiB · up to 8 assets",
    "최대 5 MiB · 자산 최대 8개",
    "最大5 MiB · 資産は最大8件",
    "bis 5 MiB · bis zu 8 Assets",
    "hasta 5 MiB · hasta 8 activos"
  ],
  "↻ Загрузить демоданные": [
    "↻ Load demo data",
    "↻ 데모 데이터 불러오기",
    "↻ デモデータを読み込む",
    "↻ Demodaten laden",
    "↻ Cargar datos de ejemplo"
  ],
  "Ваши данные — у вас": [
    "Your data stays with you",
    "데이터는 내 기기에",
    "データは手元に",
    "Ihre Daten bleiben bei Ihnen",
    "Tus datos, bajo tu control"
  ],
  "CSV остаются в браузере.": [
    "CSV files stay in your browser.",
    "CSV 파일은 브라우저에만 남습니다.",
    "CSVファイルはブラウザー内に保持されます。",
    "CSV-Dateien bleiben im Browser.",
    "Los archivos CSV permanecen en tu navegador."
  ],
  "Ключ передаётся только CoinGecko.": [
    "The key is sent only to CoinGecko.",
    "키는 CoinGecko에만 전송됩니다.",
    "キーはCoinGeckoにのみ送信されます。",
    "Der Schlüssel wird nur an CoinGecko gesendet.",
    "La clave se envía únicamente a CoinGecko."
  ],
  "Рабочая область": [
    "Workspace",
    "작업 공간",
    "ワークスペース",
    "Arbeitsbereich",
    "Espacio de trabajo"
  ],
  "Язык": [
    "Language",
    "언어",
    "言語",
    "Sprache",
    "Idioma"
  ],
  "Локальные расчёты": [
    "Local calculations",
    "로컬 계산",
    "ローカル計算",
    "Lokale Berechnungen",
    "Cálculos locales"
  ],
  "МЕНЬШЕ ШУМА. БОЛЬШЕ КОНТЕКСТА.": [
    "LESS NOISE. MORE CONTEXT.",
    "잡음은 줄이고, 맥락은 더하고.",
    "ノイズを減らし、背景を知る。",
    "WENIGER RAUSCHEN. MEHR KONTEXT.",
    "MENOS RUIDO. MÁS CONTEXTO."
  ],
  "Данные в перспективе": [
    "Data in perspective",
    "맥락으로 보는 데이터",
    "データを広い視点で",
    "Daten im Kontext",
    "Los datos en perspectiva"
  ],
  "Цена, просадка и сравнение — в одном исследовании.": [
    "Price, drawdown and comparisons in one research workspace.",
    "가격, 낙폭, 비교를 하나의 분석 공간에서 확인하세요.",
    "価格、ドローダウン、比較をひとつの分析画面で。",
    "Kurs, Drawdown und Vergleiche in einer Analyse.",
    "Precio, caídas y comparaciones en un mismo análisis."
  ],
  "Экспорт отчёта": [
    "Export report",
    "보고서 내보내기",
    "レポートを書き出す",
    "Bericht exportieren",
    "Exportar informe"
  ],
  "РЕАЛЬНЫЕ ДАННЫЕ": [
    "MARKET DATA",
    "시장 데이터",
    "市場データ",
    "MARKTDATEN",
    "DATOS DEL MERCADO"
  ],
  "Подключите рынок к исследованию": [
    "Bring market data into your research",
    "시장 데이터로 분석 시작하기",
    "市場データで分析を始める",
    "Marktdaten für Ihre Analyse",
    "Incorpora datos del mercado a tu análisis"
  ],
  "Подключить CoinGecko": [
    "Connect CoinGecko",
    "CoinGecko 연결",
    "CoinGeckoに接続",
    "CoinGecko verbinden",
    "Conectar CoinGecko"
  ],
  "Поиск монеты CoinGecko": [
    "Search CoinGecko coins",
    "CoinGecko 코인 검색",
    "CoinGeckoのコインを検索",
    "CoinGecko-Coins suchen",
    "Buscar monedas en CoinGecko"
  ],
  "Название или тикер: Bitcoin, SOL…": [
    "Name or ticker: Bitcoin, SOL…",
    "이름 또는 티커: Bitcoin, SOL…",
    "名前またはティッカー: Bitcoin, SOL…",
    "Name oder Kürzel: Bitcoin, SOL…",
    "Nombre o símbolo: Bitcoin, SOL…"
  ],
  "Найти": [
    "Search",
    "검색",
    "検索",
    "Suchen",
    "Buscar"
  ],
  "История": [
    "History",
    "불러올 기간",
    "取得期間",
    "Verlauf",
    "Historial"
  ],
  "7 дней": [
    "7 days",
    "7일",
    "7日間",
    "7 Tage",
    "7 días"
  ],
  "30 дней": [
    "30 days",
    "30일",
    "30日間",
    "30 Tage",
    "30 días"
  ],
  "90 дней": [
    "90 days",
    "90일",
    "90日間",
    "90 Tage",
    "90 días"
  ],
  "365 дней": [
    "365 days",
    "365일",
    "365日間",
    "365 Tage",
    "365 días"
  ],
  "Новый запрос к CoinGecko, без кэша приложения": [
    "New CoinGecko request, bypassing the app cache",
    "앱 캐시를 건너뛰고 CoinGecko에 새로 요청",
    "アプリのキャッシュを使わずCoinGeckoに再取得",
    "Neue CoinGecko-Anfrage ohne App-Cache",
    "Nueva solicitud a CoinGecko, sin usar la caché de la aplicación"
  ],
  "↻ Обновить": [
    "↻ Refresh",
    "↻ 새로고침",
    "↻ 更新",
    "↻ Aktualisieren",
    "↻ Actualizar"
  ],
  "Отменить загрузку": [
    "Cancel loading",
    "불러오기 취소",
    "読み込みを中止",
    "Laden abbrechen",
    "Cancelar carga"
  ],
  "Быстро добавить:": [
    "Quick add:",
    "빠른 추가:",
    "クイック追加:",
    "Schnell hinzufügen:",
    "Añadir rápido:"
  ],
  "Ключ вводится один раз на открытую страницу": [
    "Enter your key once per open page",
    "열린 페이지에서 키를 한 번 입력하세요",
    "ページを開くたびにキーを入力してください",
    "Schlüssel einmal pro geöffneter Seite eingeben",
    "Introduce la clave una vez por página abierta"
  ],
  "Данные:": [
    "Data:",
    "데이터:",
    "データ:",
    "Daten:",
    "Datos:"
  ],
  "· обновление по запросу · кэш 5 минут": [
    "· refresh on request · 5-minute cache",
    "· 요청 시 갱신 · 5분 캐시",
    "· 操作時に更新 · キャッシュ5分",
    "· Aktualisierung auf Anfrage · 5 Minuten Cache",
    "· actualización a petición · caché de 5 minutos"
  ],
  "Настройки исследования": [
    "Research settings",
    "분석 설정",
    "分析設定",
    "Analyseeinstellungen",
    "Ajustes del análisis"
  ],
  "Нет данных": [
    "No data",
    "데이터 없음",
    "データなし",
    "Keine Daten",
    "Sin datos"
  ],
  "Период": [
    "Period",
    "표시 기간",
    "表示期間",
    "Zeitraum",
    "Período"
  ],
  "7Д": [
    "7D",
    "7일",
    "7日",
    "7T",
    "7D"
  ],
  "30Д": [
    "30D",
    "30일",
    "30日",
    "30T",
    "30D"
  ],
  "90Д": [
    "90D",
    "90일",
    "90日",
    "90T",
    "90D"
  ],
  "Вся уже загруженная история; новый запрос не выполняется": [
    "All history already loaded; no new API request",
    "이미 불러온 전체 기간이며 새 API 요청은 하지 않습니다",
    "読み込み済みの全期間。新しいAPIリクエストは行いません",
    "Alle bereits geladenen Daten; keine neue API-Anfrage",
    "Todo el historial cargado; no se realiza otra solicitud a la API"
  ],
  "Вся загрузка": [
    "All loaded",
    "전체 데이터",
    "読み込み済み全体",
    "Alles Geladene",
    "Todo lo cargado"
  ],
  "Показатели выбранного актива": [
    "Selected asset metrics",
    "선택한 자산의 지표",
    "選択した資産の指標",
    "Kennzahlen des gewählten Assets",
    "Indicadores del activo seleccionado"
  ],
  "Цена на конец периода": [
    "End-of-period price",
    "기간 말 가격",
    "期間終了時の価格",
    "Kurs am Periodenende",
    "Precio al final del período"
  ],
  "В выбранном периоде": [
    "In the selected period",
    "선택한 기간 내",
    "選択した期間内",
    "Im gewählten Zeitraum",
    "En el período seleccionado"
  ],
  "Изменение за период": [
    "Period change",
    "기간 변동률",
    "期間騰落率",
    "Änderung im Zeitraum",
    "Variación del período"
  ],
  "От первой до последней цены": [
    "From first to last price",
    "첫 가격부터 마지막 가격까지",
    "最初の価格から最後の価格まで",
    "Vom ersten bis zum letzten Kurs",
    "Del primer al último precio"
  ],
  "Макс. просадка": [
    "Max drawdown",
    "최대 낙폭",
    "最大ドローダウン",
    "Max. Drawdown",
    "Caída máxima"
  ],
  "От предшествующего пика": [
    "From the preceding peak",
    "이전 고점 대비",
    "直前の高値からの下落",
    "Vom vorherigen Höchststand",
    "Desde el máximo anterior"
  ],
  "Наблюдений": [
    "Observations",
    "관측값",
    "観測数",
    "Messpunkte",
    "Observaciones"
  ],
  "ДВИЖЕНИЕ РЫНКА": [
    "MARKET MOVEMENT",
    "시장 움직임",
    "市場の動き",
    "MARKTBEWEGUNG",
    "MOVIMIENTO DEL MERCADO"
  ],
  "Динамика цены": [
    "Price history",
    "가격 추이",
    "価格推移",
    "Kursverlauf",
    "Evolución del precio"
  ],
  "Вид графика": [
    "Chart view",
    "차트 보기",
    "チャート表示",
    "Diagrammansicht",
    "Vista del gráfico"
  ],
  "Цена": [
    "Price",
    "가격",
    "価格",
    "Kurs",
    "Precio"
  ],
  "Сравнение · 100": [
    "Compare · 100",
    "비교 · 100",
    "比較 · 100",
    "Vergleich · 100",
    "Comparar · 100"
  ],
  "Интерактивный график цены. Точные показатели доступны в таблице ниже.": [
    "Interactive price chart. Exact metrics are available in the table below.",
    "대화형 가격 차트입니다. 정확한 지표는 아래 표에서 확인하세요.",
    "操作できる価格チャートです。正確な指標は下の表で確認できます。",
    "Interaktives Kursdiagramm. Genaue Kennzahlen stehen in der Tabelle darunter.",
    "Gráfico de precios interactivo. Los indicadores exactos están en la tabla inferior."
  ],
  "Первое наблюдение каждого ряда в общем периоде = 100.": [
    "Each series starts at 100 within the common period.",
    "공통 기간에서 각 시계열의 첫 관측값을 100으로 환산합니다.",
    "共通期間における各系列の最初の観測値を100とします。",
    "Erster Messpunkt jeder Reihe im gemeinsamen Zeitraum = 100.",
    "La primera observación de cada serie en el período común equivale a 100."
  ],
  "Время — UTC": [
    "Time — UTC",
    "시간 — UTC",
    "時刻 — UTC",
    "Zeit — UTC",
    "Hora — UTC"
  ],
  "ОБРАТНАЯ СТОРОНА РОСТА": [
    "THE OTHER SIDE OF GROWTH",
    "상승 이면의 하락",
    "上昇の裏側",
    "DIE KEHRSEITE DES WACHSTUMS",
    "LA OTRA CARA DEL CRECIMIENTO"
  ],
  "Глубина просадки": [
    "Drawdown depth",
    "낙폭",
    "ドローダウンの深さ",
    "Drawdown-Tiefe",
    "Profundidad de la caída"
  ],
  "Просадка выбранного актива от предыдущего максимума в выбранном периоде.": [
    "Selected asset drawdown from its preceding peak within the selected period.",
    "선택한 기간 내 자산의 이전 고점 대비 낙폭입니다.",
    "選択した期間内で、資産が直前の高値からどれだけ下落したかを示します。",
    "Rückgang des gewählten Assets vom vorherigen Hoch im gewählten Zeitraum.",
    "Caída del activo desde su máximo anterior dentro del período seleccionado."
  ],
  "Пик отсчитывается заново с начала выбранного периода.": [
    "The running peak resets at the start of the selected period.",
    "누적 고점은 선택한 기간의 시작부터 다시 계산합니다.",
    "高値は選択した期間の開始時点から計算し直します。",
    "Der laufende Höchststand wird ab Periodenbeginn neu berechnet.",
    "El máximo acumulado se recalcula desde el inicio del período seleccionado."
  ],
  "ПРОВЕРКА ИСТОЧНИКА": [
    "SOURCE CHECK",
    "출처 확인",
    "ソースの確認",
    "QUELLENPRÜFUNG",
    "REVISIÓN DE LA FUENTE"
  ],
  "Качество данных": [
    "Data quality",
    "데이터 품질",
    "データ品質",
    "Datenqualität",
    "Calidad de los datos"
  ],
  "ОДИН ПЕРИОД. РАЗНЫЕ ТРАЕКТОРИИ.": [
    "ONE PERIOD. DIFFERENT PATHS.",
    "같은 기간, 서로 다른 흐름.",
    "同じ期間、異なる軌跡。",
    "EIN ZEITRAUM. VERSCHIEDENE VERLÄUFE.",
    "UN PERÍODO. DISTINTAS TRAYECTORIAS."
  ],
  "Сравнение активов": [
    "Asset comparison",
    "자산 비교",
    "資産比較",
    "Asset-Vergleich",
    "Comparación de activos"
  ],
  "0 рядов": [
    "0 series",
    "시계열 0개",
    "0系列",
    "0 Reihen",
    "0 series"
  ],
  "Актив": [
    "Asset",
    "자산",
    "資産",
    "Asset",
    "Activo"
  ],
  "Последняя цена": [
    "Last price",
    "마지막 가격",
    "最終価格",
    "Letzter Kurs",
    "Último precio"
  ],
  "Изменение": [
    "Change",
    "변동률",
    "騰落率",
    "Änderung",
    "Variación"
  ],
  "Период, UTC": [
    "Period, UTC",
    "기간, UTC",
    "期間、UTC",
    "Zeitraum, UTC",
    "Período, UTC"
  ],
  "Исторические наблюдения. Без прогнозов доходности и оценки надёжности токена.": [
    "Historical observations. No return forecasts or token safety assessment.",
    "과거 관측 데이터입니다. 수익률 예측이나 토큰 안전성 평가는 제공하지 않습니다.",
    "過去の観測データです。収益予測やトークンの安全性評価は行いません。",
    "Historische Messpunkte. Keine Renditeprognosen oder Bewertung der Token-Sicherheit.",
    "Observaciones históricas. Sin predicciones de rentabilidad ni evaluación de la seguridad del token."
  ],
  "Закрыть подключение CoinGecko": [
    "Close CoinGecko connection",
    "CoinGecko 연결 창 닫기",
    "CoinGecko接続画面を閉じる",
    "CoinGecko-Verbindung schließen",
    "Cerrar conexión de CoinGecko"
  ],
  "Вставьте бесплатный Demo API-ключ. После подключения загрузится история Bitcoin, Ethereum и Solana.": [
    "Paste your free Demo API key. Connecting loads the history of Bitcoin, Ethereum and Solana.",
    "무료 Demo API 키를 붙여넣으세요. 연결하면 Bitcoin, Ethereum, Solana의 과거 데이터를 불러옵니다.",
    "無料のDemo APIキーを貼り付けてください。接続するとBitcoin、Ethereum、Solanaの履歴を読み込みます。",
    "Kostenlosen Demo-API-Schlüssel einfügen. Beim Verbinden werden die Verläufe von Bitcoin, Ethereum und Solana geladen.",
    "Pega tu clave gratuita de la API Demo. Al conectar se cargará el historial de Bitcoin, Ethereum y Solana."
  ],
  "Demo API-ключ": [
    "Demo API key",
    "Demo API 키",
    "Demo APIキー",
    "Demo-API-Schlüssel",
    "Clave de API Demo"
  ],
  "Вставьте ключ из Developer Dashboard": [
    "Paste the key from Developer Dashboard",
    "Developer Dashboard의 키를 붙여넣으세요",
    "Developer Dashboardのキーを貼り付けてください",
    "Schlüssel aus dem Developer Dashboard einfügen",
    "Pega la clave del Developer Dashboard"
  ],
  "Ключ хранится только в памяти этой страницы и передаётся в заголовке запроса на api.coingecko.com. После закрытия страницы введите его заново.": [
    "The key stays in this page’s memory and is sent in a request header to api.coingecko.com. Enter it again after closing the page.",
    "키는 이 페이지의 메모리에만 보관되며 요청 헤더를 통해 api.coingecko.com으로 전송됩니다. 페이지를 닫은 후에는 다시 입력하세요.",
    "キーはこのページのメモリー内にのみ保持され、リクエストヘッダーでapi.coingecko.comに送信されます。ページを閉じた後は再入力してください。",
    "Der Schlüssel bleibt im Seitenspeicher und wird im Anfrage-Header an api.coingecko.com gesendet. Nach dem Schließen erneut eingeben.",
    "La clave solo se guarda en la memoria de esta página y se envía en una cabecera a api.coingecko.com. Vuelve a introducirla al cerrar la página."
  ],
  "Подключить и загрузить": [
    "Connect and load",
    "연결 후 불러오기",
    "接続して読み込む",
    "Verbinden und laden",
    "Conectar y cargar"
  ],
  "Отключить и очистить ключ": [
    "Disconnect and clear key",
    "연결 해제 및 키 삭제",
    "切断してキーを消去",
    "Trennen und Schlüssel löschen",
    "Desconectar y borrar la clave"
  ],
  "Открыть Developer Dashboard ↗": [
    "Open Developer Dashboard ↗",
    "Developer Dashboard 열기 ↗",
    "Developer Dashboardを開く ↗",
    "Developer Dashboard öffnen ↗",
    "Abrir Developer Dashboard ↗"
  ],
  "Загрузите свою историю": [
    "Load your own history",
    "내 과거 데이터 불러오기",
    "自分の履歴を読み込む",
    "Eigene Verlaufsdaten laden",
    "Carga tu propio historial"
  ],
  "Закрыть формат данных": [
    "Close data format",
    "데이터 형식 창 닫기",
    "データ形式の説明を閉じる",
    "Datenformat schließen",
    "Cerrar formato de datos"
  ],
  "Один актив в каждом UTF-8 CSV. Выберите несколько файлов, чтобы сравнить их.": [
    "One asset per UTF-8 CSV. Select multiple files to compare them.",
    "UTF-8 CSV 파일당 하나의 자산을 넣으세요. 여러 파일을 선택해 비교할 수 있습니다.",
    "UTF-8 CSVファイルごとに1つの資産を指定します。複数のファイルを選択して比較できます。",
    "Ein Asset pro UTF-8-CSV. Zum Vergleichen mehrere Dateien wählen.",
    "Un activo por archivo CSV UTF-8. Selecciona varios archivos para compararlos."
  ],
  "Нужны ровно столбцы timestamp, symbol, price — в любом порядке.": [
    "Use exactly timestamp, symbol, price columns, in any order.",
    "timestamp, symbol, price 열만 사용하세요. 순서는 자유입니다.",
    "列はtimestamp、symbol、priceの3つのみです。順序は任意です。",
    "Genau die Spalten timestamp, symbol, price verwenden; Reihenfolge beliebig.",
    "Usa exactamente las columnas timestamp, symbol y price, en cualquier orden."
  ],
  "Минимум две записи, уникальные даты с часовым поясом. Дробные секунды: до 3 знаков.": [
    "At least two records with unique timestamps and time zones. Up to 3 fractional-second digits.",
    "시간대가 포함된 고유한 시각의 기록이 최소 2개 필요합니다. 초 소수부는 최대 3자리입니다.",
    "タイムゾーン付きの重複しない日時が最低2件必要です。秒の小数部は最大3桁です。",
    "Mindestens zwei Einträge mit eindeutigen Zeitstempeln und Zeitzone. Bis zu 3 Nachkommastellen bei Sekunden.",
    "Al menos dos registros con fechas únicas y zona horaria. Hasta 3 cifras decimales en los segundos."
  ],
  "Цена от 1e-30 до 1e30. Один файл — одна пара, например BTC/USD.": [
    "Prices from 1e-30 to 1e30. One pair per file, for example BTC/USD.",
    "가격 범위는 1e-30~1e30입니다. 파일당 BTC/USD와 같은 하나의 거래쌍만 사용하세요.",
    "価格は1e-30〜1e30です。ファイルごとにBTC/USDなど1つのペアを指定します。",
    "Kurse von 1e-30 bis 1e30. Eine Paarung pro Datei, z. B. BTC/USD.",
    "Precios de 1e-30 a 1e30. Un par por archivo, por ejemplo BTC/USD."
  ],
  "До 5 МБ и 100 000 записей на файл; до 8 рядов одновременно.": [
    "Up to 5 MiB and 100,000 records per file; up to 8 series at once.",
    "파일당 최대 5 MiB, 100,000개 기록이며 동시에 최대 8개 시계열을 사용할 수 있습니다.",
    "ファイルごとに最大5 MiB、100,000件、同時に最大8系列までです。",
    "Bis zu 5 MiB und 100.000 Einträge pro Datei; bis zu 8 Reihen gleichzeitig.",
    "Hasta 5 MiB y 100.000 registros por archivo; hasta 8 series a la vez."
  ],
  "Даты сортируются автоматически. Интервалы не заполняются вымышленными ценами.": [
    "Dates are sorted automatically. Gaps are not filled with invented prices.",
    "날짜는 자동 정렬됩니다. 빈 구간을 가상의 가격으로 채우지 않습니다.",
    "日時は自動で並べ替えられます。欠損区間を架空の価格で埋めることはありません。",
    "Zeitstempel werden automatisch sortiert. Lücken werden nicht mit erfundenen Kursen gefüllt.",
    "Las fechas se ordenan automáticamente. Los huecos no se rellenan con precios inventados."
  ],
  "Название пары не проверяет подлинность актива. Сохраните сведения о бирже, сети и контракте отдельно.": [
    "A pair name does not verify the asset’s identity. Keep exchange, chain and contract details separately.",
    "거래쌍 이름만으로 자산의 진위를 확인할 수 없습니다. 거래소, 네트워크, 컨트랙트 정보는 별도로 기록하세요.",
    "ペア名だけでは資産の真正性を確認できません。取引所、チェーン、コントラクトの情報は別途保存してください。",
    "Ein Paarname bestätigt nicht die Echtheit eines Assets. Börse, Netzwerk und Vertrag separat dokumentieren.",
    "El nombre del par no verifica la autenticidad del activo. Guarda por separado los datos de la bolsa, red y contrato."
  ],
  "↓ Скачать пример CSV": [
    "↓ Download sample CSV",
    "↓ CSV 예제 다운로드",
    "↓ CSVサンプルをダウンロード",
    "↓ CSV-Beispiel herunterladen",
    "↓ Descargar CSV de ejemplo"
  ],
  "Сохранить исследование": [
    "Save research",
    "분석 저장",
    "分析を保存",
    "Analyse speichern",
    "Guardar análisis"
  ],
  "Закрыть экспорт": [
    "Close export",
    "내보내기 닫기",
    "エクスポートを閉じる",
    "Export schließen",
    "Cerrar exportación"
  ],
  "Показатели и отфильтрованные наблюдения текущего исследования. Если включено сравнение — только общий период. CSV экспортируется как таблица из пяти столбцов; для обратного импорта оставьте timestamp, symbol, price и один актив.": [
    "Metrics and filtered observations for this research. Comparison uses only the common period. CSV exports five columns; to reimport, keep timestamp, symbol, price and one asset.",
    "현재 분석의 지표와 필터링된 관측값입니다. 비교 시 공통 기간만 사용합니다. CSV는 5개 열로 내보냅니다. 다시 가져오려면 timestamp, symbol, price 열과 하나의 자산만 남기세요.",
    "現在の分析の指標と絞り込み済みの観測値です。比較では共通期間のみを使います。CSVは5列で出力します。再読込する場合はtimestamp、symbol、priceの3列と1つの資産だけを残してください。",
    "Kennzahlen und gefilterte Messpunkte dieser Analyse. Vergleiche nutzen nur den gemeinsamen Zeitraum. Der CSV-Export hat fünf Spalten; für den Import nur timestamp, symbol, price und ein Asset behalten.",
    "Indicadores y observaciones filtradas de este análisis. La comparación usa solo el período común. El CSV exporta cinco columnas; para reimportarlo, conserva timestamp, symbol, price y un solo activo."
  ],
  "Читаемый отчёт с таблицей и источниками": [
    "Readable report with a table and sources",
    "표와 출처를 포함한 보고서",
    "表と出典を含む読みやすいレポート",
    "Lesbarer Bericht mit Tabelle und Quellen",
    "Informe legible con tabla y fuentes"
  ],
  "Статистика, даты, источники и SHA-256 файлов": [
    "Statistics, dates, sources and file SHA-256 hashes",
    "통계, 날짜, 출처 및 파일 SHA-256 해시",
    "統計、日時、出典、ファイルのSHA-256ハッシュ",
    "Statistik, Zeitstempel, Quellen und SHA-256-Dateihashes",
    "Estadísticas, fechas, fuentes y hashes SHA-256 de los archivos"
  ],
  "Наблюдения выбранных рядов за текущий период": [
    "Selected series observations for the current period",
    "현재 기간의 선택된 시계열 관측값",
    "現在の期間の選択した系列の観測値",
    "Messpunkte der gewählten Reihen im aktuellen Zeitraum",
    "Observaciones de las series seleccionadas para el período actual"
  ],
  "График SVG": [
    "SVG chart",
    "SVG 차트",
    "SVGチャート",
    "SVG-Diagramm",
    "Gráfico SVG"
  ],
  "Векторный график для заметок и публикаций": [
    "Vector chart for notes and publications",
    "메모와 게시물용 벡터 차트",
    "メモや公開用のベクターチャート",
    "Vektordiagramm für Notizen und Veröffentlichungen",
    "Gráfico vectorial para notas y publicaciones"
  ],
  "Браузер считает с обычной числовой точностью JavaScript. Для десятичных расчётов используйте Python CLI.": [
    "The browser uses JavaScript floating-point arithmetic. Use the Python CLI for decimal calculations.",
    "브라우저는 JavaScript 부동소수점 연산을 사용합니다. 정확한 십진수 계산에는 Python CLI를 사용하세요.",
    "ブラウザーはJavaScriptの浮動小数点演算を使います。十進数の計算にはPython CLIを使用してください。",
    "Der Browser nutzt JavaScript-Gleitkommaarithmetik. Für Dezimalberechnungen die Python-CLI verwenden.",
    "El navegador usa aritmética de coma flotante de JavaScript. Usa la CLI de Python para cálculos decimales."
  ],
  "CSV обрабатываются локально и не сохраняются после закрытия страницы. Вы смотрите загруженную историю.": [
    "CSV files are processed locally and cleared when you close the page. You are viewing imported history.",
    "CSV 파일은 로컬에서 처리되며 페이지를 닫으면 지워집니다. 현재 가져온 과거 데이터를 보고 있습니다.",
    "CSVはローカルで処理され、ページを閉じると消去されます。表示中のデータは読み込んだ履歴です。",
    "CSV-Dateien werden lokal verarbeitet und beim Schließen der Seite gelöscht. Angezeigt werden importierte Verlaufsdaten.",
    "Los CSV se procesan localmente y se borran al cerrar la página. Estás viendo el historial importado."
  ],
  "CoinGecko вернул некорректную историю.": [
    "CoinGecko returned invalid history data.",
    "CoinGecko가 잘못된 과거 데이터를 반환했습니다.",
    "CoinGeckoから無効な履歴データが返されました。",
    "CoinGecko hat ungültige Verlaufsdaten geliefert.",
    "CoinGecko devolvió un historial no válido."
  ],
  "CoinGecko вернул ответ не в формате JSON. Попробуйте позже.": [
    "CoinGecko returned a non-JSON response. Try again later.",
    "CoinGecko 응답이 JSON 형식이 아닙니다. 나중에 다시 시도하세요.",
    "CoinGeckoの応答がJSON形式ではありません。後でもう一度お試しください。",
    "CoinGecko hat keine JSON-Antwort geliefert. Später erneut versuchen.",
    "CoinGecko devolvió una respuesta que no es JSON. Inténtalo más tarde."
  ],
  "CoinGecko временно не отдал данные. Попробуйте позже.": [
    "CoinGecko could not provide data right now. Try again later.",
    "CoinGecko에서 현재 데이터를 가져올 수 없습니다. 나중에 다시 시도하세요.",
    "現在CoinGeckoからデータを取得できません。後でもう一度お試しください。",
    "CoinGecko liefert derzeit keine Daten. Später erneut versuchen.",
    "CoinGecko no pudo proporcionar datos en este momento. Inténtalo más tarde."
  ],
  "CoinGecko заблокировал запрос. Проверьте доступ к сервису из вашей сети.": [
    "CoinGecko blocked the request. Check access from your network.",
    "CoinGecko가 요청을 차단했습니다. 현재 네트워크에서 서비스에 접속할 수 있는지 확인하세요.",
    "CoinGeckoがリクエストをブロックしました。利用中のネットワークから接続できるか確認してください。",
    "CoinGecko hat die Anfrage blockiert. Erreichbarkeit aus Ihrem Netzwerk prüfen.",
    "CoinGecko bloqueó la solicitud. Comprueba el acceso desde tu red."
  ],
  "CoinGecko не ответил за 20 секунд. Попробуйте ещё раз.": [
    "CoinGecko did not respond within 20 seconds. Try again.",
    "CoinGecko가 20초 안에 응답하지 않았습니다. 다시 시도하세요.",
    "CoinGeckoから20秒以内に応答がありませんでした。再試行してください。",
    "CoinGecko hat nicht innerhalb von 20 Sekunden geantwortet. Erneut versuchen.",
    "CoinGecko no respondió en 20 segundos. Inténtalo de nuevo."
  ],
  "CoinGecko не принял ключ. Проверьте Demo API-ключ и подключитесь заново.": [
    "CoinGecko rejected the key. Check your Demo API key and reconnect.",
    "CoinGecko가 키를 거부했습니다. Demo API 키를 확인하고 다시 연결하세요.",
    "CoinGeckoがキーを受け付けませんでした。Demo APIキーを確認して再接続してください。",
    "CoinGecko hat den Schlüssel abgelehnt. Demo-API-Schlüssel prüfen und erneut verbinden.",
    "CoinGecko rechazó la clave. Comprueba tu clave de API Demo y vuelve a conectar."
  ],
  "CoinGecko подключён · настройки": [
    "CoinGecko connected · settings",
    "CoinGecko 연결됨 · 설정",
    "CoinGecko接続済み · 設定",
    "CoinGecko verbunden · Einstellungen",
    "CoinGecko conectado · ajustes"
  ],
  "UTC · проверен": [
    "UTC · validated",
    "UTC · 검증됨",
    "UTC · 検証済み",
    "UTC · geprüft",
    "UTC · validada"
  ],
  "{count} ряд(а)": [
    "{count} series",
    "시계열 {count}개",
    "{count}系列",
    "{count} Reihen",
    "{count} series"
  ],
  "{count} точек": [
    "{count} points",
    "관측값 {count}개",
    "{count}点",
    "{count} Punkte",
    "{count} puntos"
  ],
  "{source} · история {days} дн. · получено {date} UTC": [
    "{source} · {days}-day history · fetched {date} UTC",
    "{source} · {days}일 데이터 · 조회 {date} UTC",
    "{source} · {days}日間の履歴 · 取得 {date} UTC",
    "{source} · {days} Tage Verlauf · abgerufen {date} UTC",
    "{source} · historial de {days} días · obtenido {date} UTC"
  ],
  "{value} дн.": [
    "{value} d",
    "{value}일",
    "{value}日",
    "{value} T.",
    "{value} d"
  ],
  "{value} мин.": [
    "{value} min",
    "{value}분",
    "{value}分",
    "{value} Min.",
    "{value} min"
  ],
  "{value} сек.": [
    "{value} s",
    "{value}초",
    "{value}秒",
    "{value} Sek.",
    "{value} s"
  ],
  "{value} ч": [
    "{value} h",
    "{value}시간",
    "{value}時間",
    "{value} Std.",
    "{value} h"
  ],
  "Ближайшие наблюдения каждого ряда": [
    "Nearest observation in each series",
    "각 시계열의 가장 가까운 관측값",
    "各系列の最も近い観測値",
    "Nächster Messpunkt jeder Reihe",
    "Observación más cercana de cada serie"
  ],
  "В выбранном периоде недостаточно общих наблюдений. Измените период или состав сравнения.": [
    "Not enough common observations in this period. Change the period or compared assets.",
    "이 기간에 공통 관측값이 부족합니다. 기간이나 비교할 자산을 변경하세요.",
    "この期間では共通の観測値が不足しています。期間または比較する資産を変更してください。",
    "Zu wenige gemeinsame Messpunkte in diesem Zeitraum. Zeitraum oder Auswahl ändern.",
    "No hay suficientes observaciones comunes. Cambia el período o los activos comparados."
  ],
  "В общем периоде нужно минимум два наблюдения для каждого актива. Расширьте период или уберите актив.": [
    "Each asset needs at least two observations in the common period. Extend the period or remove an asset.",
    "공통 기간에 자산별 관측값이 최소 2개 필요합니다. 기간을 늘리거나 자산을 제외하세요.",
    "共通期間内に各資産の観測値が最低2件必要です。期間を広げるか資産を外してください。",
    "Jedes Asset braucht mindestens zwei Messpunkte im gemeinsamen Zeitraum. Zeitraum erweitern oder ein Asset abwählen.",
    "Cada activo necesita al menos dos observaciones en el período común. Amplía el período o quita un activo."
  ],
  "Введите от 2 до 64 символов для поиска.": [
    "Enter 2 to 64 characters to search.",
    "검색어를 2~64자로 입력하세요.",
    "検索語を2〜64文字で入力してください。",
    "2 bis 64 Zeichen für die Suche eingeben.",
    "Introduce entre 2 y 64 caracteres para buscar."
  ],
  "Вставьте целиком Demo API-ключ из CoinGecko Dashboard.": [
    "Paste the complete Demo API key from CoinGecko Dashboard.",
    "CoinGecko Dashboard의 Demo API 키 전체를 붙여넣으세요.",
    "CoinGecko DashboardのDemo APIキー全体を貼り付けてください。",
    "Vollständigen Demo-API-Schlüssel aus dem CoinGecko Dashboard einfügen.",
    "Pega la clave completa de API Demo del CoinGecko Dashboard."
  ],
  "Выберите 7, 30, 90 или 365 дней истории.": [
    "Choose 7, 30, 90 or 365 days of history.",
    "과거 데이터 기간을 7, 30, 90, 365일 중에서 선택하세요.",
    "取得期間は7日、30日、90日、365日から選択してください。",
    "7, 30, 90 oder 365 Tage Verlauf wählen.",
    "Elige 7, 30, 90 o 365 días de historial."
  ],
  "Выберите актив": [
    "Choose an asset",
    "자산 선택",
    "資産を選択",
    "Asset wählen",
    "Elige un activo"
  ],
  "Выберите актив для проверки.": [
    "Choose an asset to inspect.",
    "확인할 자산을 선택하세요.",
    "確認する資産を選択してください。",
    "Asset zur Prüfung wählen.",
    "Elige un activo para revisar."
  ],
  "Выбрать {asset}": [
    "Select {asset}",
    "{asset} 선택",
    "{asset}を選択",
    "{asset} auswählen",
    "Seleccionar {asset}"
  ],
  "Вымышленный демонстрационный ряд": [
    "Fictional demo series",
    "가상의 데모 시계열",
    "架空のデモ系列",
    "Fiktive Demoreihe",
    "Serie de ejemplo ficticia"
  ],
  "Вымышленный ряд · ежедневные наблюдения": [
    "Fictional series · daily observations",
    "가상 시계열 · 일별 관측값",
    "架空の系列 · 日次観測値",
    "Fiktive Reihe · tägliche Messpunkte",
    "Serie ficticia · observaciones diarias"
  ],
  "Данные не обновлены. Проверьте сообщение об ошибке.": [
    "Data was not updated. Check the error message.",
    "데이터가 갱신되지 않았습니다. 오류 메시지를 확인하세요.",
    "データは更新されていません。エラーメッセージを確認してください。",
    "Daten nicht aktualisiert. Fehlermeldung prüfen.",
    "Los datos no se actualizaron. Revisa el mensaje de error."
  ],
  "Дата: YYYY-MM-DDTHH:mm:ssZ или со смещением, например +04:00 (до 3 знаков миллисекунд).": [
    "Use YYYY-MM-DDTHH:mm:ssZ or a time-zone offset such as +04:00, with up to 3 fractional-second digits.",
    "날짜는 YYYY-MM-DDTHH:mm:ssZ 또는 +04:00 같은 시간대 오프셋을 사용하세요. 초 소수부는 최대 3자리입니다.",
    "日時はYYYY-MM-DDTHH:mm:ssZ、または+04:00などのオフセット付きで指定してください。秒の小数部は最大3桁です。",
    "YYYY-MM-DDTHH:mm:ssZ oder Zeitzonenversatz wie +04:00 verwenden; bis zu 3 Nachkommastellen bei Sekunden.",
    "Usa YYYY-MM-DDTHH:mm:ssZ o un desfase como +04:00, con hasta 3 cifras decimales en los segundos."
  ],
  "Демо": [
    "Demo",
    "데모",
    "デモ",
    "Demo",
    "Ejemplo"
  ],
  "Демонстрационные ALPHA, BETA и GAMMA — вымышленные активы. Это пример работы панели, не реальные котировки.": [
    "ALPHA, BETA and GAMMA are fictional demo assets. These are examples, not real market prices.",
    "ALPHA, BETA, GAMMA는 가상의 데모 자산입니다. 대시보드 사용 예시이며 실제 시세가 아닙니다.",
    "ALPHA、BETA、GAMMAは架空のデモ資産です。操作例であり、実際の相場ではありません。",
    "ALPHA, BETA und GAMMA sind fiktive Demo-Assets. Dies sind Beispiele, keine echten Marktkurse.",
    "ALPHA, BETA y GAMMA son activos ficticios de ejemplo. No son cotizaciones reales."
  ],
  "Для более длинной истории выберите 365 дней в списке «История» выше. Это не история с момента запуска монеты.": [
    "For a longer lookback, choose 365 days under History above. This is not the coin’s lifetime history.",
    "더 긴 기간은 위의 불러올 기간에서 365일을 선택하세요. 코인 출시 이후 전체 기록을 뜻하지는 않습니다.",
    "より長い期間を取得するには、上の取得期間で365日を選択してください。コインの開始以来の全履歴ではありません。",
    "Für einen längeren Verlauf oben unter Verlauf 365 Tage wählen. Dies ist nicht die gesamte Historie seit dem Start des Coins.",
    "Para ampliar el historial, elige 365 días en Historial. No es el historial completo desde el lanzamiento de la moneda."
  ],
  "Для демонстрации нужны три свободных места. Удалите ненужные ряды.": [
    "The demo needs three free slots. Remove unused series.",
    "데모에는 빈 슬롯 3개가 필요합니다. 필요 없는 시계열을 삭제하세요.",
    "デモには3件分の空きが必要です。不要な系列を削除してください。",
    "Für die Demo werden drei freie Plätze benötigt. Nicht benötigte Reihen entfernen.",
    "El ejemplo necesita tres espacios libres. Elimina las series que no uses."
  ],
  "Добавить": [
    "Add",
    "추가",
    "追加",
    "Hinzufügen",
    "Añadir"
  ],
  "Добавить {asset}": [
    "Add {asset}",
    "{asset} 추가",
    "{asset}を追加",
    "{asset} hinzufügen",
    "Añadir {asset}"
  ],
  "Добавьте первый набор данных.": [
    "Add your first dataset.",
    "첫 데이터 세트를 추가하세요.",
    "最初のデータセットを追加してください。",
    "Ersten Datensatz hinzufügen.",
    "Añade tu primer conjunto de datos."
  ],
  "Дождитесь завершения загрузки CoinGecko или нажмите «Отменить загрузку».": [
    "Wait for CoinGecko loading to finish or choose Cancel loading.",
    "CoinGecko 불러오기가 끝날 때까지 기다리거나 불러오기 취소를 누르세요.",
    "CoinGeckoの読み込み完了を待つか、読み込みを中止してください。",
    "Auf das Ende des CoinGecko-Ladevorgangs warten oder Laden abbrechen wählen.",
    "Espera a que termine la carga de CoinGecko o pulsa Cancelar carga."
  ],
  "Достигнут лимит CoinGecko. Подождите около минуты. Старые данные сохранены.": [
    "CoinGecko rate limit reached. Wait about a minute. Existing data is retained.",
    "CoinGecko 요청 한도에 도달했습니다. 약 1분 후에 다시 시도하세요. 기존 데이터는 유지됩니다.",
    "CoinGeckoのリクエスト上限に達しました。約1分お待ちください。既存データは保持されます。",
    "CoinGecko-Anfragelimit erreicht. Etwa eine Minute warten. Vorhandene Daten bleiben erhalten.",
    "Se alcanzó el límite de CoinGecko. Espera aproximadamente un minuto. Los datos anteriores se conservan."
  ],
  "Доступно для актива: {from} — {to}.": [
    "Available for this asset: {from} — {to}.",
    "이 자산의 사용 가능 기간: {from} — {to}.",
    "この資産の利用可能期間: {from} — {to}。",
    "Für dieses Asset verfügbar: {from} — {to}.",
    "Disponible para este activo: {from} — {to}."
  ],
  "Доступно для сравнения: {from} — {to}.": [
    "Available for comparison: {from} — {to}.",
    "비교 가능 기간: {from} — {to}.",
    "比較可能な期間: {from} — {to}。",
    "Für den Vergleich verfügbar: {from} — {to}.",
    "Disponible para comparar: {from} — {to}."
  ],
  "Загружено рядов: {loaded}. История: {days} дн. Выполнен новый запрос.": [
    "Loaded series: {loaded}. History: {days} days. A new request was made.",
    "불러온 시계열: {loaded}개. 기간: {days}일. 새로 요청했습니다.",
    "読み込み済み: {loaded}系列。履歴: {days}日。新しく取得しました。",
    "Geladene Reihen: {loaded}. Verlauf: {days} Tage. Neue Anfrage ausgeführt.",
    "Series cargadas: {loaded}. Historial: {days} días. Se realizó una nueva solicitud."
  ],
  "Загружено рядов: {loaded}. История: {days} дн. Ответы могут быть из кэша (5 минут).": [
    "Loaded series: {loaded}. History: {days} days. Responses may use the 5-minute cache.",
    "불러온 시계열: {loaded}개. 기간: {days}일. 5분 캐시 응답일 수 있습니다.",
    "読み込み済み: {loaded}系列。履歴: {days}日。5分間のキャッシュを使う場合があります。",
    "Geladene Reihen: {loaded}. Verlauf: {days} Tage. Antworten können aus dem 5-Minuten-Cache stammen.",
    "Series cargadas: {loaded}. Historial: {days} días. Las respuestas pueden proceder de la caché de 5 minutos."
  ],
  "Загрузите CSV или откройте пример.": [
    "Load a CSV or open the demo.",
    "CSV를 불러오거나 데모를 여세요.",
    "CSVを読み込むか、デモを開いてください。",
    "CSV laden oder Demo öffnen.",
    "Carga un CSV o abre el ejemplo."
  ],
  "Загрузка {coin}…": [
    "Loading {coin}…",
    "{coin} 불러오는 중…",
    "{coin}を読み込み中…",
    "{coin} wird geladen…",
    "Cargando {coin}…"
  ],
  "Загрузка отменена, ключ очищен. Уже загруженные данные сохранены. Для новых запросов подключитесь снова.": [
    "Loading cancelled and key cleared. Loaded data is retained. Reconnect for new requests.",
    "불러오기를 취소하고 키를 삭제했습니다. 이미 불러온 데이터는 유지됩니다. 새 요청을 하려면 다시 연결하세요.",
    "読み込みを中止し、キーを消去しました。取得済みデータは保持されます。新しく取得するには再接続してください。",
    "Laden abgebrochen, Schlüssel gelöscht. Geladene Daten bleiben erhalten. Für neue Anfragen erneut verbinden.",
    "Carga cancelada y clave borrada. Los datos cargados se conservan. Vuelve a conectar para hacer nuevas solicitudes."
  ],
  "Закрыть сообщение": [
    "Dismiss message",
    "메시지 닫기",
    "メッセージを閉じる",
    "Meldung schließen",
    "Cerrar mensaje"
  ],
  "Интервалов > 1,5× медианы": [
    "Intervals > 1.5× median",
    "중앙값의 1.5배를 넘는 간격",
    "中央値の1.5倍を超える間隔",
    "Intervalle > 1,5× Median",
    "Intervalos > 1,5× la mediana"
  ],
  "Интервалы равномерные.": [
    "Intervals are uniform.",
    "간격이 일정합니다.",
    "間隔は一定です。",
    "Die Intervalle sind gleichmäßig.",
    "Los intervalos son uniformes."
  ],
  "Источник: CoinGecko ID {id}. Отброшено некорректных / повторных записей API: {count}.": [
    "Source: CoinGecko ID {id}. Invalid or duplicate API rows excluded: {count}.",
    "출처: CoinGecko ID {id}. 제외된 잘못된 또는 중복 API 기록: {count}개.",
    "出典: CoinGecko ID {id}。除外した無効・重複APIレコード: {count}件。",
    "Quelle: CoinGecko-ID {id}. Entfernte ungültige oder doppelte API-Zeilen: {count}.",
    "Fuente: ID de CoinGecko {id}. Filas de API no válidas o duplicadas excluidas: {count}."
  ],
  "Ключ введён · настройки": [
    "Key entered · settings",
    "키 입력됨 · 설정",
    "キー入力済み · 設定",
    "Schlüssel eingegeben · Einstellungen",
    "Clave introducida · ajustes"
  ],
  "Ключ действует до закрытия страницы · кэш 5 минут": [
    "Key retained until page close · 5-minute cache",
    "페이지를 닫을 때까지 키 유지 · 5분 캐시",
    "ページを閉じるまでキーを保持 · キャッシュ5分",
    "Schlüssel bis zum Schließen der Seite · 5 Minuten Cache",
    "Clave hasta cerrar la página · caché de 5 minutos"
  ],
  "Кнопки периода фильтруют загруженные наблюдения. Сначала добавьте данные.": [
    "Period buttons filter loaded observations. Add data first.",
    "기간 버튼은 불러온 관측값을 필터링합니다. 먼저 데이터를 추가하세요.",
    "期間ボタンは読み込み済みの観測値を絞り込みます。まずデータを追加してください。",
    "Zeitraumtasten filtern geladene Messpunkte. Zuerst Daten hinzufügen.",
    "Los botones de período filtran las observaciones cargadas. Añade datos primero."
  ],
  "Лимит CoinGecko: подождите около минуты перед новым запросом.": [
    "CoinGecko rate limit: wait about a minute before requesting again.",
    "CoinGecko 요청 한도입니다. 약 1분 후에 다시 요청하세요.",
    "CoinGeckoのリクエスト上限です。再取得まで約1分お待ちください。",
    "CoinGecko-Anfragelimit: vor der nächsten Anfrage etwa eine Minute warten.",
    "Límite de CoinGecko: espera aproximadamente un minuto antes de volver a solicitar datos."
  ],
  "Локальная панель для исследования ценовых CSV: графики, просадки, сравнение и качество данных.": [
    "Local price-history research dashboard: charts, drawdowns, comparisons and data quality.",
    "가격 기록을 분석하는 로컬 대시보드: 차트, 낙폭, 비교, 데이터 품질.",
    "価格履歴を分析するローカルダッシュボード。チャート、ドローダウン、比較、データ品質を確認できます。",
    "Lokales Dashboard für Kursanalysen: Diagramme, Drawdowns, Vergleiche und Datenqualität.",
    "Panel local de análisis de precios: gráficos, caídas, comparaciones y calidad de datos."
  ],
  "Медианный интервал": [
    "Median interval",
    "간격 중앙값",
    "間隔の中央値",
    "Medianintervall",
    "Intervalo mediano"
  ],
  "Мин. {min} · макс. {max}": [
    "Min. {min} · max. {max}",
    "최저 {min} · 최고 {max}",
    "最小 {min} · 最大 {max}",
    "Min. {min} · Max. {max}",
    "Mín. {min} · máx. {max}"
  ],
  "Монета не найдена в CoinGecko.": [
    "Coin not found on CoinGecko.",
    "CoinGecko에서 코인을 찾지 못했습니다.",
    "CoinGeckoでコインが見つかりません。",
    "Coin bei CoinGecko nicht gefunden.",
    "Moneda no encontrada en CoinGecko."
  ],
  "Монеты не найдены. Попробуйте название или другой тикер.": [
    "No coins found. Try a name or another ticker.",
    "코인을 찾지 못했습니다. 이름이나 다른 티커로 검색하세요.",
    "コインが見つかりません。名前や別のティッカーをお試しください。",
    "Keine Coins gefunden. Namen oder anderes Kürzel versuchen.",
    "No se encontraron monedas. Prueba con un nombre u otro símbolo."
  ],
  "Найдено: {count}. Проверяйте CoinGecko ID перед выбором.": [
    "Found: {count}. Check the CoinGecko ID before choosing.",
    "검색 결과: {count}개. 선택 전 CoinGecko ID를 확인하세요.",
    "検索結果: {count}件。選択前にCoinGecko IDを確認してください。",
    "Gefunden: {count}. Vor der Auswahl die CoinGecko-ID prüfen.",
    "Resultados: {count}. Comprueba el ID de CoinGecko antes de elegir."
  ],
  "Начальная цена: {price}": [
    "Starting price: {price}",
    "시작 가격: {price}",
    "開始価格: {price}",
    "Anfangskurs: {price}",
    "Precio inicial: {price}"
  ],
  "Начните с CoinGecko: подключите ключ и загрузите реальные BTC, ETH и SOL. CSV и деморежим доступны отдельно.": [
    "Start with CoinGecko: connect a key to load real BTC, ETH and SOL history. CSV and demo data are also available.",
    "CoinGecko 키를 연결해 실제 BTC, ETH, SOL의 과거 데이터를 불러오세요. CSV와 데모 데이터도 사용할 수 있습니다.",
    "CoinGeckoのキーを接続して、実際のBTC、ETH、SOLの履歴を読み込めます。CSVとデモデータも利用できます。",
    "Mit CoinGecko starten: Schlüssel verbinden und echte BTC-, ETH- und SOL-Verläufe laden. CSV und Demo sind ebenfalls verfügbar.",
    "Conecta una clave de CoinGecko para cargar el historial real de BTC, ETH y SOL. También puedes usar CSV o datos de ejemplo."
  ],
  "Не более 100 000 наблюдений в одном файле.": [
    "No more than 100,000 observations per file.",
    "파일당 관측값은 100,000개 이하여야 합니다.",
    "観測値は1ファイルにつき100,000件までです。",
    "Höchstens 100.000 Messpunkte pro Datei.",
    "Como máximo 100.000 observaciones por archivo."
  ],
  "Не удалось прочитать результаты поиска CoinGecko.": [
    "Could not read CoinGecko search results.",
    "CoinGecko 검색 결과를 읽을 수 없습니다.",
    "CoinGeckoの検索結果を読み取れませんでした。",
    "CoinGecko-Suchergebnisse konnten nicht gelesen werden.",
    "No se pudieron leer los resultados de búsqueda de CoinGecko."
  ],
  "Недостаточно корректных наблюдений в ответе CoinGecko.": [
    "Not enough valid observations in CoinGecko’s response.",
    "CoinGecko 응답에 유효한 관측값이 부족합니다.",
    "CoinGeckoの応答に有効な観測値が不足しています。",
    "Zu wenige gültige Messpunkte in der CoinGecko-Antwort.",
    "La respuesta de CoinGecko no contiene suficientes observaciones válidas."
  ],
  "Незакрытые кавычки в CSV.": [
    "Unclosed quotes in CSV.",
    "CSV의 따옴표가 닫히지 않았습니다.",
    "CSVの引用符が閉じられていません。",
    "Nicht geschlossene Anführungszeichen in CSV.",
    "Comillas sin cerrar en el CSV."
  ],
  "Некорректная дата.": [
    "Invalid date.",
    "잘못된 날짜입니다.",
    "無効な日時です。",
    "Ungültiges Datum.",
    "Fecha no válida."
  ],
  "Некорректная кодировка UTF-8.": [
    "Invalid UTF-8 encoding.",
    "잘못된 UTF-8 인코딩입니다.",
    "UTF-8の文字コードが無効です。",
    "Ungültige UTF-8-Kodierung.",
    "Codificación UTF-8 no válida."
  ],
  "Некорректные кавычки в CSV.": [
    "Invalid quotes in CSV.",
    "CSV의 따옴표 형식이 잘못되었습니다.",
    "CSVの引用符の形式が不正です。",
    "Ungültige Anführungszeichen in CSV.",
    "Comillas no válidas en el CSV."
  ],
  "Некорректный CoinGecko ID.": [
    "Invalid CoinGecko ID.",
    "CoinGecko ID가 잘못되었습니다.",
    "CoinGecko IDが無効です。",
    "Ungültige CoinGecko-ID.",
    "ID de CoinGecko no válido."
  ],
  "Нерегулярных интервалов: {count}. Самый длинный: {interval}.": [
    "Irregular intervals: {count}. Longest: {interval}.",
    "불규칙한 간격: {count}개. 가장 긴 간격: {interval}.",
    "不規則な間隔: {count}件。最長: {interval}。",
    "Unregelmäßige Intervalle: {count}. Längstes: {interval}.",
    "Intervalos irregulares: {count}. El más largo: {interval}."
  ],
  "Несуществующая дата или время.": [
    "Date or time does not exist.",
    "존재하지 않는 날짜 또는 시간입니다.",
    "存在しない日付または時刻です。",
    "Datum oder Uhrzeit existiert nicht.",
    "La fecha o la hora no existe."
  ],
  "Нет данных.": [
    "No data.",
    "데이터가 없습니다.",
    "データがありません。",
    "Keine Daten.",
    "Sin datos."
  ],
  "Нет общего периода": [
    "No common period",
    "공통 기간 없음",
    "共通期間なし",
    "Kein gemeinsamer Zeitraum",
    "Sin período común"
  ],
  "Нет связи с CoinGecko. Проверьте интернет; возможна блокировка сети или CORS. CSV и деморежим доступны.": [
    "Cannot reach CoinGecko. Check your connection; network or CORS restrictions may apply. CSV and demo data remain available.",
    "CoinGecko에 연결할 수 없습니다. 인터넷 연결, 네트워크 차단 또는 CORS 제한을 확인하세요. CSV와 데모 데이터는 계속 사용할 수 있습니다.",
    "CoinGeckoに接続できません。接続状況やネットワーク・CORSの制限を確認してください。CSVとデモは引き続き利用できます。",
    "CoinGecko nicht erreichbar. Internetverbindung prüfen; Netzwerk- oder CORS-Sperren sind möglich. CSV und Demo bleiben verfügbar.",
    "No se puede conectar con CoinGecko. Comprueba internet; puede haber restricciones de red o CORS. CSV y los ejemplos siguen disponibles."
  ],
  "Нужно минимум два наблюдения.": [
    "At least two observations are required.",
    "관측값이 최소 2개 필요합니다.",
    "観測値が最低2件必要です。",
    "Mindestens zwei Messpunkte erforderlich.",
    "Se necesitan al menos dos observaciones."
  ],
  "Нужно свободное место: удалите ненужный ряд. Максимум — 8 активов.": [
    "Free a slot by removing an unused series. Maximum: 8 assets.",
    "필요 없는 시계열을 삭제해 공간을 확보하세요. 자산은 최대 8개입니다.",
    "不要な系列を削除して空きを作ってください。資産は最大8件です。",
    "Platz durch Entfernen einer Reihe schaffen. Höchstens 8 Assets.",
    "Libera espacio eliminando una serie que no uses. Máximo: 8 activos."
  ],
  "Нужны ровно три столбца: timestamp,symbol,price.": [
    "Exactly three columns are required: timestamp,symbol,price.",
    "timestamp,symbol,price의 3개 열만 필요합니다.",
    "列はtimestamp,symbol,priceの3つのみが必要です。",
    "Genau drei Spalten erforderlich: timestamp,symbol,price.",
    "Se requieren exactamente tres columnas: timestamp,symbol,price."
  ],
  "Обновлено {loaded} из {total} рядов. Остальные не обновлены — проверьте их период и время загрузки.": [
    "Updated {loaded} of {total} series. The others were not updated; check their lookback and fetch time.",
    "{total}개 중 {loaded}개 시계열을 갱신했습니다. 나머지는 갱신되지 않았으니 기간과 조회 시각을 확인하세요.",
    "{total}系列中{loaded}系列を更新しました。他の系列は更新されていません。取得期間と取得時刻を確認してください。",
    "{loaded} von {total} Reihen aktualisiert. Die übrigen sind unverändert; Zeitraum und Abrufzeit prüfen.",
    "Se actualizaron {loaded} de {total} series. Las demás no se actualizaron; revisa su período y hora de obtención."
  ],
  "Одновременно можно открыть до 8 рядов. Удалите ненужные.": [
    "Up to 8 series can be open at once. Remove unused ones.",
    "동시에 최대 8개 시계열을 열 수 있습니다. 필요 없는 항목을 삭제하세요.",
    "同時に開けるのは8系列までです。不要な系列を削除してください。",
    "Bis zu 8 Reihen gleichzeitig. Nicht benötigte Reihen entfernen.",
    "Puedes abrir hasta 8 series a la vez. Elimina las que no uses."
  ],
  "Подключение отключено.": [
    "Connection closed.",
    "연결이 종료되었습니다.",
    "接続が切断されました。",
    "Verbindung getrennt.",
    "Conexión cerrada."
  ],
  "Подключите CoinGecko или загрузите CSV": [
    "Connect CoinGecko or load a CSV",
    "CoinGecko를 연결하거나 CSV를 불러오세요",
    "CoinGeckoに接続するかCSVを読み込んでください",
    "CoinGecko verbinden oder CSV laden",
    "Conecta CoinGecko o carga un CSV"
  ],
  "Поиск в CoinGecko…": [
    "Searching CoinGecko…",
    "CoinGecko 검색 중…",
    "CoinGeckoで検索中…",
    "CoinGecko wird durchsucht…",
    "Buscando en CoinGecko…"
  ],
  "Показана вся загруженная история.": [
    "Showing all loaded history.",
    "불러온 전체 기간을 표시합니다.",
    "読み込み済みの全期間を表示しています。",
    "Der gesamte geladene Verlauf wird angezeigt.",
    "Se muestra todo el historial cargado."
  ],
  "Последнее наблюдение": [
    "Last observation",
    "마지막 관측값",
    "最後の観測値",
    "Letzter Messpunkt",
    "Última observación"
  ],
  "Пропуски оцениваются по интервалам, а не по расписанию источника. Подлинность и полнота данных не проверены.": [
    "Gaps are estimated from intervals, not the source schedule. Authenticity and completeness are not verified.",
    "누락은 출처의 일정이 아닌 관측 간격으로 추정합니다. 데이터의 진위와 완전성은 검증하지 않습니다.",
    "欠損は提供元の予定ではなく観測間隔から推定します。データの真正性と完全性は検証していません。",
    "Lücken werden anhand der Intervalle geschätzt, nicht anhand eines Quellenzeitplans. Echtheit und Vollständigkeit sind nicht geprüft.",
    "Los huecos se estiman por intervalos, no por el calendario de la fuente. La autenticidad e integridad no están verificadas."
  ],
  "Размер файла не должен превышать 5 МБ.": [
    "File size must not exceed 5 MiB.",
    "파일 크기는 5 MiB를 넘을 수 없습니다.",
    "ファイルサイズは5 MiB以下にしてください。",
    "Die Datei darf 5 MiB nicht überschreiten.",
    "El archivo no debe superar 5 MiB."
  ],
  "Реальная история CoinGecko в USD. Это снимок на момент загрузки; обновление — по кнопке. Цены могут запаздывать.": [
    "Real CoinGecko history in USD, as fetched. Refresh with the button. Prices may be delayed.",
    "불러온 시점의 실제 CoinGecko USD 과거 데이터입니다. 버튼으로 새로고침하세요. 가격은 지연될 수 있습니다.",
    "取得時点のCoinGeckoの実際のUSD履歴です。ボタンで更新してください。価格は遅延する場合があります。",
    "Echter CoinGecko-Verlauf in USD zum Abrufzeitpunkt. Per Schaltfläche aktualisieren. Kurse können verzögert sein.",
    "Historial real de CoinGecko en USD al obtenerlo. Actualiza con el botón. Los precios pueden tener retraso."
  ],
  "Сравнение траекторий": [
    "Compare trajectories",
    "추이 비교",
    "推移を比較",
    "Verläufe vergleichen",
    "Comparar trayectorias"
  ],
  "Сравнивать {asset}": [
    "Compare {asset}",
    "{asset} 비교",
    "{asset}を比較",
    "{asset} vergleichen",
    "Comparar {asset}"
  ],
  "Строки автоматически отсортированы.": [
    "Rows were sorted automatically.",
    "기록을 자동으로 정렬했습니다.",
    "行は自動で並べ替えられました。",
    "Zeilen wurden automatisch sortiert.",
    "Las filas se ordenaron automáticamente."
  ],
  "У выбранных активов нет общего периода.": [
    "Selected assets have no common period.",
    "선택한 자산에 공통 기간이 없습니다.",
    "選択した資産に共通する期間がありません。",
    "Die gewählten Assets haben keinen gemeinsamen Zeitraum.",
    "Los activos seleccionados no tienen un período común."
  ],
  "У выбранных рядов нет общего периода. Оставьте совместимые ряды или выберите «Цена».": [
    "The selected series have no common period. Keep overlapping series or choose Price.",
    "선택한 시계열에 공통 기간이 없습니다. 기간이 겹치는 시계열만 남기거나 가격 보기를 선택하세요.",
    "選択した系列に共通期間がありません。期間が重なる系列だけを残すか、価格表示を選択してください。",
    "Die gewählten Reihen haben keinen gemeinsamen Zeitraum. Überlappende Reihen behalten oder Kurs wählen.",
    "Las series seleccionadas no tienen un período común. Mantén series que se solapen o elige Precio."
  ],
  "Удалить {asset}": [
    "Remove {asset}",
    "{asset} 삭제",
    "{asset}を削除",
    "{asset} entfernen",
    "Eliminar {asset}"
  ],
  "Файл превышает 5 МБ.": [
    "File exceeds 5 MiB.",
    "파일이 5 MiB를 초과합니다.",
    "ファイルが5 MiBを超えています。",
    "Datei überschreitet 5 MiB.",
    "El archivo supera 5 MiB."
  ],
  "Фильтр: последние {days} дн.": [
    "Filter: last {days} days.",
    "필터: 최근 {days}일.",
    "フィルター: 直近{days}日間。",
    "Filter: letzte {days} Tage.",
    "Filtro: últimos {days} días."
  ],
  "Цена выбранного актива в единицах исходной пары.": [
    "Selected asset price in the original pair’s quote units.",
    "원래 거래쌍의 호가 단위로 표시한 자산 가격입니다.",
    "元のペアの建値単位で表示した資産価格です。",
    "Kurs des gewählten Assets in der ursprünglichen Kurswährung.",
    "Precio del activo en las unidades de cotización del par original."
  ],
  "Часовой пояс": [
    "Time zone",
    "시간대",
    "タイムゾーン",
    "Zeitzone",
    "Zona horaria"
  ],
  "Эти данные недоступны на вашем тарифе CoinGecko.": [
    "This data is not available on your CoinGecko plan.",
    "현재 CoinGecko 요금제로는 이 데이터를 사용할 수 없습니다.",
    "このデータは利用中のCoinGeckoプランでは取得できません。",
    "Diese Daten sind in Ihrem CoinGecko-Tarif nicht verfügbar.",
    "Estos datos no están disponibles en tu plan de CoinGecko."
  ],
  "неверное число столбцов.": [
    "incorrect number of columns.",
    "열 수가 올바르지 않습니다.",
    "列の数が正しくありません。",
    "falsche Anzahl von Spalten.",
    "número de columnas incorrecto."
  ],
  "некорректный символ актива.": [
    "invalid asset symbol.",
    "자산 심볼이 잘못되었습니다.",
    "資産のシンボルが無効です。",
    "ungültiges Asset-Kürzel.",
    "símbolo de activo no válido."
  ],
  "один файл должен содержать одну пару.": [
    "each file must contain one pair.",
    "파일당 하나의 거래쌍만 포함해야 합니다.",
    "ファイルには1つのペアのみを含めてください。",
    "eine Datei darf nur eine Paarung enthalten.",
    "cada archivo debe contener un solo par."
  ],
  "повторяющийся момент времени после перевода в UTC.": [
    "duplicate timestamp after conversion to UTC.",
    "UTC 변환 후 중복되는 시각이 있습니다.",
    "UTC変換後に日時が重複しています。",
    "doppelter Zeitstempel nach UTC-Umrechnung.",
    "fecha duplicada después de convertir a UTC."
  ],
  "цена должна быть положительным числом от 1e-30 до 1e30, до 40 значащих цифр.": [
    "price must be positive, between 1e-30 and 1e30, with up to 40 significant digits.",
    "가격은 1e-30~1e30의 양수여야 하며 유효 숫자는 최대 40자리입니다.",
    "価格は1e-30〜1e30の正の数で、有効数字は最大40桁です。",
    "der Kurs muss positiv sein, zwischen 1e-30 und 1e30 liegen und höchstens 40 signifikante Ziffern haben.",
    "el precio debe ser positivo, entre 1e-30 y 1e30, con hasta 40 cifras significativas."
  ],
  "Запись {row}: {message}": [
    "Record {row}: {message}",
    "기록 {row}: {message}",
    "レコード{row}: {message}",
    "Eintrag {row}: {message}",
    "Registro {row}: {message}"
  ],
  "Не удалось обработать данные. Проверьте формат и попробуйте снова.": [
    "Could not process the data. Check the format and try again.",
    "데이터를 처리할 수 없습니다. 형식을 확인하고 다시 시도하세요.",
    "データを処理できませんでした。形式を確認して再試行してください。",
    "Daten konnten nicht verarbeitet werden. Format prüfen und erneut versuchen.",
    "No se pudieron procesar los datos. Comprueba el formato e inténtalo de nuevo."
  ],
  "Сохранённые наблюдения, а не поток котировок. Демоданные вымышленные.": [
    "Saved observations, not a live price feed. Demo data is fictional.",
    "저장된 관측값이며 실시간 시세가 아닙니다. 데모 데이터는 가상입니다.",
    "保存された観測値であり、リアルタイムの価格配信ではありません。デモデータは架空です。",
    "Gespeicherte Messpunkte, kein Live-Kursfeed. Demodaten sind fiktiv.",
    "Observaciones guardadas, no cotizaciones en directo. Los datos de ejemplo son ficticios."
  ],
  "Расчёты в браузере используют числа с плавающей точкой JavaScript.": [
    "Browser calculations use JavaScript floating-point numbers.",
    "브라우저 계산에는 JavaScript 부동소수점 숫자를 사용합니다.",
    "ブラウザーの計算にはJavaScriptの浮動小数点数を使用します。",
    "Browserberechnungen verwenden JavaScript-Gleitkommazahlen.",
    "Los cálculos del navegador usan números de coma flotante de JavaScript."
  ],
  "Просадка считается с начала выбранного периода. Ликвидность, безопасность и будущая доходность не оцениваются.": [
    "Drawdown resets at the selected period start. Liquidity, safety and future returns are not assessed.",
    "낙폭은 선택한 기간의 시작부터 계산합니다. 유동성, 안전성, 미래 수익률은 평가하지 않습니다.",
    "ドローダウンは選択した期間の開始時点から計算します。流動性、安全性、将来の収益は評価しません。",
    "Drawdown wird ab Periodenbeginn berechnet. Liquidität, Sicherheit und künftige Rendite werden nicht bewertet.",
    "La caída se calcula desde el inicio del período. No se evalúan la liquidez, seguridad ni rentabilidad futura."
  ],
  "Поиск пропусков — эвристика: интервал более 1,5× медианы.": [
    "Gap detection is a heuristic: intervals greater than 1.5× the median.",
    "누락 탐지는 간격이 중앙값의 1.5배를 초과하는지 보는 추정 방식입니다.",
    "欠損の検出は、間隔が中央値の1.5倍を超えるかによる推定です。",
    "Lückenerkennung ist eine Heuristik: Intervalle über dem 1,5-Fachen des Medians.",
    "La detección de huecos es una heurística: intervalos superiores a 1,5 veces la mediana."
  ],
  "Рыночные данные предоставлены CoinGecko": [
    "Market data provided by CoinGecko",
    "시장 데이터 제공: CoinGecko",
    "市場データ提供: CoinGecko",
    "Marktdaten bereitgestellt von CoinGecko",
    "Datos del mercado proporcionados por CoinGecko"
  ],
  "Ряд": [
    "Series",
    "시계열",
    "系列",
    "Reihe",
    "Serie"
  ],
  "Вымышленный": [
    "Synthetic",
    "가상",
    "架空",
    "Fiktiv",
    "Ficticio"
  ],
  "Первая цена": [
    "First price",
    "첫 가격",
    "最初の価格",
    "Erster Kurs",
    "Primer precio"
  ],
  "Изменение (%)": [
    "Change (%)",
    "변동률 (%)",
    "騰落率 (%)",
    "Änderung (%)",
    "Variación (%)"
  ],
  "Макс. просадка (%)": [
    "Max drawdown (%)",
    "최대 낙폭 (%)",
    "最大ドローダウン (%)",
    "Max. Drawdown (%)",
    "Caída máxima (%)"
  ],
  "Создано: {date}": [
    "Generated: {date}",
    "생성 시각: {date}",
    "作成日時: {date}",
    "Erstellt: {date}",
    "Generado: {date}"
  ],
  "Период (UTC): {from} — {to}": [
    "Period (UTC): {from} — {to}",
    "기간 (UTC): {from} — {to}",
    "期間 (UTC): {from} — {to}",
    "Zeitraum (UTC): {from} — {to}",
    "Período (UTC): {from} — {to}"
  ],
  "Да": [
    "Yes",
    "예",
    "はい",
    "Ja",
    "Sí"
  ],
  "Нет": [
    "No",
    "아니요",
    "いいえ",
    "Nein",
    "No"
  ],
  "Источники": [
    "Sources",
    "출처",
    "出典",
    "Quellen",
    "Fuentes"
  ],
  "неприменимо / недоступно": [
    "not applicable / unavailable",
    "해당 없음 / 사용 불가",
    "該当なし / 利用不可",
    "nicht zutreffend / nicht verfügbar",
    "no aplicable / no disponible"
  ],
  "Фактический период UTC: {from} — {to}; длинных интервалов: {count}.": [
    "Actual UTC range: {from} — {to}; long intervals: {count}.",
    "실제 UTC 기간: {from} — {to}; 긴 간격: {count}개.",
    "実際のUTC期間: {from} — {to}、長い間隔: {count}件。",
    "Tatsächlicher UTC-Zeitraum: {from} — {to}; lange Intervalle: {count}.",
    "Período real en UTC: {from} — {to}; intervalos largos: {count}."
  ],
  "Источник: {url}; получено: {date}.": [
    "Source: {url}; fetched: {date}.",
    "출처: {url}; 조회 시각: {date}.",
    "出典: {url}、取得日時: {date}。",
    "Quelle: {url}; abgerufen: {date}.",
    "Fuente: {url}; obtenido: {date}."
  ],
  "Ограничения": [
    "Limitations",
    "한계",
    "制約",
    "Einschränkungen",
    "Limitaciones"
  ],
  "Нормировано к 100": [
    "Normalized to 100",
    "100 기준 정규화",
    "100を基準に正規化",
    "Auf 100 normiert",
    "Normalizado a 100"
  ],
  "Сохранённые наблюдения. Без прогноза. График прорежен; показатели рассчитаны по всем наблюдениям.": [
    "Saved observations. No forecast. Chart is sampled; metrics use all observations.",
    "저장된 관측값입니다. 예측하지 않습니다. 차트는 간추려 표시하며 지표는 모든 관측값으로 계산합니다.",
    "保存された観測値です。予測ではありません。チャートは間引いて表示し、指標は全観測値で計算します。",
    "Gespeicherte Messpunkte. Keine Prognose. Diagramm ausgedünnt; Kennzahlen nutzen alle Messpunkte.",
    "Observaciones guardadas. Sin predicciones. El gráfico se simplifica; los indicadores usan todas las observaciones."
  ]
};
  function resolveLanguage(saved, preferred = []) {
    if (LANGUAGES.includes(saved)) return saved;
    for (const value of preferred) {
      const code = String(value).toLowerCase().split(/[-_]/)[0];
      if (LANGUAGES.includes(code)) return code;
    }
    return 'en';
  }
  let saved;
  try { saved = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY); } catch {}
  let language = resolveLanguage(saved, typeof navigator === 'undefined' ? [] : navigator.languages || [navigator.language]);
  const listeners = new Set();
  function has(key) { return Object.prototype.hasOwnProperty.call(MESSAGES, key); }
  function t(source, values = {}) {
    source = String(source);
    const template = language === 'ru' || !has(source) ? source : MESSAGES[source][INDEX[language]];
    return template.replace(/\{([a-z]+)\}/g, (match, key) => Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match);
  }
  function error(value) {
    const source = value instanceof Error ? value.message : String(value);
    if (has(source)) return t(source);
    const row = /^Запись (\d+): (.*)$/s.exec(source);
    if (row && has(row[2])) return t('Запись {row}: {message}', { row: row[1], message: t(row[2]) });
    return t('Не удалось обработать данные. Проверьте формат и попробуйте снова.');
  }
  function applyDOM(root = document) {
    root.documentElement.lang = language;
    root.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    for (const attr of ['aria-label', 'placeholder', 'title', 'content']) {
      root.querySelectorAll('[data-i18n-' + attr + ']').forEach(node => { node.setAttribute(attr, t(node.getAttribute('data-i18n-' + attr))); });
    }
    const select = root.getElementById('language-select'); if (select) select.value = language;
  }
  function setLanguage(value) {
    if (!LANGUAGES.includes(value)) return false;
    language = value;
    try { if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, language); } catch {}
    listeners.forEach(listener => listener(language)); return true;
  }
  return { t, error, has, applyDOM, setLanguage, language: () => language, locale: () => LOCALES[language],
    languages: LANGUAGES.slice(), resolveLanguage, onChange(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    // Exposed for complete-catalog validation; there are no user values in these records.
    messages: MESSAGES };
});
