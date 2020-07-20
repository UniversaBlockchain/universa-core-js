import { expect } from 'chai';
import 'mocha';

import {
  encode64,
  decode64,
  PrivateKey,
  KeyRecord,
  Boss
} from '../src';

import { Dict } from '../src/utils';

let privateKey: PrivateKey;
const keyBin = decode64("HhisGAUQuCAAuPpkMr8wf6f/jCb2p1+5xDwCU25f/m3Q7dh3R31OUfD+WvAtDga1aifgufNudMwZREU6yiqADUIEBsELX6kFEHn0hd5zsniIoGchIhMWeaQ+F2EzB7wkK742QoY4mlbJpCsNzc8ehr/MsD19a8Im0YdJ4t1gudvQE7h+tRrImh+CLIN4FpHtvT0ZNroDKnNCnimOPbfe0jFip3cnC6bGdEvvpkLVJwWs1OQa6kkPBrdCMI3NrTlk21qxMu/ySukeRhCGsSp+KprNWinUWrVqfKmWkrKdLLePlyY+HB6sQkIBmZ7PbVd3nejRiTGeswOR+ZTHOvE4t5afVq+dfmWFsNlEGCQvKmwUqxPIw+kw5IcUdZrat0DvsJ2rDS6LwlnaNBLoEd7EgaPcI3lvjwuQ8XjCBQ05YrHwegTkLv6djqwfooS6ip4wCMmwPG1t294hP5BXcJ/i1uv2pkNdEQMacPbXjiPw0d5v0S02/VJv9oJ3NWLqtMhxgjFAhuKyzyz/0gqpQllW9zJrYQop3oNv1l6v0+FMo5ITfqB+NvuX5LjSYXimKLnj7BqwO4lVfOTaTehHaNGuBW4JqC5F3eRx1YWFmIM6VHlsXJ9KzmK9nSA1mDJe1v3GNq7bd8GDGsF89ROB2M44p8yN9tJnXIGn/pxB+7/2sB9suUcxgykkTePnnpIoo1AdoWppTG/qNtXDi0amhy3XwOg0kDQg60JNW4mo5did7Z6vkTPufi9yFcW+H3s9JB1IssbETopHDJ80Vl+xYAozLvEKxbectXw");
const keyPassword = "81bf60af-703c-4c28-8fc7-878860089df5";

describe('KeyRecord', () => {
  before(async () => {
    privateKey = await PrivateKey.unpack({ bin: keyBin, password: keyPassword });
  });

  it('should create simple KeyRecord', async () => {
    const recordBin64 = "FxtrZXkXG19fdGNSU0FQdWJsaWNLZXkzcGFja2VkxAkCHggcAQABxAAC4vJD/uUC+tELh0fHN/5MxSOTUPhWTbZX+8AAVLq1ZCENPqNrAmMXjoNT3on3FXrCjnfOiIONeSPFpBmsE3cnKpDgzv0FVo1tfhLtC/YEARZA7Q6LpXlNxaZREecIxg9upjmh6q84AsbIVaGmSvoh8HcprzkUHIfik26qivnw6RXe+zqLfGx9myJ2101zcX1rdBrsc+TgAH+X2mPw3NU7oTXwbdKi+b4oG0c+faaET17llSElTrSFmALkYinQ4nHYUlAAxxVryPULpIz5KiAJdHc4/+B7OJM+vNxJP2dGS6lbQaQBk5fFGf/SjRQTUsbXlSizgi9VQatcaOOVEA0mE2f5YW99JqSK4vuCbR7Am8e/KA3shyj5iz5BfXjrSgfLnwaBcUYWqeT2V1ySfBfiYJ4+T4lzov4NlW0GImnsPSKR88VO4TmR/h62uvYXp1w+72qxTvXHc61iBwKELerFicAIc0rog9RyAZgxuSA0VHPawYomBG4knN9o46vkIpDc/9afEBz4Ad3x+/fH8J4H6KbZFDBYXRbwET4IxOWlvOoJ1b/Z9NrDLo+8ShV6GhwbXGUX4uHi03kIxjMauxxCGql1tHtbh51Ru4Vswc06Pzy/Cfj9pjvbkBQQo6g5/ggLMZ/5Yf64h9FBYO1Halbwydkkmmx0IwWuHIMQTjGQIsclS0tleVJlY29yZA==";
    const publicKey = privateKey.publicKey;
    const record = KeyRecord.create(publicKey);
    const packed = Boss.dump(record);

    expect(encode64(packed)).to.equal(recordBin64);
  });

  it('should create KeyRecord with extra fields', async() => {
    const recordBin64 = "HxtrZXkXG19fdGNSU0FQdWJsaWNLZXkzcGFja2VkxAkCHggcAQABxAAC4vJD/uUC+tELh0fHN/5MxSOTUPhWTbZX+8AAVLq1ZCENPqNrAmMXjoNT3on3FXrCjnfOiIONeSPFpBmsE3cnKpDgzv0FVo1tfhLtC/YEARZA7Q6LpXlNxaZREecIxg9upjmh6q84AsbIVaGmSvoh8HcprzkUHIfik26qivnw6RXe+zqLfGx9myJ2101zcX1rdBrsc+TgAH+X2mPw3NU7oTXwbdKi+b4oG0c+faaET17llSElTrSFmALkYinQ4nHYUlAAxxVryPULpIz5KiAJdHc4/+B7OJM+vNxJP2dGS6lbQaQBk5fFGf/SjRQTUsbXlSizgi9VQatcaOOVEA0mE2f5YW99JqSK4vuCbR7Am8e/KA3shyj5iz5BfXjrSgfLnwaBcUYWqeT2V1ySfBfiYJ4+T4lzov4NlW0GImnsPSKR88VO4TmR/h62uvYXp1w+72qxTvXHc61iBwKELerFicAIc0rog9RyAZgxuSA0VHPawYomBG4knN9o46vkIpDc/9afEBz4Ad3x+/fH8J4H6KbZFDBYXRbwET4IxOWlvOoJ1b/Z9NrDLo+8ShV6GhwbXGUX4uHi03kIxjMauxxCGql1tHtbh51Ru4Vswc06Pzy/Cfj9pjvbkBQQo6g5/ggLMZ/5Yf64h9FBYO1Halbwydkkmmx0IwWuHIMQTjGQIscLYRcLYgtjC2R5c0hDeIUlS0tleVJlY29yZA==";
    const publicKey = privateKey.publicKey;

    const record = KeyRecord.create(publicKey, { "a": { "b": "c", "d": new Date(1594942579000) } });
    const packed = Boss.dump(record);

    expect(encode64(packed)).to.equal(recordBin64);
  });

  it('should unpack KeyRecord with extra fields', async() => {
    const recordBin64 = "HxtrZXkXG19fdGNSU0FQdWJsaWNLZXkzcGFja2VkxAkCHggcAQABxAAC4vJD/uUC+tELh0fHN/5MxSOTUPhWTbZX+8AAVLq1ZCENPqNrAmMXjoNT3on3FXrCjnfOiIONeSPFpBmsE3cnKpDgzv0FVo1tfhLtC/YEARZA7Q6LpXlNxaZREecIxg9upjmh6q84AsbIVaGmSvoh8HcprzkUHIfik26qivnw6RXe+zqLfGx9myJ2101zcX1rdBrsc+TgAH+X2mPw3NU7oTXwbdKi+b4oG0c+faaET17llSElTrSFmALkYinQ4nHYUlAAxxVryPULpIz5KiAJdHc4/+B7OJM+vNxJP2dGS6lbQaQBk5fFGf/SjRQTUsbXlSizgi9VQatcaOOVEA0mE2f5YW99JqSK4vuCbR7Am8e/KA3shyj5iz5BfXjrSgfLnwaBcUYWqeT2V1ySfBfiYJ4+T4lzov4NlW0GImnsPSKR88VO4TmR/h62uvYXp1w+72qxTvXHc61iBwKELerFicAIc0rog9RyAZgxuSA0VHPawYomBG4knN9o46vkIpDc/9afEBz4Ad3x+/fH8J4H6KbZFDBYXRbwET4IxOWlvOoJ1b/Z9NrDLo+8ShV6GhwbXGUX4uHi03kIxjMauxxCGql1tHtbh51Ru4Vswc06Pzy/Cfj9pjvbkBQQo6g5/ggLMZ/5Yf64h9FBYO1Halbwydkkmmx0IwWuHIMQTjGQIscLYRcLYgtjC2R5c0hDeIUlS0tleVJlY29yZA==";
    const record: KeyRecord = Boss.load(decode64(recordBin64));

    const level1 = record.extra.a as Dict;
    const d = level1.d as Date;

    expect(level1.b).to.equal("c");
    expect(d.getTime()).to.equal(1594942579000);
    expect(encode64(record.keyPacked)).to.equal(encode64(privateKey.publicKey.packed));
  });
});
