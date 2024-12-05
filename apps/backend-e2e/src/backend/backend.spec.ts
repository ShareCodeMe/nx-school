import {INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import request from "supertest";
import {AppModule} from "../../../backend/src/app/app.module";

let app: INestApplication;
let server: any;

async function setup() {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = module.createNestApplication();
  app.setGlobalPrefix('api');

  await app.init();
  server = app.getHttpServer();
}

beforeAll(async () => {
  await setup();
})

afterAll(async () => {
  await app.close();
})

describe('GET /api', () => {
  it('should return 200', async () => {
    const res = await request(server).get('/api');

    expect(res.statusCode).toBe(200);
  });
})

