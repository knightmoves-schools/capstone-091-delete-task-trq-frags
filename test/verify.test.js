const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should create a new task when a new description and status is entered and display the task in the status column that corresponds to the task status', async function() {
    const todoCardsBefore = await page.$$eval('#todo-cards > .card', (results) => results );
    expect(todoCardsBefore.length).toBe(3);

    await page.evaluate(() => {
      document.getElementById('delete-task-1').click();
    });
    
    const todoCardsAfter = await page.$$eval('#todo-cards > .card', (results) => results );
    expect(todoCardsAfter.length).toBe(2);
});
});
