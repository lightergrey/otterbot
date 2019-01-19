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

test("responds to benedict cumberbatch with no data", () => {
  return this.bot
    .usersInput([
      {
        user: "someUserId",
        channel: "someChannel",
        messages: [
          {
            text: "benedict cumberbatch",
            isAssertion: true
          }
        ]
      }
    ])
    .then(message => {
      return expect(replyHandler).toHaveBeenCalledWith(
        expect.any(Function),
        undefined,
        undefined
      );
    });
});

test("responds to benedict cumberbatch with only benedicts", () => {
  this.controller.storage.teams.save(
    { id: "benedicts", values: ["BRATWURST"] },
    () => {}
  );
  return this.bot
    .usersInput([
      {
        user: "someUserId",
        channel: "someChannel",
        messages: [
          {
            text: "benedict cumberbatch",
            isAssertion: true
          }
        ]
      }
    ])
    .then(message => {
      return expect(replyHandler).toHaveBeenCalledWith(
        expect.any(Function),
        { id: "benedicts", values: ["BRATWURST"] },
        undefined
      );
    });
});

test("responds to benedict cumberbatch with only benedicts", () => {
  this.controller.storage.teams.save(
    { id: "benedicts", values: ["BRATWURST"] },
    () => {}
  );
  this.controller.storage.teams.save(
    { id: "cumberbatches", values: ["CARBURETOR"] },
    () => {}
  );
  return this.bot
    .usersInput([
      {
        user: "someUserId",
        channel: "someChannel",
        messages: [
          {
            text: "benedict cumberbatch",
            isAssertion: true
          }
        ]
      }
    ])
    .then(message => {
      return expect(replyHandler).toHaveBeenCalledWith(
        expect.any(Function),
        { id: "benedicts", values: ["BRATWURST"] },
        { id: "cumberbatches", values: ["CARBURETOR"] }
      );
    });
});
