const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Post", () => {
    beforeEach((done) => {
        this.topic;
        this.post;
        sequelize.sync({
            force: true
        }).then((res) => {
            Topic.create({
                    title: "Topic Title For Post Test",
                    description: "Topic description for post test"
                })
                .then((topic) => {
                    this.topic = topic;
                    Post.create({
                            title: "Post Title For Post Test",
                            body: "Post description for post test",
                            topicId: this.topic.id
                        })
                        .then((post) => {
                            this.post = post;
                            done();
                        });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });

    describe("#create()", () => {

        it("should create a post object with a title, body, and assigned topic", (done) => {
            Post.create({
                    title: "Post Title For Post Create Test",
                    body: "Post description for post create test.",
                    topicId: this.topic.id
                })
                .then((post) => {
                    expect(post.title).toBe("Post Title For Post Create Test");
                    expect(post.body).toBe("Post description for post create test.");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

        it("should not create a post with missing title, body, or assigned topic", (done) => {
            Post.create({
                    title: "Pros of Cryosleep during the long journey"
                })
                .then((post) => {

                    // post will be invalid, expectations will be in catch statement.

                    done();

                })
                .catch((err) => {

                    expect(err.message).toContain("Post.body cannot be null");
                    expect(err.message).toContain("Post.topicId cannot be null");
                    done();

                })
        });
    });

    describe("#setTopic()", () => {

        it("should associate a topic and a post together", (done) => {
            Topic.create({
                    title: "Topic Title for associating post test",
                    description: "Topic description for associating post test"
                })
                .then((newTopic) => {
                    expect(this.post.topicId).toBe(this.topic.id);
                    this.post.setTopic(newTopic)
                        .then((post) => {
                            expect(post.topicId).toBe(newTopic.id);
                            done();

                        });
                })
        });

    });
    describe("#getTopic()", () => {

        it("should return the associated topic", (done) => {

            this.post.getTopic()
                .then((associatedTopic) => {
                    expect(associatedTopic.title).toBe("Topic Title For Post Test");
                    done();
                });

        });

    });
});