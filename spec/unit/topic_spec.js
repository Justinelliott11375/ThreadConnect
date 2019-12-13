const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("Post", () => {

    beforeEach((done) => {
        this.topic;
        this.post;
        this.user;

        sequelize.sync({
            force: true
        }).then((res) => {

            User.create({
                    email: "valid@email.com",
                    password: "validPassword"
                })
                .then((user) => {
                    this.user = user;
                    Topic.create({
                            title: "Sample Title for Post Test",
                            description: "Sample title description for post tests.",

                            posts: [{
                                title: "Sample post title for post tests",
                                body: "Sample post description for post tests.",
                                userId: this.user.id
                            }]
                        }, {
                            include: {
                                model: Post,
                                as: "posts"
                            }
                        })
                        .then((topic) => {
                            this.topic = topic;
                            this.post = topic.posts[0];
                            done();
                        })
                })
        });
    });

    describe("#create()", () => {
        it("should create a topic object with a title, and description", (done) => {
            Topic.create({
                    title: "Sample Topic Title for #Create",
                    description: "Sample topic title for # create."
                })
                .then((topic) => {
                    expect(topic.title).toBe("Sample Topic Title for #Create");
                    expect(topic.description).toBe("Sample topic title for # create.");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
        })

        it("should not create a topic with missing title or description", (done) => {
            Topic.create({
                    title: "Sample Topic Title for #Create."
                })
                .then((post) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Topic.description cannot be null");
                    done();
                })
        });
    });
    describe("#get Posts()", () => {
        it("should return an array of post objects that are associated with the topic the method was called on", (done) => {
            this.topic.getPosts()
                .then((associatedPosts) => {
                    expect(associatedPosts[0].title).toBe("Sample post title for post tests");
                    expect(associatedPosts[0].body).toBe("Sample post description for post tests.");
                    expect(associatedPosts[0].topicId).toBe(this.topic.id);
                    done();
                });
        });
    })
});