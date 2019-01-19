const nock = require("nock");
const replyHandler = require("./replyHandler");

test("handles phrase", () => {
  nock("http://awyisser.com/api/generator/")
    .post("/")
    .reply(200, { link: "bar" });

  const reply = jest.fn();

  return replyHandler(reply, "foo").then(res =>
    expect(reply).toHaveBeenCalledWith("bar")
  );
});

test("handles api error", () => {
  nock("http://awyisser.com/api/generator/")
    .post("/")
    .reply(500, "Internal Server Error");

  const reply = jest.fn();

  return replyHandler(reply, "foo").then(res =>
    expect(reply).toHaveBeenCalledWith("Aw no: Internal Server Error")
  );
});
