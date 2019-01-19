const replyHandler = require("./replyHandler");

test("handles no data values", () => {
  const reply = jest.fn();
  const data = undefined;

  replyHandler(reply, data);
  expect(reply).toHaveBeenCalledWith("No bukkits. Try `reload bukkits`");
});

test("handles no data values", () => {
  const reply = jest.fn();
  const data = [];

  replyHandler(reply, data);
  expect(reply).toHaveBeenCalledWith("No bukkits. Try `reload bukkits`");
});

test("gets a bukkit with no query", () => {
  const reply = jest.fn();
  const data = { values: [{ source: "source", fileName: "fileName" }] };

  replyHandler(reply, data);
  expect(reply).toHaveBeenCalledWith("sourcefileName");
});

test("handles no match", () => {
  const reply = jest.fn();
  const data = { values: [{ source: "source", fileName: "fileName" }] };

  replyHandler(reply, data);
  expect(reply).toHaveBeenCalledWith("sourcefileName");
});

test("gets a bukkit with a query", () => {
  const reply = jest.fn();
  const data = {
    values: [
      { source: "source", fileName: "fileName" },
      { source: "foo", fileName: "bar" }
    ]
  };

  replyHandler(reply, data, "ba");
  expect(reply).toHaveBeenCalledWith("foobar");
});

test("handles no match for query", () => {
  const reply = jest.fn();
  const data = { values: [{ source: "source", fileName: "fileName" }] };

  replyHandler(reply, data, "foo");
  expect(reply).toHaveBeenCalledWith("Couldn’t find a match.");
});

test("gets a bukkit with a query and source", () => {
  const reply = jest.fn();
  const data = {
    values: [
      { source: "source1", fileName: "fileName1" },
      { source: "source2", fileName: "fileName2" },
      { source: "source2", fileName: "fileName1" }
    ]
  };

  replyHandler(reply, data, "fileName1", "source2");
  expect(reply).toHaveBeenCalledWith("source2fileName1");
});
