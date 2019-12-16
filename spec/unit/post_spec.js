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
                    this.user = user; //store the user

                    Topic.create({
                            title: "Sample Topic Title",
                            description: "Sample topic description",
                            posts: [{
                                title: "Sample post title",
                                body: "Sample post body",
                                userId: this.user.id
                            }]
                        }, {
                            include: {
                                model: Post,
                                as: "posts"
                            }
                        })
                        .then((topic) => {
                            this.topic = topic; //store the topic
                            this.post = topic.posts[0]; //store the post
                            done();
                        })
                })
        });
    });

    describe("#create()", () => {
        it("should create a post object with a title, body, and assigned topic and user", (done) => {
            Post.create({
                    title: "Sample post title for post create",
                    body: "Sample post description for post create.",
                    topicId: this.topic.id,
                    userId: this.user.id
                })
                .then((post) => {
                    expect(post.title).toBe("Sample post title for post create");
                    expect(post.body).toBe("Sample post description for post create.");
                    expect(post.topicId).toBe(this.topic.id);
                    expect(post.userId).toBe(this.user.id);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
        })

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
                    expect(associatedTopic.title).toBe("Sample Topic Title");
                    done();
                });

        });

    });

    describe("#setUser()", () => {

        it("should associate a post and a user together", (done) => {

            User.create({
                    email: "validUser@email.com",
                    password: "validPassword2"
                })
                .then((newUser) => {

                    expect(this.post.userId).toBe(this.user.id);

                    this.post.setUser(newUser)
                        .then((post) => {

                            expect(this.post.userId).toBe(newUser.id);
                            done();

                        });
                })
        });

    });

    describe("#getUser()", () => {

        it("should return the associated topic", (done) => {

            this.post.getUser()
                .then((associatedUser) => {
                    expect(associatedUser.email).toBe("valid@email.com");
                    done();
                });

        });

    });
});