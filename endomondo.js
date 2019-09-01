const fetch = require("node-fetch");
const _ = require("lodash");

const fetchNamesAndScores = (challengeId, authToken) =>
  new Promise((resolve, reject) => {
    if (!challengeId || !authToken) {
      reject("No challengeId or authToken provided");
    }

    const url = `https://api.mobile.endomondo.com/mobile/api/challenge/get?challengeId=${challengeId}&authToken=${authToken}&fields=leaderboard`;

    fetch(url)
      .then(resp => resp.json())
      .then(({ ranks }) => {
        const names = ranks.map(rank => {
          return rank.from.name;
        });

        const maxNameLength = _.maxBy(names, "length").length;

        // Pad names so scores right align
        const paddedNames = names.map(name => _.padEnd(name, maxNameLength));

        const scores = ranks.map(rank => rank.value + " km");

        const maxScoreLength = _.maxBy(scores, "length").length;

        const paddedScores = scores.map(score =>
          _.padStart(score, maxScoreLength)
        );

        resolve(_.zip(paddedNames, paddedScores));
      })
      .catch(error => {
        console.log(error);
      });
  });

exports.fetchNamesAndScores = fetchNamesAndScores;
