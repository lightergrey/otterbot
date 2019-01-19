const Botmock = require("botkit-mock");
const controller = require("./controller");

const replyHandler = require("./replyHandler");
jest.mock("./replyHandler");

beforeEach(() => {
  this.controller = Botmock({});
  this.bot = this.controller.spawn({ type: "slack" });
  controller(this.controller);
});

test("does not respond to other", () => {
  return this.bot
    .usersInput([
      {
        user: "someUserId",
        channel: "someChannel",
        messages: [
          {
            text: "other",
            isAssertion: true
          }
        ]
      }
    ])
    .then(message => {
      return expect(replyHandler).not.toHaveBeenCalled();
    });
});

test("ignores aw yiss without phrase", () => {
  return this.bot
    .usersInput([
      {
        user: "someUserId",
        channel: "someChannel",
        messages: [
          {
            text: "aw yiss",
            isAssertion: true
          }
        ]
      }
    ])
    .then(message => {
      return expect(replyHandler).not.toHaveBeenCalled();
    });
});

test("responds to aw yiss with phrase", () => {
  return this.bot
    .usersInput([
      {
        user: "someUserId",
        channel: "someChannel",
        messages: [
          {
            text: "aw yiss foo",
            isAssertion: true
          }
        ]
      }
    ])
    .then(message => {
      return expect(replyHandler).toHaveBeenCalledWith(
        expect.any(Function),
        "foo"
      );
    });
});
