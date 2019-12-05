const Topic = require("./models").Topic;

module.exports = {
    getAllTopics(callback) {
        return Topic.findAll()
            .then((topics) => {
                callback(null, topics);
            })
            .catch((err) => {
                callback(err);
            })
    },

    getTopic(id, callback) {
        return Topic.findById(id)
            .then((topic) => {
                callback(null, topic);
            })
            .catch((err) => {
                callback(err);
            })
    },

    addTopic(newTopic, callback) {
        return Topic.create({
                title: newTopic.title,
                description: newTopic.description
            })
            .then((topic) => {
                callback(null, topic);
            })
            .catch((err) => {
                callback(err);
            })
    },

    deleteTopic(id, callback) {
        return Topic.destroy({
                where: {
                    id
                }
            })
            .then((topic) => {
                callback(null, topic);
            })
            .catch((err) => {
                callback(err);
            })
    },

    updateTopic(id, updateTopic, callback) {
        return Topic.findById(id)
            .then((topic) => {
                if (!topic) {
                    return callback("Topic not found");
                }
                topic.update(updateTopic, {
                        fields: Object.keys(updateTopic)
                    })
                    .then(() => {
                        callback(null, topic);
                    })
                    .catch((err) => {
                        callback(err);
                    });
            });
    }
}