const replyHandler = require("./replyHandler");

test("handles no benedict data values", () => {
  const reply = jest.fn();

  replyHandler(reply);
  expect(reply).toHaveBeenCalledWith("No benedicts.");
});

test("handles no cumberbatches data values", () => {
  const reply = jest.fn();

  replyHandler(reply, { id: "benedicts", values: ["BRATWURST"] });
  expect(reply).toHaveBeenCalledWith("No cumberbatches.");
});

test("handles the happy case", () => {
  const reply = jest.fn();

  replyHandler(
    reply,
    { id: "benedicts", values: ["BRATWURST"] },
    { id: "cumberbatches", values: ["CARBURETOR"] }
  );
  expect(reply).toHaveBeenCalledWith("BRATWURST CARBURETOR");
});
