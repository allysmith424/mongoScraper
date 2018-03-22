var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TeamSchema = new Schema({

  team: {
    type: String,
    required: true
  },
  ranking: {
    type: Number,
    required: true
  },
  flag: {
    type: String,
    required: true
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
