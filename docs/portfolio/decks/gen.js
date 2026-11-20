// LeadRelay portfolio decks: RU + EN, two pages each, matching the original house style
// (Lato, #172F36 / #086962 / #435D62 / #153E42 / #EAF4F0 / #FBF2E7, A4, boxed tables).
// Copy v2 — rewritten from the full project audit: 336 tests, AES-256-GCM field encryption,
// transactional outbox delivery, 12 integrations, one-button Docker deploy.
// Run: node gen.js  ->  ../out/Презентация Бота.docx + Bot Presentation.docx
const fs = require("fs");
const {
  Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, Header, Footer,
  AlignmentType, BorderStyle, LineRuleType, PageNumber, ShadingType, TableLayoutType,
  WidthType, PageBreak,
} = require("docx");

// ---- palette & metrics (extracted from the source documents) -------------------------
const INK = "172F36";         // main text
const GREEN = "086962";       // section accents
const GRAY = "435D62";        // secondary text
const WHITE = "FFFFFF";
const MINT = "C6EEE1";        // light text on dark
const CREAM_LABEL = "865027"; // small label on cream
const FILL_DARK = "153E42";
const FILL_PALE = "EAF4F0";
const FILL_CREAM = "FBF2E7";
const FONT = "Lato";
const CONTENT_W = 9694;       // 11906 - 2*1106

const LINE = (n) => ({ line: n, lineRule: LineRuleType.AUTO });
const run = (text, { sz = 28, color = INK, bold = false } = {}) =>
  new TextRun({ text, bold, color, size: sz, font: FONT });

const P = (children, opts = {}) => new Paragraph({ children, ...opts });
const text = (t, o) => P([run(t, o)], o);

const NONE = { style: BorderStyle.NONE, size: 0, color: "auto" };
const boxBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };

function box({ widths, cells, margins }) {
  return new Table({
    alignment: AlignmentType.CENTER,
    layout: TableLayoutType.FIXED,
    borders: boxBorders,
    margins: { marginUnitType: WidthType.DXA, top: margins[0], bottom: margins[0], left: margins[1], right: margins[1] },
    columnWidths: widths,
    rows: [new TableRow({
      children: cells.map(({ fill, paras }, i) => new TableCell({
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR, color: "auto" },
        children: paras,
      })),
    })],
  });
}

const wide = (fill, paras, margins) => box({ widths: [CONTENT_W], cells: [{ fill, paras }], margins });

const H1 = (t) => text(t, { sz: 66, bold: true, color: INK, spacing: { before: 0, after: 160, ...LINE(242) } });
const SUB = (t, after = 100) => text(t, { sz: 30, color: INK, spacing: { before: 0, after, ...LINE(276) } });
const LABEL = (t, before = 380) => text(t, { sz: 34, bold: true, color: GREEN, spacing: { before, after: 140, ...LINE(276) } });
const SMALL = (t, color = GREEN) => text(t, { sz: 22, bold: true, color, spacing: { before: 0, after: 60, ...LINE(276) } });
const BODY = (t, { sz = 28, color = INK, bold = false, before = 0, after = 0 } = {}) =>
  text(t, { sz, color, bold, spacing: { before, after, ...LINE(276) } });
const PAIR = (head, tail, after = 120) => [
  BODY(head, { bold: true, before: 60, after: 20 }),
  BODY(tail, { color: GRAY, after }),
];

const pageBreak = () => P([new PageBreak()]);

function deck({ h2, page1, page2, footerLeft }) {
  return new Document({
    styles: { default: { document: { run: { font: FONT, size: 28, color: INK } } } },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1417, right: 1106, bottom: 1106, left: 1106, header: 482, footer: 482 },
        },
      },
      headers: {
        default: new Header({
          children: [P([
            run("LeadRelay", { sz: 34, bold: true, color: GREEN }),
            run("   " + h2, { sz: 20, color: GRAY }),
          ])],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            tabStops: [{ type: "right", position: CONTENT_W }],
            children: [
              run(footerLeft, { sz: 20, color: GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 20, color: INK, font: FONT }),
            ],
          })],
        }),
      },
      children: [...page1, pageBreak(), ...page2],
    }],
  });
}

// ---- RU ------------------------------------------------------------------------------
const ru = deck({
  h2: "Приём заявок в Telegram",
  footerLeft: "Бот для сервисных команд",
  page1: [
    H1("Клиент пишет в Telegram — менеджер уже видит заявку целиком"),
    SUB("Телефон, суть и срочность приходят в карточку до первого звонка. Пока конкурент переспрашивает «вы кто?», ваш человек уже набирает номер."),
    LABEL("30 секунд из жизни заявки"),
    wide(FILL_CREAM, [
      SMALL("Сообщение клиента", CREAM_LABEL),
      BODY("«Под мойкой лужа, перекрыла воду. Можно мастера на сегодня?»", { sz: 34 }),
    ], [195, 205]),
    box({
      widths: [5953, 3742],
      margins: [130, 205],
      cells: [
        { fill: FILL_DARK, paras: [BODY("Протечка под мойкой", { sz: 34, bold: true, color: WHITE })] },
        { fill: FILL_DARK, paras: [BODY("Срочная — горячая", { sz: 26, bold: true, color: MINT })] },
      ],
    }),
    box({
      widths: [4592, 5102],
      margins: [220, 205],
      cells: [
        { fill: FILL_PALE, paras: [
          SMALL("Что известно"),
          BODY("Квартира. Вода перекрыта."),
          BODY("Телефон оставлен."),
        ]},
        { fill: FILL_PALE, paras: [
          SMALL("Что делает менеджер"),
          BODY("Нажимает «Взять» и отвечает из чата."),
        ]},
      ],
    }),
    SMALL("Ответ клиенту в Telegram"),
    BODY("«Мастер может приехать в 15:00. Вам удобно?»", { sz: 30, bold: true, before: 60, after: 140 }),
    LABEL("Кому это уже нужно"),
    BODY("Выездным службам, клиникам, агентствам — везде, где заявки принимают в Telegram, а обрабатывают в CRM. Семь готовых отраслевых настроек: от сантехники до юруслуг."),
  ],
  page2: [
    H1("Ваши вопросы. Ваша CRM. Ваш код."),
    SUB("Настраиваю форму под ваши услуги: заявка из Telegram становится лидом в Битрикс24 — телефон, описание, источник.", 40),
    LABEL("Что вы получаете"),
    ...PAIR("Форма, которая спрашивает по делу", "Менеджер до звонка знает, что случилось. Вопросы, часы работы, признаки срочности — ваши."),
    ...PAIR("Доставка без потерь", "CRM не отвечала? Заявка ждёт в базе и доходит сама — повторами до часа, без дублей."),
    ...PAIR("Порядок в личных данных", "AES-256-GCM на каждое поле, зашифрованные бэкапы, панель со здоровьем интеграций.", 240),
    BODY("12 подключений", { bold: true, color: GREEN, before: 60, after: 40 }),
    BODY("Битрикс24, amoCRM / Kommo, RetailCRM, HubSpot, Pipedrive, Zoho, Salesforce, GoHighLevel, Google Sheets, Slack, почта, Zapier / Make / n8n.", { color: GRAY, after: 240 }),
    BODY("Почему это не слова", { bold: true, color: GREEN, before: 60, after: 40 }),
    BODY("• 336 автотестов и строгая типизация — путь заявки проверяется на каждой сборке.", { color: GRAY, after: 40 }),
    BODY("• Шифрование полей и слепой индекс дублей: телефон не лежит открытым нигде.", { color: GRAY, after: 40 }),
    BODY("• Запуск одной кнопкой: ./deploy.sh — Docker, healthcheck, обновление без простоя.", { color: GRAY, after: 240 }),
    wide(FILL_DARK, [
      BODY("Как проверить до старта", { sz: 30, bold: true, color: MINT, after: 80 }),
      BODY("Тестовая заявка: номер в Telegram, запись в CRM, ответ менеджера в чате. Бэкап — в тестовую папку.", { color: WHITE }),
    ], [165, 205]),
    BODY("Пришлите CRM и пример обращения — вопросы формы за день.", { bold: true, color: GREEN, before: 120 }),
  ],
});

// ---- EN ------------------------------------------------------------------------------
const en = deck({
  h2: "Telegram lead intake",
  footerLeft: "Lead intake for service teams",
  page1: [
    H1("The customer writes in Telegram. Your rep already knows why."),
    SUB("Phone, scope and urgency land in the team chat before the first callback. While a competitor is still asking “who’s this?”, your rep is already dialing."),
    LABEL("Thirty seconds of a real enquiry"),
    wide(FILL_CREAM, [
      SMALL("The customer’s message", CREAM_LABEL),
      BODY("“The cabinet under my kitchen sink is soaked. Could someone come out today?”", { sz: 34 }),
    ], [195, 205]),
    box({
      widths: [5953, 3742],
      margins: [130, 205],
      cells: [
        { fill: FILL_DARK, paras: [BODY("Kitchen sink leak", { sz: 34, bold: true, color: WHITE })] },
        { fill: FILL_DARK, paras: [BODY("Hot lead", { sz: 26, bold: true, color: MINT })] },
      ],
    }),
    box({
      widths: [4592, 5102],
      margins: [220, 205],
      cells: [
        { fill: FILL_PALE, paras: [
          SMALL("What we know"),
          BODY("House · ZIP 10001."),
          BODY("Callback number provided."),
        ]},
        { fill: FILL_PALE, paras: [
          SMALL("What the rep does"),
          BODY("Claims the request, replies from the chat."),
        ]},
      ],
    }),
    SMALL("Back in the customer’s chat"),
    BODY("“Mike can be there at 3 pm. Does that work for you?”", { sz: 30, bold: true, before: 60, after: 140 }),
    LABEL("Who it’s for already"),
    BODY("Home service companies, clinics, agencies — anyone taking enquiries in Telegram and working them in a CRM. Seven industry presets out of the box, plumbing to legal."),
  ],
  page2: [
    H1("Your questions. Your CRM. Your code."),
    SUB("I set the form up for your services: a Telegram enquiry becomes a HubSpot contact with a note, a deal and the source.", 40),
    LABEL("What you get"),
    ...PAIR("An intake that asks the right things", "Your rep knows what happened before the call. Questions, hours, priority rules — yours."),
    ...PAIR("Delivery that doesn’t lose leads", "CRM was down? The request waits and lands on its own — retries up to an hour, zero duplicates."),
    ...PAIR("Personal data under control", "Field-level AES-256-GCM, nightly encrypted backups, admin panel: leads, analytics, integration health.", 240),
    BODY("Twelve connections", { bold: true, color: GREEN, before: 60, after: 40 }),
    BODY("HubSpot, Salesforce, Pipedrive, Zoho, GoHighLevel, Bitrix24, Kommo / amoCRM, RetailCRM, Google Sheets, Slack, e-mail, Zapier / Make / n8n.", { color: GRAY, after: 240 }),
    BODY("Why these aren’t just words", { bold: true, color: GREEN, before: 60, after: 40 }),
    BODY("• 336 automated tests and strict typing — the full request path checked on every build.", { color: GRAY, after: 40 }),
    BODY("• Encrypted fields and a blind index for duplicates — a phone number is never stored in the clear.", { color: GRAY, after: 40 }),
    BODY("• One-button deploy: ./deploy.sh — Docker, healthcheck, zero-downtime restarts.", { color: GRAY, after: 240 }),
    wide(FILL_DARK, [
      BODY("See it work before you commit", { sz: 30, bold: true, color: MINT, after: 80 }),
      BODY("One test lead together: match the receipt to the CRM record, read the reply in the chat. Backups restore into a test folder.", { color: WHITE }),
    ], [165, 205]),
    BODY("Tell me your CRM and one typical enquiry — form questions within a day.", { bold: true, color: GREEN, before: 120 }),
  ],
});

(async () => {
  fs.mkdirSync("../out", { recursive: true });
  fs.writeFileSync("../out/Презентация Бота.docx", await Packer.toBuffer(ru));
  fs.writeFileSync("../out/Bot Presentation.docx", await Packer.toBuffer(en));
  console.log("done: two decks written to ../out/");
})();