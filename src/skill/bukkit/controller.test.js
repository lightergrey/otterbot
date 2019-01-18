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

test("responds to bukkit with no data", () => {
  return this.bot
    .usersInput([
      {
        user: "someUserId",
        channel: "someChannel",
        messages: [
          {
            text: "bukkit",
            isAssertion: true
          }
        ]
      }
    ])
    .then(message => {
      return expect(replyHandler).toHaveBeenCalledWith(
        expect.any(Function),
        undefined,
        undefined,
        undefined
      );
    });
});

test("responds to bukkit only", () => {
  this.controller.storage.teams.save(
    { id: "bukkits", values: [{ source: "source", filename: "filename" }] },
    () => {}
  );
  return this.bot
    .usersInput([
      {
        user: "someUserId",
        channel: "someChannel",
        messages: [
          {
            text: "bukkit",
            isAssertion: true
          }
        ]
      }
    ])
    .then(message => {
      return expect(replyHandler).toHaveBeenCalledWith(
        expect.any(Function),
        { id: "bukkits", values: [{ filename: "filename", source: "source" }] },
        undefined,
        undefined
      );
    });
});

test("responds to bukkit with query", () => {
  this.controller.storage.teams.save(
    { id: "bukkits", values: [{ source: "source", filename: "filename" }] },
    () => {}
  );
  return this.bot
    .usersInput([
      {
        user: "someUserId",
        channel: "someChannel",
        messages: [
          {
            text: "bukkit foo",
            isAssertion: true
          }
        ]
      }
    ])
    .then(message => {
      return expect(replyHandler).toHaveBeenCalledWith(
        expect.any(Function),
        { id: "bukkits", values: [{ filename: "filename", source: "source" }] },
        "foo",
        undefined
      );
    });
});

test("responds to bukkit with query and source", () => {
  this.controller.storage.teams.save(
    { id: "bukkits", values: [{ source: "source", filename: "filename" }] },
    () => {}
  );
  return this.bot
    .usersInput([
      {
        user: "someUserId",
        channel: "someChannel",
        messages: [
          {
            text: "bukkit foo from bar",
            isAssertion: true
          }
        ]
      }
    ])
    .then(message => {
      return expect(replyHandler).toHaveBeenCalledWith(
        expect.any(Function),
        { id: "bukkits", values: [{ filename: "filename", source: "source" }] },
        "foo",
        "bar"
      );
    });
});
