module.exports = (controller, id) => {
  return new Promise((resolve, reject) => {
    controller.storage.teams.get(id, (err, data) => {
      if (err !== null) {
        reject(err);
      }
      resolve(data);
    });
  });
};
